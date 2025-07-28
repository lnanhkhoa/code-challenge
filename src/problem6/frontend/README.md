# Live Scoreboard Frontend

A modern, real-time math competition platform built with React, TypeScript, Socket.io, and TailwindCSS. Users can solve math problems to earn points and compete on a live leaderboard with real-time updates.

## Features

- **Real-time Competition**: Live leaderboard updates via Socket.io
- **Math Challenges**: Simple addition and subtraction problems
- **User Authentication**: Secure login and registration
- **Modern UI**: Built with shadcn/ui components and TailwindCSS
- **Responsive Design**: Works on desktop and mobile devices
- **Live Updates**: Real-time score updates and leaderboard changes
- **Connection Status**: Visual indicators for WebSocket connection status

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **Real-time Communication**: Socket.io client
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and Yarn
- Backend API server running on `http://localhost:3001`

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication forms
│   ├── scoreboard/      # Scoreboard components
│   └── layout/          # Layout and routing components
├── pages/               # Route pages
│   ├── HomePage.tsx     # Landing page
│   ├── LoginPage.tsx    # Authentication page
│   ├── DashboardPage.tsx # Protected dashboard
│   └── LeaderboardPage.tsx # Public leaderboard
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API clients
│   ├── api.ts          # HTTP API client
│   ├── socket.ts       # Socket.io client
│   └── utils.ts        # Utility functions
└── App.tsx             # Main application with routing
```
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
