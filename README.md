# Tava

A warm, conversational AI meal recommender for Indian households. Tell it what's in your kitchen and it suggests five things to cook tonight.

## Stack

- **React 18** + **Vite 6** — zero-config, fast HMR
- **Tailwind CSS** — utility-first styling, no UI library
- **localStorage** — pantry, saved meals, preferences persist on-device
- **Vercel Serverless Functions** — `/api/suggest` calls the Gemini API server-side so your key never ships to the client
- **No state library, no UI kit, no animation library** — just React + plain CSS keyframes

## Getting started

```bash
npm install
npm run dev      # localhost:5173
npm run build    # outputs to dist/
npm run preview  # preview the prod build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it on [vercel.com](https://vercel.com). Vercel auto-detects Vite (build = `npm run build`, output = `dist/`).
3. Add `GEMINI_API_KEY` in Project → Settings → Environment Variables.
   (Without it, the app falls back to local scoring — still fully functional.)
4. Deploy.

`vercel.json` is included with the correct SPA rewrites and framework hint.

## Environment variables

Server-side (set in Vercel):

| Key             | Required | Default            | Notes                            |
|-----------------|----------|--------------------|----------------------------------|
| `GEMINI_API_KEY`| Optional | —                  | Without it, local scoring is used. |
| `GEMINI_MODEL`  | Optional | `gemini-1.5-flash` | Any Gemini text model.            |

Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Project structure

```
tava-app/
├── api/
│   └── suggest.js              # Vercel function → Gemini
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── Icons.jsx
│   │   ├── MealArt.jsx
│   │   ├── MealCard.jsx
│   │   ├── Toast.jsx
│   │   └── UI.jsx              # Chip, Button, Card primitives
│   ├── lib/
│   │   ├── gemini.js           # Client-side wrapper around /api/suggest
│   │   ├── meals.js            # Sample library + local scoring fallback
│   │   ├── reducer.js          # App-wide reducer + initial state
│   │   └── storage.js          # localStorage helpers
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── SuggestionsScreen.jsx
│   │   ├── RecipeSheet.jsx
│   │   ├── SavedScreen.jsx
│   │   ├── SettingsScreen.jsx
│   │   └── FiltersSheet.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
└── .env.example
```

## How the AI flow works

1. User types/edits ingredients on **Home**, taps **Suggest meals**.
2. App navigates to **Suggestions** and dispatches `generate`.
3. `App.jsx` calls `suggestMeals()` → `POST /api/suggest`.
4. The serverless function asks Gemini for 5 structured meals (JSON response mode).
5. If anything fails — missing key, network, bad JSON — the client falls back to local scoring against `MEAL_LIBRARY`.
6. UI animates in the 5 cards.

## What persists

- **Pantry** (toggle in Settings) — ingredients you've cooked with before
- **Saved meals** — anything you've hearted
- **Preferences** — diet, cuisine, household size, smart toggles
- **Feedback** — per-meal thumbs up/down

Nothing leaves the device except the ingredient list sent to `/api/suggest`.

## License

MIT.
