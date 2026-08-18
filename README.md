# AI Time Tracking Dashboard

An AI Time Tracking Dashboard built with **Next.js 15**, **TypeScript**, and **Tailwind CSS v4**.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Formatting**: Prettier
- **Linting**: ESLint

## Project Structure

```text
.
├── public/
├── src/
│   ├── app/          # Routes, layouts, and page views
│   ├── components/   # Reusable UI components (Sidebar, Footer, etc.)
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Integration clients & core logic
│   ├── styles/       # Global CSS styles (Tailwind v4)
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility & helper functions
├── .gitignore
├── .prettierrc.json
├── AGENTS.md         # Coding standards and development guidelines
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## 🛠️ Getting Started

### Installation

Install dependencies with npm:

```bash
npm install
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Available Scripts

- `npm run dev`: Start local development server
- `npm run build`: Build production application bundle
- `npm run start`: Start production server
- `npm run lint`: Run ESLint checks
- `npm run prettier`: Format codebase with Prettier

## 📖 Development Conventions

Development conventions and AI coding guidelines are documented in [`AGENTS.md`](./AGENTS.md). Components use default exports (`export default`), CSS is centralized in `src/styles/globals.css`, and formatting follows `.prettierrc.json`.
