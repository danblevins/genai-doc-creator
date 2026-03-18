# Doc Creator

**Problem Statement**: Business Professional dedicate excessive time and resources to manually creating business documents. This inefficiency bottlenecks productivity, delays strategic decision-making, and diverts energy away from high-value, creative work. We need a streamlined solution that accelerates the creation of comprehensive first drafts without compromising quality, structural integrity, or thoroughness.

Proof of concept for generating first-draft business documents (two-pagers and quarterly/monthly reviews) from guided input. Reduces time from preparation to a solid first draft.

[LIVE PROOF OF CONCEPT ON NETLIFY](https://gendocc.netlify.app/)

The video demonstration highlights the following features:
- Interface Overview: The tool features a clean, web-based dashboard where users can input parameters or source material to generate structured documents.
- AI Integration: It showcases how the system processes prompts or existing data to draft content, aimed at professional or technical documentation.
- Workflow: The video walks through the steps of selecting a template, generating the text, and reviewing the output within the application.

## Requirements

- Node.js 18+ (20+ recommended for the Vite client; the API runs on Node 18+).

## Quick start

1. Install dependencies (root and client):

   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. Run the app (API + frontend):

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173). Choose a document type (or use **Two-pager (with AI)** / **Quarterly review (with AI)** to generate from sample data via the Gemini API), fill the form if not using AI, generate the draft, edit in place, then export as PDF or DOCX.

## Scripts

- `npm run dev` — start API server and Vite dev server (client proxies `/api` to the server).
- `npm run server` — start API only (port 3001).
- `npm run client` — start Vite only (port 5173).
- `npm run build` — build the client for production.

## Document types

- **Two-pager**: Title plus sections (e.g. Executive summary, Problem/opportunity, Solution, Key metrics, Ask/next steps). Content is one paragraph per line.
- **Quarterly / monthly review**: Period, org name, highlights, key metrics (table), challenges, next-period priorities, support needed.

## Flow

1. Select document type.
2. Fill the guided form (sections and bullets or short paragraphs).
3. Click **Generate draft** — the server renders the document from templates.
4. Edit the draft on screen (click any text in the preview).
5. **Save as PDF** — opens a print window; choose “Save as PDF” to download.
6. **Download DOCX** — downloads a Word document from the current preview content.

## Environment

- **GEMINI_API_KEY** (required for "with AI"): Get an API key from [Google AI Studio](https://aistudio.google.com/apikey). Copy `.env.example` to `.env` and set `GEMINI_API_KEY=...`. (`.env` is gitignored; never commit it.)
- `PORT` (default `3001`) sets the API server port.

## Deploy to Netlify

The app can be deployed to Netlify with no client changes. Netlify runs the frontend build and two serverless functions for draft generation and DOCX export.

1. Connect the repo to Netlify. Build command and publish directory are in `netlify.toml` (`npm run build`, `client/dist`).
2. In Netlify **Site settings → Environment variables**, set **GEMINI_API_KEY** so "Generate with AI" works.
3. Node 20 is used for the build and functions (set in `netlify.toml`).

## Adding a new document type

1. Add a Handlebars template in `server/templates/<type>.hbs`.
2. Add a form component in `client/src/components/` that collects payload and calls `onSubmit(payload)`.
3. In `App.jsx`, add a branch for the new type in the form step and pass the correct `documentType` to the API.

## Tech

- **Backend**: Node, Express, Handlebars, html-to-docx, @google/genai (Gemini API).
- **Frontend**: React (Vite). Editable preview via `contenteditable`; export uses the current DOM.
