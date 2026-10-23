# SomaiyaSat code map

Open the path, search for the symbol. Line numbers are approximate.

## Run it

| What | Command | Port |
|---|---|---|
| MongoDB | `start-mongo.bat` | 27017 |
| Crew REST API | `npm run api` | 5000 |
| Ground station server (`server.js` equivalent) | `npm run server` | 8080 |
| React site | `npm run dev` | 3000 |
| Production build | `npm run build` | |

Compass: `mongodb://localhost:27017` → `somaiyasat` → `crew`.

## Live vs simulated

| Thing | Status | Where |
|---|---|---|
| Crew add/edit/delete | LIVE (MongoDB) | `src/pages/CrewRegistry.jsx`, `server/mongo/` |
| Ground server uptime/health | LIVE (Node `os`, `process`) | `server/groundStationServer.js:169` |
| Battery, telemetry numbers | SIMULATED (`Math.random()` in the server) | `server/groundStationServer.js:118` |
| Login / register | `localStorage` only, no server | `src/context/AuthContext.jsx:5` |

## Routes → files (`src/App.jsx`)

| URL | File | React concepts shown |
|---|---|---|
| `/` | `pages/Home.jsx` → `components/Hero.jsx`, `components/HowItWorks.jsx`, `components/LatestNews.jsx` (real news headlines, `useEffect` + `fetch`) | `useState`, `useEffect` + `fetch` + `setInterval` (custom hook `usePoll`) |
| `/crew` | `pages/CrewRegistry.jsx` | controlled form, CRUD with `fetch`, two-step delete |
| `/telemetry` | `pages/TelemetryHub.jsx` (5 tabs via `useState`) + `PassLogTable`, `RuleConfigOverlay`, `DraggableCards`, `DraggableQueue`, `PassDetailOverlay`, `SSTVCarousel`, `TelemetryStreamEngine` | inline edit, overlays, drag and drop, lists |
| `/uplink` | `pages/GroundUplink.jsx` + `WireframeStudio` | props, SVG |
| `/gateway` | `pages/GroundSupport.jsx` | |
| `/news` | `pages/Dispatches.jsx` (navbar "News"; `/dispatches` redirects here) | `fetch` of `/api/news` |
| `/experiments` | `pages/Experiments.jsx` + `labMap.js` | Exp 1-8 index and a pointer -> file -> line table (single source: `src/labMap.js`) |
| `/students` | `pages/Students.jsx` + `server/students/*` | Exp 8 |
| `/login`, `/register` | `pages/LoginForm.jsx`, `pages/RegisterForm.jsx` → shared `components/AuthForm.jsx` (also used by `AuthModal.jsx`) | validation, Context |
| `/about/team`, `/about/company` | `pages/About.jsx` (layout with `<Outlet>`), `Team.jsx`, `Company.jsx` | nested routes |
| `/experiments/contact` | `pages/Contact.jsx` | `useNavigate` |

Every page ends with a collapsed **Code behind this page** panel (`components/CodePanel.jsx`). It reads the real source files and lists where `useState`, `useEffect`, `fetch`, routes and MongoDB calls are, with line numbers and a snippet. To change which files a page shows, edit the `FILES` map at the top of that file.

Shared: `components/Navbar.jsx`, `components/AuthModal.jsx`, `components/LaunchOverlay.jsx` (listens for the `trigger-pslv-launch` event), `components/ErrorBoundary.jsx` (wraps the app in `src/main.jsx`).

## Backend

| File | What it does |
|---|---|
| `server/mongo/db.js` | `MongoClient` connection, `crew()` returns the collection |
| `server/mongo/crew.js` | `addMember`, `findMembers`, `updateMember`, `deleteMember` (native driver: `insertOne`, `find`, `findOneAndUpdate`, `deleteOne`) |
| `server/mongo/api.js` | `express.Router()` mounted at `/api/crew` (GET, POST, PUT/:id, DELETE/:id), validation, status codes 201/400/404/500; `GET /api/news` proxies the Spaceflight News API |
| `server/groundStationServer.js` | Plain `http` server: `/api/telemetry:118`, `/api/health:169`, `/api/telecommand:205`, `/api/events:251`, `/api/logs:261`, `/api/events/trigger:285` |
| `server/groundStationClient.js` | Node `http` client that calls the server above |

## Config

`package.json` scripts, `vite.config.js` (port 3000), `dev.js` / `build.js` (Vite launchers, `npx vite` fails to load config on this machine), `.gitignore`.

## WP2 syllabus (216U04L501) coverage

Source: `TY BTech IT-Syllabus-SVU-2023.pdf` (course outcomes CO1-CO4) and the WP-II experiment handouts in Downloads (Expt 1 React components and props, Expt 2 useState/useEffect, Expt 6 Express routing, Node.js in-lab).

| Syllabus unit | Where it is on the site |
|---|---|
| 1. React basics: JSX, components, props, state, events | `Hero.jsx`, `HowItWorks.jsx` (props on `Card`, `useState`), `CrewRegistry.jsx` (controlled form, events) |
| 1.4 Lifecycle / hooks (Expt 2) | `usePoll` in `HowItWorks.jsx` (`useEffect` with cleanup), `CrewRegistry.jsx:29` |
| 2.1 React Router | `App.jsx` routes, nested routes in `About.jsx`, `NavLink` in `Navbar.jsx` |
| 2.2 Global state with Context | `context/AuthContext.jsx` |
| 2.3 Forms and validation | `LoginForm.jsx`, `RegisterForm.jsx`, `Contact.jsx`, `CrewRegistry.jsx` |
| 4.1-4.2 MongoDB driver and CRUD | `server/mongo/db.js`, `crew.js` |
| 4.3 MySQL with Node.js | **not on the site.** The first MySQL lab code you pasted at the start was replaced by MongoDB. |
| 5.1-5.4 REST, React + Node | `server/mongo/api.js` (Express Router, Expt 6), `CrewRegistry.jsx` |
| 5.5 Full-stack project | the whole site: React, Express, MongoDB |

## Removed in simplification

`NewsFeed.jsx`, `UplinkCommand.jsx`, `NodeServerConsole.jsx` (duplicates of News, Uplink and the Node server). Old URLs `/experiments/news|uplink|node-console` redirect to `/news`, `/uplink`, `/gateway`. Exp 5 is shown in `server/groundStationServer.js`.
