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

---

# Part 2: "How did you implement X?" (say it in this order)

**Props / reusability.** "`PassCard` has no hard-coded data. It receives `station, snr, battery, temperature, condition, risk` as props. I render it once for the selected station and once per station in `AllStations` with `.map`, spreading the object: `<PassCard key={p.station} {...p} risk={classify(p)} />`."

**useState.** "`PassMonitor` has four: `station` (dropdown), `pass` (all readings + risk + advisory + time in one object), `loading`, `error`. Changing any of them re-renders the page."

**useEffect.** "Effect 1 loads data on mount and whenever `station` changes. Effect 2 logs a console warning when the risk is Critical; its dependency list is battery and temperature. `AllStations` has an effect with `[]` so it runs once."

**Conditional rendering.** "`loading && <p>`, `error && <p>`, `!loading && pass && (cards)`. `RiskAlert` picks colour, emoji and text from the `risk` prop."

**Event handling.** "`onChange` on the select sets `station`; `onClick` on Refresh calls `loadPass`; `onSubmit` on the form calls `handleSubmit`, which calls `e.preventDefault()` first."

**Promise + async/await.** "`fetchPassData` wraps `setTimeout` in `new Promise`; `resolve` gives the data after 700 ms, `reject` gives an Error for an unknown station. `loadPass` awaits it inside `try/catch/finally`."

**Form validation.** "On submit I loop over `FIELDS`. Empty or non-numeric -> 'required and must be a number'. Out of range -> the field's own message. Errors go into an object keyed by field; if it has any key I stop and do not call the parent."

**CSS Modules.** "`PassCard.module.css` is imported as `styles`; `styles.card` becomes a unique class name like `_card_x7f2a`, so no other file can clash. The badge colour uses `styles[risk]`, i.e. `styles.Critical`."

**API integration.** "`Dispatches` calls my Express `/api/news` with axios; the server calls the Spaceflight News API. `CrewRegistry` and `Students` use `fetch` for the MongoDB REST API."

# Part 3: "What does this code do / what is the output?"

### `linkApi.js` `classify`
| Input (snr, battery, temp) | Output | Why |
|---|---|---|
| 14, 82, 28 (Mumbai) | Nominal | no rule hit |
| 9, 46, 47 (Helsinki) | Degraded | battery<50 and temp>45 |
| 5, 31, 38 (Bengaluru) | Degraded | battery<50, snr<8 |
| 2, 14, 63 (Delhi) | Critical | battery<20, snr<3, temp>60 |
| 20, 90, 70 | Critical | temp>60 alone is enough |
Critical rules are checked first, so they win.

### `fetchPassData('Paris GS')`
Waits 700 ms, then **rejects** with `Unknown ground station: Paris GS`. In `loadPass` the `catch` runs `setError(...)`, the red message shows, and `finally` clears loading.

### `Promise.all(STATIONS.map(fetchPassData))`
Starts 4 requests at once. Because each takes 700 ms, all finish in about 700 ms (not 2.8 s). Result: an array of 4 objects in station order. If one rejected, the whole `Promise.all` would reject.

### LinkForm
- Battery `150` -> "Battery must be between 0% and 100%." Nothing is sent to the parent.
- SNR `abc` -> "Link SNR (dB) is required and must be a number."
- All empty -> three errors at once.
- `12`, `45`, `30` -> valid; `onSubmitData({snr:12,battery:45,temperature:30})` -> card shows "Manual entry", risk **Degraded** (battery<50).
- Why `Number(...)`: input values are strings, and `'9' < 8` style comparisons would be wrong.

### `setPass({ ...data, risk, advisory, lastUpdated })`
Spread copies all fields of `data` into a new object, then adds three. A new object means React sees a change and re-renders.

### `useEffect(() => loadPass(station), [station])`
Output on first load: "Fetching link data…" for 700 ms, then the Mumbai card + green RiskAlert. Select Delhi: loading again, then a red card, "CRITICAL: switch SomaiyaSat to safe mode.", and the console shows `Critical link state at Delhi GS: battery 14%, 63°C`.

### `TelemetryStreamEngine` effect
`setInterval` adds a packet every `pollInterval` ms (default 2000). `return () => clearInterval(timer)` is the cleanup: it runs before the effect re-runs (Pause pressed, rate changed) and on unmount, so timers never pile up. `setPackets(prev => [packet, ...prev.slice(0, 5)])` puts the newest first and keeps at most 6.

### `CrewRegistry`
- `useEffect(load, [load])` + `useCallback`: `load` keeps the same identity between renders, so the effect runs once.
- `remove`: first click sets `confirmId` (button shows "Confirm?"); a second click on the same id sends DELETE. The timeout effect resets it after 4 s, and its cleanup cancels the timer.
- `submit` sends PUT `/crew/:id` when `editId` is set, otherwise POST `/crew`; afterwards it clears the form and calls `load()`.
- `api()` throws on non-2xx, so the error message from the server (e.g. "name and branch are required") appears in red.

### Server routes: request -> response
| Request | Response |
|---|---|
| GET :8080/api/telemetry | 200 JSON with random battery 75-94 %, snr 14.5-22.5 dB; appends a line to `logs/telemetry.log` |
| POST :8080/api/telecommand body `{"opcode":"0x02"}` | 201 `{success:true, record:{commandId:"CMD-...", opcode:"0x02", status:"DISPATCHED_TO_UPLINK_QUEUE"}}` |
| POST :8080/api/telecommand body `{bad` | 400 `Invalid JSON body` (JSON.parse threw) |
| GET :8080/nothing | 404 `Endpoint not found` |
| GET :5000/api/crew | 200 array, newest first |
| POST :5000/api/crew `{"name":"A"}` | 400 `name and branch are required` |
| PUT :5000/api/crew/abc | 404 `not found` (invalid ObjectId -> `toId` returns null) |
| GET :5000/api/students/scholarship | students with cgpa > 9, highest first |
| GET :5000/api/students?state=Gujarat | students whose `state` equals Gujarat |

### Mongo operators
- `{ $set: { name, branch } }` changes only those fields.
- `{ $push: { attendance: {date, present} } }` appends to an array field.
- `{ $pull: { grades: { subject } } }` removes the matching entry (used before re-adding marks so a subject is never duplicated).
- `{ cgpa: { $gt: 9 } }` greater than 9.
- `find({ subjects: 'Maths' })` on an array field matches documents whose array contains it.
- `attendancePercent`: 3 present out of 4 days -> `Math.round(3/4*100)` = **75**; no days -> 0.
- `exp7_crud.js` prints: Connected Successfully, Database Created, Document inserted successfully + id, the Raj document, "1 document matched.", "1 document modified.", the updated Raj (city Mumbai, salary 50000), "Successfully deleted one document.", "Remaining documents: 1" (the Admin doc).

### Core Node server details she may point at
- `http.createServer((req, res) => {...})`: the callback runs for every request.
- `new URL(req.url, 'http://host')`: separates the path from the query string, so `/api/logs?x=1` still matches `/api/logs`.
- `req.on('data')` / `req.on('end')`: the body is a stream; you must wait for `end` before parsing.
- `res.writeHead(status, headers)` then `res.end(body)`: sets the status line and sends the body.
- `fs.readFile(path, 'utf8', cb)`: non-blocking; the reply is sent inside the callback. `fs.mkdirSync` at startup is blocking but harmless because it runs once before listening.
- `EventEmitter`: `emit('telemetry:logged', data)` triggers every `.on('telemetry:logged', ...)` listener; here the listener logs `[EVENT] ...` and stores the event in `recentEvents` (max 50).
- `process.uptime()`, `process.memoryUsage()`, `os.cpus()`: real values from the running machine.

### If she changes something live (be ready)
- **Add a 5th station:** add one line to `PASSES` in `linkApi.js`. Dropdown, cards and `Promise.all` update automatically because they use `STATIONS = Object.keys(PASSES)`.
- **Change a threshold:** edit the numbers in `classify`.
- **Change loading delay:** the `700` in `setTimeout`.
- **Make Refresh show new values:** `PASSES` is static, so Refresh returns the same data; say it is simulated and a real endpoint would return new values.
- **Break it on purpose:** change a station name in `fetchPassData(...)` to show the reject -> catch -> red message path.

# Part 4: honest answers for hard questions
- **"Is this real satellite data?"** No. The Pass Monitor and telemetry are simulated; the news feed and MongoDB data are real.
- **"Why is login not secure?"** It is a demo: any username works and the user is saved in localStorage. A real system would verify on the server with hashed passwords and tokens.
- **"Why `key` and not index?"** Stable ids (station name, `_id`) let React match items correctly when the list changes; index breaks on reorder/delete.
- **"What happens if the API is down?"** Dispatches shows "Could not load news"; the Express route itself falls back to `public/news.json`.
- **"Why two servers on 8080 and 5000?"** Exp 5 asked for core Node without a framework; Exp 6-8 use Express and MongoDB. They are independent.
- **"What would you improve?"** Real API for pass data, server-side auth, move inline styles to CSS Modules, add tests.
