# AI Time Tracking & Calendar Intelligence Dashboard

An enterprise-grade AI Time Tracking Dashboard built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

This application solves the manual time-tracking burden for customer-facing teams at Smartly.io by transforming messy, real-world Google Calendar data into structured, actionable intelligence—automatically categorizing meetings across a 15-category, attributing time to client accounts, and quantifying team-wide client investments.

---

## Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm`

### 2. Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_AI_PROXY_URL=
FASTTRACK_AI_PROXY_URL=
FASTTRACK_API_KEY_RESOURCE=
FASTTRACK_EMPLOYEES_RESOURCE=
FASTTRACK_COMPANIES_RESOURCE=
FASTTRACK_EVENTS_RESOURCE=
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Available Scripts
```bash
npm run dev      # Run local development server with Turbopack / HMR
npm run build    # Build production bundle and run static type check
npm run start    # Start production server
npm run lint     # Run ESLint validation
```

---

## Folder Structure

```text
ai_time_tracking_dashboard/
├── src/
│   ├── app/                      # Next.js App Router (Server components, layouts, API routes)
│   │   ├── analytics/            # Executive analytics dashboard page
│   │   ├── calendar/             # Monthly interactive calendar page
│   │   ├── sync/                 # Synchronization overview, AI pipeline & CSV export page
│   │   ├── employees/            # Team members directory page
│   │   ├── companies/            # Client companies directory page
│   │   ├── api/                  # API endpoints (/api/categorize, /api/events, /api/sync)
│   │   ├── layout.tsx            # Root dashboard layout with sidebar navigation
│   │   └── page.tsx              # Homepage overview & quick-access cards
│   ├── components/               # Modular UI components grouped by feature domain
│   │   ├── analytics/            # Analytics panels, summary metrics, bar & donut charts
│   │   ├── calendar/             # Monthly grid, mini navigator, toolbar & day modal
│   │   ├── events/               # Meeting log table, filters & event inspection modal
│   │   ├── sync/                 # Sync summary cards, trigger form, logs & cache manager
│   │   ├── employees/            # Team member directory cards
│   │   ├── companies/            # Client account directory cards
│   │   └── Sidebar.tsx           # Global sidebar navigation with route badges
│   ├── constants/                # Categorization taxonomy, colors & navigation constants
│   ├── data/                     # Local JSON persistence layer (raw-events, categorized-events, sync-meta)
│   ├── hooks/                    # Reusable React client hooks (e.g. useEmployeeCalendar)
│   ├── lib/                      # Business logic, OpenAI prompt engine & atomic file storage
│   ├── types/                    # Shared TypeScript types & data schemas
│   ├── utils/                    # Formatting, badge styles, date math & CSV export utilities
│   └── styles/                   # Tailwind CSS v4 design tokens and global styles
└── AGENTS.md                     # Development conventions & coding guidelines
```

---

## AI Prompt & JSON Schema Design

### AI Prompt Architecture (`src/lib/categorize.ts`)
The prompt instructs the model to act as an operations intelligence specialist for Smartly.io:
- **Taxonomy Adherence**: Evaluates calendar events against 15 standardized categories across **Client Work** (11 categories), **Internal Work** (3 categories), and **Time Off** (1 category).
- **Client Attribution**: Matches external attendee email domains (e.g. `@veloura.fi`, `@m-label.com`, `@stryn.ai`) and descriptions against the company's CRM portfolio to resolve client names and IDs.
- **Categorization Rules**: Defined boundary guidelines separate client-facing calls from internal prep, feed catalog errors from platform bugs, and out-of-scope campaign support from standard delivery.

### JSON Schema (`response_format`)
The API proxy enforces strict structured outputs (`strict: true`) to eliminate hallucinated category strings and guarantee 100% type safety:

```json
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "category": {
            "type": "string",
            "enum": [
              "Client-facing meetings and comms",
              "Strategic meetings / QBRs",
              "Contract / commercial work",
              "Onboarding and training",
              "Analysis and insights",
              "Campaign support (beyond scope)",
              "Internal client work",
              "Partner meetings",
              "Travel & socials",
              "Troubleshooting (feeds)",
              "Troubleshooting (Smartly)",
              "Learning",
              "Team/company calls",
              "Other internal tasks",
              "PTO"
            ]
          },
          "clientName": { "type": ["string", "null"] },
          "clientId": { "type": ["string", "null"] },
          "reason": { "type": "string" }
        },
        "required": ["id", "category", "clientName", "clientId", "reason"],
        "additionalProperties": false
      }
    }
  },
  "required": ["items"],
  "additionalProperties": false
}
```