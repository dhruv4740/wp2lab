# SomaiyaSat code map

Folders are named after the experiment they show. Open the folder, search for the symbol.

## Run it

| What | Command | Port |
|---|---|---|
| MongoDB | `start-mongo.bat` | 27017 |
| Express API (crew, news, students) | `npm run api` | 5000 |
| Ground station Node server (Exp 5) | `npm run server` | 8080 |
| React site | `npm run dev` | 3000 |
| Production build | `npm run build` | |
| Seed students | `npm run seed` | |

## Front end (`src/`)

| Folder | Experiment | Files | Route |
|---|---|---|---|
| `exp1-basic/` | 1 Basic React | `Home`, `Hero`, `Explainer`, `HowItWorks`, `About` (+ `<Outlet>`), `Team`, `Company` | `/`, `/about/team`, `/about/company` |
| `exp2-hooks/` | 2 Hooks, props | `Tag` (+ `Tag.module.css`), `Students` | `/students` |
| `exp3-forms/` | 3 Forms | `AuthForm`, `AuthModal`, `LoginForm`, `RegisterForm`, `Contact`, `AuthContext` | `/login`, `/register`, `/experiments/contact` |
| `exp4-api/` | 4 API | `Dispatches` (axios), `LatestNews` (fetch) | `/news`, home page |
| `exp5-node/` | 5 Node (web console for the Node server) | `GroundSupport`, `GroundUplink` | `/gateway`, `/uplink` |
| `exp7-mongodb/` | 7 MongoDB (website side) | `CrewRegistry` | `/crew` |
| `shared/` | | `Navbar`, `ErrorBoundary` | |
| `mission-site/` | not an experiment | telemetry dashboard and its widgets | `/telemetry` |
| `ps-passmonitor/` | problem statement | `PassMonitor` and its pieces | `/monitor` |

`App.jsx` holds the routes, `main.jsx` mounts the app.

## Back end (`server/`)

| Folder / file | Experiment | What it does |
|---|---|---|
| `exp5-node/groundStationServer.js`, `groundStationClient.js` | 5 | plain `http` server (port 8080) and a Node client |
| `exp6-express/api.js`, `crew.js` | 6 | Express app: `cors`, `express.json`, mounted routers, 400/404/201/500; crew CRUD; `/api/news` |
| `db.js` | 7, 8 | MongoDB connection shared by crew and students |
| `exp7-mongodb/exp7_crud.js` | 7 | the MongoDB CRUD script (`npm run exp7`) |
| `exp8-students/` | 8 | `routes.js` (REST), one small file per job (`add`, `find`, `update`, `delete`, `attendance`, `grades`, `scholarship`), `seed.js`, `modules_demo.js` |

## Config

`package.json` scripts, `vite.config.js`, `dev.js` / `build.js` (Vite launchers; `npx vite` fails on this machine).

## Removed

The `/experiments` index page, `labMap.js`, the "Code behind this page" panel (`CodePanel`) and the launch overlay. They were helpers, not part of any experiment.
