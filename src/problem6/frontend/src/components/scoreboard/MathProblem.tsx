import { useState, useEffect } from "react"
import { Calculator, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { scoreAPI, type MathProblem as MathProblemType } from "@/lib/api"
import { socketManager } from "@/lib/socket"
import { useAuth } from "@/hooks/useAuth"
import { useConnectionStatus } from "@/hooks/useConnectionStatus"
import { useAuthStore } from "@/stores/authStore"

interface MathProblemProps {
  onScoreUpdate?: (newScore: number, pointsEarned: number) => void
  className?: string
}

type FeedbackType = {
  type: "success" | "error" | null
  message: string
}

export function MathProblem({ onScoreUpdate, className }: MathProblemProps) {
  const [problem, setProblem] = useState<MathProblemType | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackType>({ type: null, message: "" })
  const [cooldownTime, setCooldownTime] = useState(0)
  const { user, updateUser } = useAuthStore()
  const connectionStatus = useConnectionStatus()
  const isConnected = connectionStatus === "connected"

  // Generate initial problem
  useEffect(() => {
    generateNewProblem()
  }, [])

  // Listen for real-time score updates
  useEffect(() => {
    if (!isConnected) return

    const handleScoreUpdate = (data: {
      new_score: number
      points_earned: number
      updated_at: string
    }) => {
      console.log("Received score update:", data)
      if (!user) return
      updateUser({ ...user, score: data.new_score })
    }

    // Only set up socket listener if connected
    socketManager.onScoreUpdate(handleScoreUpdate)

    return () => {
      socketManager.offScoreUpdate(handleScoreUpdate)
    }
  }, [onScoreUpdate, isConnected])

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  const generateNewProblem = async () => {
    try {
      setIsLoading(true)
      setFeedback({ type: null, message: "" })
      setUserAnswer("")

      const newProblem = await scoreAPI.generateProblem()
      setProblem(newProblem)
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error.response?.data?.message || "Failed to generate problem",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!problem || !userAnswer.trim()) return

    const answer = parseInt(userAnswer.trim())
    if (isNaN(answer)) {
      setFeedback({
        type: "error",
        message: "Please enter a valid number",
      })
      return
    }

    // Client-side validation: check if answer is correct
    const correctAnswer = calculateCorrectAnswer()
    if (answer !== correctAnswer) {
      setFeedback({
        type: "error",
        message: `Incorrect! Try again!`,
      })
      setIsSubmitting(false)
      return
    }

    try {
      setIsSubmitting(true)
      setFeedback({ type: null, message: "" })

      const response = await scoreAPI.executeAction(
        problem.action,
        problem.operand1,
        problem.operand2,
        answer,
      )

      if (!response.success) {
        setFeedback({ type: "error", message: response.message })
        setIsSubmitting(false)
        return
      }
      setFeedback({ type: "success", message: `Correct! +${response.points_earned} points` })
      // Generate new problem after a short delay
      setTimeout(() => generateNewProblem(), 1000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to submit answer"
      setFeedback({ type: "error", message: errorMessage })

      // Check if it's a cooldown error
      if (errorMessage.includes("cooldown") || errorMessage.includes("wait")) {
        const match = errorMessage.match(/(\d+)\s*seconds?/)
        if (match) {
          setCooldownTime(parseInt(match[1]))
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getOperatorSymbol = (action: string) => {
    switch (action) {
      case "plus":
        return "+"
      case "minus":
        return "-"
      default:
        return "?"
    }
  }

  const getOperatorIcon = (action: string) => {
    switch (action) {
      case "plus":
        return <Plus className="h-4 w-4" />
      case "minus":
        return <Minus className="h-4 w-4" />
      default:
        return <Calculator className="h-4 w-4" />
    }
  }

  const calculateCorrectAnswer = () => {
    if (!problem) return 0
    switch (problem.action) {
      case "plus":
        return problem.operand1 + problem.operand2
      case "minus":
        return problem.operand1 - problem.operand2
      default:
        return 0
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Math Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Generating problem...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Math Challenge
        </CardTitle>
        <p className="text-sm text-gray-600">
          Solve math problems to earn points and climb the leaderboard!
        </p>
      </CardHeader>
      <CardContent>
        {problem && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-center gap-4 text-2xl font-bold">
                  <span className="text-blue-600">{problem.operand1}</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    {getOperatorSymbol(problem.action)}
                  </span>
                  <span className="text-blue-600">{problem.operand2}</span>
                  <span className="text-gray-600">=</span>
                  <span className="text-green-600">?</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Enter your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={isSubmitting || cooldownTime > 0}
                  className="text-center text-lg"
                  autoFocus
                />

                {feedback.message && (
                  <div
                    className={`p-3 rounded-md text-sm ${
                      feedback.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || cooldownTime > 0 || !userAnswer.trim()}
                >
                  {cooldownTime > 0
                    ? `Wait ${cooldownTime}s`
                    : isSubmitting
                    ? "Submitting..."
                    : "Submit Answer"}
                </Button>
              </div>
            </div>
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateNewProblem}
                disabled={isLoading || isSubmitting || cooldownTime > 0}
              >
                New Problem
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
