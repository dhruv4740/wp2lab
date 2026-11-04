# Viva guide: Exp 1, 2, 3, 7, 8 (Dhruv Kothari, 16010424060)

Line numbers below are for the current `main`. If you edit a file, re-check them.

## Setup before you walk in
```
start-mongo.bat      # MongoDB on 27017
npm run seed         # 10 sample students (needed for /students)
npm run api          # Express API, port 5000   (needed by /crew and /students)
npm run server       # core Node server, 8080   (only for Exp 5 / /gateway)
npm run dev          # site, port 3000
```
`/students` is not in the navbar. Open it by typing `localhost:3000/students` or from the links on `/experiments`. `/experiments` shows every experiment with its files and live line numbers: use it when she asks "where is X".

**Answer pattern for any question:** (1) which page/file/line, (2) what it does, (3) why it is written that way, (4) what you see as output.

---

# EXP 1: Basic React pages (JSX, components)
Files: `pages/Home.jsx`, `components/Hero.jsx`, `pages/Team.jsx`. Routes: `/` and `/about/team`.

**What is JSX?** HTML-like syntax inside JavaScript. The build tool (Vite/Babel) turns `<h1>Hi</h1>` into `React.createElement('h1', null, 'Hi')`. `{ }` embeds JavaScript expressions.

**Where is the home page built, and how?** `Home.jsx:8-17`. It is only composition: `<Hero />`, `<Explainer />`, `<HowItWorks />`, `<LatestNews />` stacked in a div. Each is its own component file. *Why:* small reusable parts, each file does one job.

**Hero.jsx**
- Line 5: a function component (a function that returns JSX, name starts with a capital letter).
- Line 19: `<Link to="/telemetry">` is client-side routing: changes the URL and page without a reload.
- Line 22: `<a href="#about-project">` is a plain anchor that scrolls inside the page. *Difference:* Link = another route; `a` = same page.
- `style={{ ... }}`: outer braces = JS expression, inner braces = style object. CSS properties are camelCase (`fontSize`).

**Team.jsx** (best file to explain Exp 1 in detail)
- Lines 8-25 `facultyLeads` and 28-50 `studentTeams`: plain arrays of objects = the data.
- Lines 103-112: `facultyLeads.map(lead => <PersonCard key={lead.name} ... />)` = list rendering. `key` gives React a stable identity per item.
- Lines 58 and 73: `SectionHeading` and `PersonCard` are small reusable components in the same file. Both take props.
- Line 73: `{ icon: Icon, ... }` destructures the prop and renames it to `Icon`. *Why:* JSX treats lowercase tags as HTML, so a component must start with a capital letter: `<Icon size={20} />`.
- Lines 58 and 85: `children` prop: whatever is written between `<PersonCard>...</PersonCard>` is rendered at `{children}`.
- Line 2: icons come from `lucide-react`, which are React components.
- Route: `App.jsx:62` is `<Route path="team" element={<Team />} />`, nested under `/about`, so the URL is `/about/team`.

**Output to expect:** `/about/team` shows two faculty cards (Dr. Umesh Shinde, Dr. Shailesh Nikam) and three subsystem cards. Adding one object to `studentTeams` gives a fourth card with no other code change.

**Q: Why can't a component return two sibling elements?** It must return one root; use a wrapper or a fragment `<> </>` (used at `Team.jsx:60`).
**Q: Component vs function?** A component is a function that returns JSX and is used as a tag; React calls it and re-calls it when state or props change.
**Q: Virtual DOM?** React keeps a lightweight copy of the UI, compares old and new after a change, and updates only the real DOM parts that differ.
**Q: How does the page load at all?** `index.html` has `<div id="root">`; `main.jsx:7` does `ReactDOM.createRoot(...).render(<App />)`; `App.jsx` holds the router.

---

# EXP 2: Components, props, hooks, conditional rendering, events
Files: `components/Tag.jsx`, `pages/Students.jsx`, `pages/Experiments.jsx` (also `CrewRegistry.jsx`).

### Props: `Tag.jsx`
```jsx
export default function Tag({ label, kind }) {
  return <span className={kind === 'exp' ? `${styles.tag} ${styles.exp}` : styles.tag}>{label}</span>;
}
```
- Used at `Experiments.jsx:32` as `<Tag label="Exp 3" kind="exp" />` (blue pill) and at line 47 as `<Tag label={p.name} />` (grey pill).
- Output: same component, two looks, depending on the `kind` prop. Props are read-only.
- `Tag.module.css` is a CSS Module: `.tag` and `.exp` become unique generated class names, so they can't clash with other files.

### useState: `Students.jsx:29-35`
`students` (list), `form` (all input values in one object), `editId` (null = adding, id = editing), `view` ('all' | 'scholarship'), `filter` ({key, value}), `loading`, `error`.
*Why one `form` object?* Seven inputs, one state, one handler: `set = (k) => (e) => setForm({ ...form, [k]: e.target.value })` (line 51). `[k]` is a computed key: copy all fields, overwrite just one.

### useEffect: where is it?
- `Students.jsx:48`: `useEffect(() => { load(); }, [load]);` runs after the first render and again whenever `load` changes.
- `load` (lines 38-43) is wrapped in `useCallback(..., [view, filter])`, so it is re-created only when `view` or `filter` changes. Net effect: changing the tab or typing in the filter box re-fetches the list. *Why useCallback:* without it `load` would be a new function every render and the effect would loop forever.
- `Experiments.jsx:15-21`: effect with `[]` = run once on mount; it reads each source file and finds the line number of each pointer, then `setLines(prev => ({...prev, [i]: n}))` (functional update, because several async results write to the same state).
- `CrewRegistry.jsx:37-42`: effect with a **cleanup**: sets a 4 s timeout and returns `() => clearTimeout(t)`.
- `AuthModal.jsx:9-14`: adds a `keydown` listener for Escape, cleanup removes it.
- Dependency array rules: none = every render, `[]` = once, `[a]` = when `a` changes. Cleanup runs before the next effect and on unmount.

### Conditional rendering: all the forms it takes here
| Where | Code | Meaning |
|---|---|---|
| `Students.jsx:101` | `{editId ? 'Save' : 'Register'}` | ternary picks the button text |
| `:102` | `{editId && <button>Cancel</button>}` | `&&`: show only while editing |
| `:107` | `{error && <p>...</p>}` | show error text only if set |
| `:113` | `{view === 'all' && (<>filter inputs</>)}` | filter box is hidden on the Scholarship tab |
| `:127` | `loading ? <p>Loading…</p> : <table>` | spinner vs table |
| `:144` | `students.length === 0 && <tr>No students found.</tr>` | empty state |
| `:111-112` | `style={view === 'all' ? btn : box}` | highlights the active tab |

### Events
`onChange` (every input, lines 93-99), `onSubmit` (form, line 92), `onClick` (buttons, 111-112, 139-140). `e.preventDefault()` (line 55) stops the browser's default form submit and page reload. Handlers are passed as functions, not called: `onClick={() => edit(s)}`; `onClick={edit(s)}` would run during render.

### What happens when I click "Register"? (say it step by step)
1. `submit` (line 54) runs, `preventDefault`, clears the error.
2. `editId` is null so it sends `POST /students` (line 58) with `JSON.stringify(form)`.
3. `api()` (lines 15-20) calls `fetch`, parses JSON, throws if the status is not 2xx.
4. Server `routes.js:49`: validates, converts types (`fields`), inserts in MongoDB, replies 201.
5. Back in React: `setForm(EMPTY)`, `setEditId(null)`, `load()` re-fetches, state changes, the table re-renders with the new row.
If the server rejects it (e.g. CGPA 11), the `catch` stores the server's message in `error` and the red text appears.

### Output questions
- Click **Edit** on a row -> `edit(s)` (line 79) copies the row into `form` (subjects array joined as `"WP-II, DBMS, OS"`), sets `editId`, button turns to "Save", "Cancel" appears.
- Click **Delete** -> `window.confirm("Delete Aarav Mehta?")`; OK -> `DELETE /students/<id>` -> reload.
- Pick filter "State", type `Gujarat` -> request `GET /students?state=Gujarat` (line 40, `encodeURIComponent` makes unsafe characters URL-safe) -> only Diya Shah.
- Filter "Joining year" `2023` -> Aarav, Rohan, Kabir, Meera, Ishita (from `seed.js`).
- Click the Scholarship tab -> `GET /students/scholarship` -> students with CGPA above 9, highest first; the filter inputs disappear (line 95).

**Q: Why not change state directly (`form.name = 'x'`)?** React only re-renders when it sees a new value from the setter; direct mutation is not detected.
**Q: `setState` is async?** Updates are batched; the new value is visible on the next render, not on the next line. Use the functional form `setX(prev => ...)` when the new value depends on the old.
**Q: What is `key` for?** Stable identity: `key={s._id}` (line 114) lets React update the right row when the list changes. Index keys break when rows are deleted or reordered.
**Q: Lifting state / Context?** Shared user: `context/AuthContext.jsx` (Context API) avoids passing `user` through every component.

---

# EXP 3: Forms and validation
Files: `components/AuthForm.jsx`, `pages/LoginForm.jsx`, `pages/RegisterForm.jsx`, `components/AuthModal.jsx`, `pages/Contact.jsx`, routes in `App.jsx`.

### Where do I see login/register?
- Navbar "Sign in" button (`Navbar.jsx:59`) opens `AuthModal` (popup). Pages `/login` and `/register` also exist (`App.jsx:58-59`). Both use the **same** `AuthForm` with a `mode` prop: `"login"` or `"register"`.

### AuthForm line by line
- Line 12: one state object `v` for all fields (name, email, password, role, agree). Line 13: `errors` object, one message per field.
- Line 15: `set(k)` returns a handler for field `k`; for the checkbox it reads `e.target.checked`, for others `e.target.value`. This makes every input **controlled**: its `value` is `v[key]` (line 37), so React state is the single source of truth.
- Lines 17-31 `submit`:
  - 19: `preventDefault()`.
  - 21: name empty -> "Name is required" / "Username is required" (text depends on `isReg`).
  - 22: register only: email must match `/^\S+@\S+\.\S+$/` = non-space chars, `@`, non-space chars, `.`, non-space chars.
  - 23: password at least 6 chars. 24: register only: terms checkbox must be ticked.
  - 26-27: `setErrors(err)`; if the object has any key, `return` (stop). Otherwise `register(...)` or `login(...)`, then `onDone?.()` (optional call: only if the parent passed it).
- `<form onSubmit={submit} noValidate>` (line 43): `noValidate` switches off the browser's built-in popups so our own messages show. (`Students.jsx` does the opposite: it uses `required` and the browser's validation.)
- Line 34: `field(...)` is a helper that renders label + input + error, so four inputs don't repeat the markup.
- Dropdown: `<select value={v.role} onChange={set('role')}>` with options from `ROLES.map`. Checkbox: `checked={v.agree}`.

### Output cases
| Input | Result |
|---|---|
| Register: name "Dhruv", email "d@x", password "abc", box unticked | errors: "Enter a valid email", "At least 6 characters", "Please accept the terms" |
| Login: username "dhruv", password "secret1" | no errors; navbar shows callsign **VU2-DHRU**; saved in `localStorage` key `somaiyasat_user`; page goes to `/telemetry` |
| Register: "Dhruv Kothari" + valid data | callsign `VU2-DHRU` (`AuthContext`: uppercase, strip non-letters, first 4) |
| Reload the page | still logged in (the lazy `useState(() => localStorage...)` in `AuthContext`) |
| Sign out | user cleared from state and localStorage, goes to `/` |

### AuthModal (`AuthModal.jsx`)
- `useState('login')` for the tab; lines 22-26 render two buttons from `['login','register'].map`.
- Line 28: `<AuthForm key={mode} .../>`: changing `key` makes React throw away and recreate the form, so typed text and errors reset when you switch tabs.
- Line 19-20: backdrop `onClick={onClose}`; the inner box has `onClick={(e) => e.stopPropagation()}` so clicks inside don't bubble up and close it.
- Lines 9-14: Escape key effect (with cleanup). Line 16: `if (!isOpen) return null` = render nothing when closed.

### Routing and navigation
- `App.jsx:60-65`: nested routes. `/about` renders `About`, whose `<Outlet />` (`About.jsx:55`) shows the child (Team or Company). `index` route redirects `/about` to `team` with `<Navigate>`.
- `About.jsx:44-49`: `NavLink` and `linkStyle = ({ isActive }) => ...` highlights the active tab (line 9).
- `Navbar.jsx:47`: NavLink with `className={({isActive}) => ...}`.
- `App.jsx:66`: wildcard route `path="*"` redirects unknown URLs home.
- **useNavigate (programmatic navigation):** `LoginForm.jsx:7,11`: `navigate('/telemetry')` after login. `Contact.jsx:13-22`: submit shows a thank-you view, then `setTimeout(() => navigate('/'), 2000)`. Route `/experiments/contact` (`App.jsx:57`).
- Link vs useNavigate: `Link` = user clicks; `navigate()` = code decides (after a login, after a timer).

### Contact form
Controlled `<textarea value={message}>` (line ~80), `if (message.trim())` ignores empty/space-only messages, `submitted` state switches the form for a success message (`!submitted ? <form> : <success>`, line 72).

**Q: Controlled vs uncontrolled?** Controlled: value in state, changed by `onChange`. Uncontrolled: DOM keeps the value, read with a `ref`. We use controlled so validation and resets are easy.
**Q: Why store errors as an object?** One entry per field, so each field shows only its own message, and `Object.keys(err).length` tells whether anything failed.
**Q: Is the login secure?** No: demo only, any username works, no server check, user saved in localStorage. Real systems verify on a server and use hashed passwords + tokens.

---

# EXP 7: MongoDB CRUD
Files: `server/lab/exp7_crud.js` (the experiment script), `server/mongo/db.js`, `server/mongo/crew.js`, `server/mongo/api.js`; frontend: `pages/CrewRegistry.jsx` (route `/crew`).

**Run the experiment:** `npm run exp7` (MongoDB must be running). It prints to the terminal, it has no web page. The same driver and operations power `/crew`.

### exp7_crud.js, program by program
| Lines | Program | Code | Meaning |
|---|---|---|---|
| 5 | URI | `mongodb://localhost:27017/company` | local server, database `company` |
| 8, 11 | connect | `new MongoClient(uri)`, `await client.connect()` | open connection (async) |
| 13-14 | db + collection | `client.db('company').collection('Employee')` | created lazily when first document is inserted |
| 15-16 | create DB | `deleteMany({})` then `insertOne({name:'Admin'})` | clean start and force the DB to exist |
| 19-23 | **Insert** | `insertOne(doc)` -> `insertedId` | adds Raj; `_id` is auto-generated ObjectId |
| 25-27 | **Read** | `find({ name: 'Raj' }).toArray()` | `find` returns a cursor, `toArray` makes it an array |
| 29-35 | **Update** | `updateOne(filter, { $set: {...} })` | change only city and salary; returns matched/modified counts |
| 37-40 | **Delete** | `deleteOne(filter)`, `countDocuments()` | `deletedCount === 1` means one removed |
| 41-43 | close | `finally { await client.close() }` | closes even if something failed |

**Expected output (in order):**
```
Connected Successfully
Database Created
Document inserted successfully
Inserted ID: 65f...   (24 hex characters)

Read:
[ { _id: new ObjectId('...'), name: 'Raj', age: 24, city: 'Noida', salary: 40000, technology: [ 'C', 'C++', 'Java' ] } ]

1 document matched.
1 document modified.
{ _id: ..., name: 'Raj', age: 24, city: 'Mumbai', salary: 50000, technology: [...] }

Successfully deleted one document.
Remaining documents: 1
```
"Remaining 1" = the Admin document. Run it again and it still works because line 15 clears the collection first.

**Q: Why `await` everywhere?** Every driver call talks to the database over the network and returns a Promise; without `await` you'd get a pending Promise instead of the result and the next line would run too early.
**Q: Why `$set`?** Without it, `updateOne(filter, {city:'Mumbai'})` is an error (update needs an operator); `$set` changes only the listed fields and keeps the rest.
**Q: matchedCount vs modifiedCount?** Matched = documents the filter found; modified = those that actually changed. Updating to the same values gives matched 1, modified 0.
**Q: What is ObjectId?** 12-byte unique id MongoDB adds as `_id`; shown as 24 hex characters.
**Q: SQL vs MongoDB?** Collection ~ table, document ~ row, but documents are flexible JSON (arrays and nested objects, no fixed columns).
**Q: Why `finally`?** To close the connection whether the code succeeded or threw.

### Where is MongoDB used in the website? (frontend + server)
- **Page:** `/crew` -> `CrewRegistry.jsx`. Add a member -> row appears; Edit; Delete (button turns "Confirm?" first, `remove` line 57; a timeout clears it after 4 s, lines 37-42).
- `CrewRegistry.jsx:9` `api()` helper with `fetch`; `:23-27` state; `:30-33` load + effect; `:44` `submit` (PUT when `editId`, else POST); `:89` `crew.map` renders rows; `:102` empty state.
- **Server:** `api.js:22` GET list, `:25` POST, `:31` PUT, `:38` DELETE, mounted at `:44` as `/api/crew`.
- **`crew.js`:** `addMember` (insertOne, lines 10-14: generates a callsign like `VU2-4821`), `findMembers` (find + `sort({joinedAt:-1})`, newest first), `updateMember` (`findOneAndUpdate` with `returnDocument: 'after'` so you get the new version back), `deleteMember` (deleteOne, true only if `deletedCount === 1`).
- **`db.js`:** `connectDB()` creates the client once and reuses it (`if (!client)`), database `somaiyasat`; `crew()` returns the `crew` collection. *Why share one client:* opening a connection per request is slow and exhausts connections.
- `toId` (`crew.js:7`): `ObjectId.isValid(id) ? new ObjectId(id) : null`. A string id from the URL is not an ObjectId, and an invalid one would crash the driver, so we return null and the route answers 404.
- Show it live: open MongoDB Compass at `mongodb://localhost:27017`, database `somaiyasat` -> `crew`, add a member on the site and refresh Compass.

---

# EXP 8: React + Node REST API (Student Management)
Files: frontend `pages/Students.jsx` (route `/students`); backend `server/students/routes.js` (+ `find.js`, `add.js`, `update.js`, `delete.js`, `attendance.js`, `grades.js`, `scholarship.js`, `seed.js`).

### Architecture in one line
`Students.jsx` --fetch--> Express (`api.js` mounts `studentRouter` at `/api/students`, `api.js:45`) --> `routes.js` --> function in `find/add/update/delete.js` --> MongoDB `students` collection. Response travels back as JSON.

### REST routes (`routes.js`)
| Line | Route | Does | Status |
|---|---|---|---|
| 30 | `GET /api/students` (`?state= ?year= ?subject=`) | list/filter (`find.js`) | 200 |
| 39 | `GET /api/students/scholarship` | `cgpa > 9`, highest first | 200 |
| 42 | `GET /api/students/:id` | one student + `attendancePercent` | 200 / 404 |
| 49 | `POST /api/students` | create | 201 / 400 |
| 55 | `PUT /api/students/:id` | update | 200 / 400 / 404 |
| 63 | `DELETE /api/students/:id` | delete | 200 / 404 |
| 69 | `POST /api/students/:id/attendance` | `$push` one day | 201 / 400 / 404 |
| 78 | `POST /api/students/:id/grades` | add/replace marks (0-100) | 201 / 400 / 404 |

**Why is `/scholarship` above `/:id` (line 39 vs 42)?** Express matches in order; if `/:id` came first, the word "scholarship" would be taken as an id.

### Backend code worth knowing
- `routes.js:15-23` `fields(b)`: the request body is text; convert to real types: `Number(b.rollNo)`, `String(b.name).trim()`, subjects split on commas into an array, empty entries removed.
- `routes.js:25-27` `valid(b)`: required fields present and CGPA between 0 and 10. Invalid -> `res.status(400).json({ error })`.
- `find.js`: `findByState` -> `find({ state })`; `findByJoiningYear` -> `find({ joiningYear: Number(year) })` (query strings are text, so convert); `findBySubject` -> `find({ subjects: subject })` (matches when the array contains the value).
- `scholarship.js`: `find({ cgpa: { $gt: 9 } }).sort({ cgpa: -1 })`. `$gt` = greater than, `-1` = descending.
- `attendance.js`: `$push` appends `{date, present}` to the `attendance` array; `attendancePercent` = present days / total days x 100, rounded, 0 if no days. 3 present of 4 -> 75.
- `grades.js`: `$pull` removes the old entry for that subject, then `$push` adds the new one -> a subject never appears twice.
- `update.js`: `findOneAndUpdate({_id}, {$set: fields}, {returnDocument:'after'})`. `delete.js`: `deleteOne`, `deletedCount === 1`.
- `seed.js` (`npm run seed`): `deleteMany({})` then `insertMany` of 10 students; each gets empty `attendance` and `grades` arrays and `createdAt`.
- `new` students: `add.js` inserts `{ attendance: [], grades: [], ...s, createdAt }`.

### Frontend code (see Exp 2 for state/effects)
- `Students.jsx:8`: `API` base URL from `VITE_API_URL` or `http://localhost:5000/api`.
- `:10-15` `api()`: wraps `fetch`, sets JSON header, `await res.json()`, throws `Error(data.error)` for non-2xx. *Why:* `fetch` does not reject on 404/400 by itself; the `!res.ok` check turns them into errors that the `catch` shows.
- `:30-36` load + effect, `:42-53` submit (POST/PUT), `:55-63` delete with `window.confirm`, `:66-69` edit.
- `:113` `students.map(s => <tr key={s._id}>...)`, `:117` `(s.subjects || []).join(', ')`: safe if `subjects` is missing.
- CORS: `api.js:11` `app.use(cors())` lets the page on port 3000 call the API on port 5000 (different origin).

### Test it without the website (good for the oral)
```
curl http://localhost:5000/api/students
curl "http://localhost:5000/api/students?state=Gujarat"
curl http://localhost:5000/api/students/scholarship
curl -X POST http://localhost:5000/api/students -H "Content-Type: application/json" -d "{\"name\":\"Test\"}"
```
The last one returns **400** `rollNo, name, branch, state, joiningYear and cgpa (0-10) are required`.

**Q: What is REST?** URLs name resources (`/students`), HTTP methods say the action (GET read, POST create, PUT update, DELETE remove), status codes report the outcome.
**Q: PUT vs POST?** POST creates a new resource; PUT replaces/updates an existing one at a known id.
**Q: What is `req.params` vs `req.query` vs `req.body`?** `params`: `/:id` part; `query`: after `?`; `body`: JSON sent in the request (parsed by `express.json()`, `api.js:12`).
**Q: What is middleware?** A function that runs between request and route handler: `cors()` adds headers, `express.json()` parses the body.
**Q: What does MERN stand for here?** MongoDB (database), Express (API), React (front end, `Students.jsx`), Node (runtime for Express and the driver).
**Q: Why async/await in routes?** Database calls return Promises; the response is sent only after the data arrives.
**Q: Why not call MongoDB from React directly?** The browser can't (and must not) hold database credentials; the API validates input and decides what is exposed.

---

# If she asks me to change something live
| Ask | Do |
|---|---|
| Add a field (e.g. `email`) to students | `EMPTY` and form input in `Students.jsx`, a column in the table, `fields()` and `valid()` in `routes.js` |
| Change CGPA scholarship cut-off | `scholarship.js` `$gt: 9` |
| Make password minimum 8 | `AuthForm.jsx:23` |
| Add a new branch in dropdown | `BRANCHES` array (`Students.jsx:10`, `CrewRegistry.jsx:6`) |
| Change redirect after login | `LoginForm.jsx:11` |
| Add a 5th team card | add an object to `studentTeams` in `Team.jsx` |
| Change the timer on Crew delete confirm | `4000` in `CrewRegistry.jsx` |
| New student sort order | `findAll` in `find.js`: `sort({ rollNo: 1 })` (use -1 for descending) |

# Hard questions: honest answers
- **Why inline styles?** Fast to write; shared tokens are in `index.css` and two components use CSS Modules (`Tag`, `PassCard`). Improvement: move repeated style objects into modules.
- **Is login real?** No, localStorage demo.
- **Is the data real?** Students and crew are real MongoDB documents; telemetry and the Pass Monitor are simulated; news comes from a real public API.
- **What would you improve?** Server-side auth, input validation library, pagination, tests, replace inline styles.

---

# Short revision for Exp 4, 5, 6 and the PS (second priority)
- **Exp 4** `Dispatches.jsx`: `axios.get` in an async function with `try/catch/finally`; `useEffect(..., [])` loads once; `.filter()` by search text and category (line 46); conditional rendering for loading/error/list. Axios vs fetch: axios parses JSON automatically (`response.data`) and rejects on non-2xx.
- **Exp 5** `server/groundStationServer.js`: `http.createServer` (137), `new URL` (138), `fs.readFile` (154, 196), `fs.appendFile` (42), `JSON.parse` (54), 404 (211), 400 for bad JSON (56), EventEmitter (64-79). Test with `npm run client`.
- **Exp 6** `server/mongo/api.js` + `students/routes.js`: `express.json()` and `cors()` middleware (11-12), `Router()` modular routers, mounted at 44-45, 400 validation, 404 not found, error-handling middleware with 4 arguments (82).
- **PS: Pass Monitor** (`/monitor`): `fetchPassData` returns a Promise (700 ms `setTimeout`); `loadPass` uses async/await with try/catch/finally; one `pass` state object; `classify` gives Nominal/Degraded/Critical (Critical if battery<20, snr<3 or temp>60; Degraded if battery<50, snr<8 or temp>45); `PassCard` is reused for every station (props + `PassCard.module.css`); `LinkForm` validates SNR -20..40, battery 0..100, temp -60..100.
