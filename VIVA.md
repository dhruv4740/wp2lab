# Viva guide: SomaiyaSat (Dhruv Kothari, 16010424060)

## 30-second pitch
SomaiyaSat is a React site for a PocketQube satellite mission. The front end (React + Vite, port 3000) talks to two back ends: a core-Node ground-station server (port 8080, Exp 5) and an Express + MongoDB REST API (port 5000, Exp 6-8). For the PS I added the **Pass Monitor** (`/monitor`): pick a ground station, fetch its link data through a Promise, classify risk (Nominal / Degraded / Critical) and show an advisory.

## Run it
```
start-mongo.bat        # MongoDB on 27017
npm run api            # Express API, 5000
npm run server         # ground station, 8080
npm run dev            # site, 3000
npm run client         # optional: scripted test of the 8080 server
```

## Pass Monitor: how it works (the PS)
Files: `src/pages/PassMonitor.jsx` (page), `src/services/linkApi.js` (fake API), `src/components/PassCard|RiskAlert|AdvisoryPanel|LinkForm.jsx`, `PassCard.module.css`.

1. Page loads -> `useEffect(() => loadPass(station), [station])` runs.
2. `loadPass` is `async`: sets `loading`, `await fetchPassData(station)`, then `applyData`.
3. `fetchPassData` returns `new Promise` that resolves after 700 ms (`setTimeout`), or rejects for an unknown station.
4. `applyData` calls `classify({snr,battery,temperature})` -> risk; stores everything in ONE `pass` state object (state management).
5. Children get data by **props**: `PassCard` (values), `RiskAlert` (conditional rendering by risk), `AdvisoryPanel` (text from `ADVISORY[risk]`).
6. `LinkForm`: controlled inputs + validation (SNR -20..40, battery 0..100, temp -60..100, required numbers) -> calls back to the parent, which runs `applyData` with the manual values.
7. A second `useEffect` warns in the console when risk is Critical (monitoring).
8. `AllStations` reuses `PassCard` for every station via `Promise.all(STATIONS.map(fetchPassData))` (component reusability).

Risk rules: Critical if battery<20 or snr<3 or temp>60. Degraded if battery<50 or snr<8 or temp>45. Else Nominal.

Topic -> where: JSX (everywhere) · Props (`PassCard`, `RiskAlert`) · useState/useEffect (`PassMonitor`) · Conditional rendering (loading/error/`RiskAlert`) · Events (`onChange`, `onClick`, `onSubmit`) · State (`pass` object, Context for auth) · CSS Modules (`PassCard.module.css`, `Tag.module.css`) · Promise/async-await (`linkApi.js`, `loadPass`) · Reusability (`PassCard` x many) · API integration (`/api/news` via axios; `fetchPassData`).

## Experiment map
| Exp | What | Where |
|---|---|---|
| 3 | React pages, Router, controlled forms, Context auth | `App.jsx`, `AuthForm.jsx`, `context/AuthContext.jsx` |
| 4 | axios + async/await, filter by state | `pages/Dispatches.jsx` |
| 5 | Core Node http server, fs, os, events, JSON, 404/400 | `server/groundStationServer.js` (+ client) |
| 6 | Express, middleware, REST routes | `server/mongo/api.js` |
| 7 | MongoDB CRUD (crew) | `mongo/db.js`, `crew.js`, `pages/CrewRegistry.jsx`, `lab/exp7_crud.js` |
| 8 | Student modules, queries, attendance, grades, scholarship | `server/students/*`, `pages/Students.jsx` |

## Key code to explain
- **Error boundary** (`ErrorBoundary.jsx`): only class component; `getDerivedStateFromError` stores the error so a fallback shows instead of a white screen. Hooks cannot do this.
- **Context** (`AuthContext`): provider holds `user`; `useAuth()` reads it anywhere; lazy `useState(() => ...)` reads localStorage once. Demo auth only, no server check.
- **Dispatches**: `try / catch / finally`; `finally` always clears loading. Filter = `.filter()` on state, derived on each render (no extra state).
- **Ground server**: callback fires per request; route = `METHOD path`; body arrives as stream chunks (`data`, `end`) then `JSON.parse`; invalid JSON -> 400; unknown route -> 404; 201 for created; OPTIONS 204 for CORS preflight; `fs.appendFile` is async so the server does not block; an `EventEmitter` listener records events.
- **Mongo**: one shared `MongoClient` (`connectDB` caches it); `ObjectId.isValid` guards bad ids; `findOneAndUpdate` with `returnDocument: 'after'`; `deleteOne` -> `deletedCount === 1`.
- **Express**: `cors()` + `express.json()` middleware; routers mounted by prefix; `/scholarship` declared before `/:id` or it would match as an id; 4-argument error middleware returns 500; `/api/news` proxies Spaceflight News with an 8 s timeout and falls back to `public/news.json`.

## Likely questions
**Q: Props vs state?** Props are read-only inputs from the parent; state is data a component owns and changes with its setter, which re-renders it.
**Q: Why `[station]` in useEffect?** The dependency array makes the effect re-run only when the station changes. `[]` = once on mount; none = every render.
**Q: Why not mutate state?** React compares references; use `setPass({...})` to give a new object.
**Q: Promise vs async/await?** async/await is syntax over Promises; `await` pauses the function until the Promise settles; errors from a rejected Promise are caught with `try/catch`.
**Q: Why `key` in lists?** Lets React identify items between renders.
**Q: Controlled input?** Its `value` comes from state and `onChange` updates state, so React is the single source of truth.
**Q: Why `e.preventDefault()`?** Stops the browser's default form submit/page reload.
**Q: CSS Modules benefit?** Class names are hashed per file, so styles cannot clash.
**Q: Why a separate Express API when you have a Node server?** The Node server is Exp 5 (core modules, no framework); Express (Exp 6) adds routing, middleware, JSON parsing, and talks to MongoDB.
**Q: What is CORS?** Browser blocks calls to another origin (port) unless the server sends allow headers; we set them in Node and via `cors()` in Express.
**Q: 200 vs 201 vs 400 vs 404 vs 500?** OK / Created / bad input / not found / server error.
**Q: Is the Pass Monitor real data?** No, `fetchPassData` is simulated with a timed Promise; swapping it for `fetch`/axios needs no change in components. News and DB are real.
**Q: How would you add a new risk level?** Add a rule in `classify`, an entry in `ADVISORY`, a style in `RiskAlert`.
**Q: Weakness?** Auth is localStorage only; many pages use inline styles rather than modules; no tests.

## Be ready to demo
1. `/monitor`: switch stations (Delhi GS = Critical), press Refresh, submit an invalid form (e.g. battery 150) to show errors.
2. `/news`: type a search, click a category.
3. `/crew`: add, edit, delete a member (shows in MongoDB).
4. `npm run client`: all checks pass against port 8080.
