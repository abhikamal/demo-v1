# Croevo AI - Frontend Prototype

Croevo AI is a premium frontend prototype for a next-generation game asset and architecture generation platform. It features a sleek, dark-mode `#0077b6` (deep blue) neon aesthetic, a live AI chat assistant powered by Gemini, a simulated cost estimation engine, and a fully functional Retro Arcade Lounge containing playable HTML5 Canvas mini-games.

## Features

- **Live AI Chat Integration**: Real-time HTTP requests to the Gemini AI API for conversational game design.
- **Intent Detection**: Seamlessly transition from chat to the cost estimation engine via natural language processing or direct UI actions.
- **Cost Estimation Engine**: Procedurally generates structural constraints and simulated costs based on the chat context.
- **Retro Arcade Lounge**: A fully interactive waiting room containing 10 playable mini-games built from scratch using React and HTML5 Canvas, allowing users to play while they wait for "cloud compilation" to finish. The games include:
  1. **Neon Snake**: Classic snake with grid wrapping and score tracking.
  2. **Tetris Matrix**: Full engine with 7 standard shapes, proper rotations, and line-clearing.
  3. **Space Invaders**: 50-enemy marching grid with wave and collision logic.
  4. **Cyber Pong**: Smooth 60fps physics with precise paddle reflection.
  5. **Block Breaker**: Classic breakout with destructible neon bricks.
  6. **Flappy Bird Clone**: Full gravity engine with scrolling pipes.
  7. **Asteroids**: 360-degree vector rotation, projectiles, and splitting asteroids.
  8. **Candy Match**: 8x8 match-3 grid with cascading gravity.
  9. **Maze Runner**: Static 2D grid maze with a roaming AI enemy.
  10. **Neon Pinball**: Custom physics sandbox with repulsive bumpers.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Vanilla CSS for core neon tokens)
- **Icons**: Lucide-React
- **AI Integration**: Google Gemini API (`gemini-flash-latest`)

## Project Architecture & Directory Structure

The application state is managed globally via React Context (`AppContext.tsx`), which handles navigation routing, chat history, and the user's virtual coin balance across all views without losing state.

```text
/
├── public/                 # Static assets (including custom logo.jpg)
├── src/
│   ├── components/         
│   │   └── games/          # HTML5 Canvas mini-games (SnakeGame, PongGame, etc.)
│   ├── context/            
│   │   └── AppContext.tsx  # Global state manager (routing, chat history, wallet)
│   ├── views/              # Main application screens
│   │   ├── ArcadeLounge.tsx # Generation dashboard & mini-game grid
│   │   ├── CoinMarket.tsx   # Virtual currency purchasing flow
│   │   ├── CostEstimation.tsx # Simulated game compilation and pricing logic
│   │   ├── GameLab.tsx      # Main AI Chat interface interacting with Gemini
│   │   └── Home.tsx         # Landing page
│   ├── App.tsx             # Root component wrapping context providers
│   ├── AppContent.tsx      # Core application router
│   ├── index.css           # Global CSS variables and Tailwind imports
│   └── main.tsx            # React DOM entry point
├── .env                    # Environment variables (VITE_AI_API_KEY)
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind theme configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A free Google Gemini API Key

### Setup Instructions

1. **Install Dependencies**
   Open your terminal in the project root and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Ensure you have a `.env` file in the root directory containing your Gemini API key:
   ```env
   VITE_AI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the Development Server**
   Run the following command to start Vite:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Navigation Flow

1. **Home**: Start a new project or view current balance.
2. **Game Lab**: Chat with the AI to design your game. Type "finish" or click "Finish & Estimate" to proceed.
3. **Cost Estimation**: Review the simulated compilation costs based on your chat. If your balance is too low, you are prompted to purchase coins.
4. **Coin Market**: Purchase simulated coins to fund the project.
5. **Arcade Lounge**: The final destination after purchasing and compiling. Displays an estimated build timer and offers playable retro arcade games while you wait.
