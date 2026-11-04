# Codebase walkthrough for beginners (Exp 1, 2, 3, 7, 8)

Read this first, then use `VIVA.md` for questions and answers. Line numbers are for the current `main`.

---

## 1. The big picture (60 seconds)

The project is a website with three layers. Each layer only talks to the one next to it.

```
Browser (what you see)
   |  React code in src/          runs on localhost:3000
   v
API server (the middleman)
   |  Express code in server/     runs on localhost:5000
   v
Database (where data is saved)
      MongoDB                      runs on localhost:27017
```

- **React** draws pages and reacts to clicks and typing.
- **Express** receives requests from React ("give me all students", "add this student"), talks to the database, and sends back an answer.
- **MongoDB** stores the data permanently, so it is still there after a refresh.

Folders you need:

| Folder / file | What is inside |
|---|---|
| `src/exp1-basic/` ... `src/exp4-api/`, `src/exp7-mongodb/` | the pages and components of each experiment, one folder per experiment |
| `src/shared/`, `src/mission-site/`, `src/ps-passmonitor/` | Navbar and error boundary; the telemetry pages; the problem-statement pass monitor |
| `src/exp3-forms/AuthContext.jsx` | remembers who is logged in |
| `src/App.jsx` | the list of URLs and which page each one shows |
| `src/main.jsx` | the very first file that starts React |
| `server/exp6-express/` + `server/db.js` | Express API for crew and news + the shared MongoDB connection |
| `server/exp8-students/` | Express API for students (one small file per job) |
| `server/exp7-mongodb/exp7_crud.js` | the Experiment 7 script (runs in the terminal, no web page) |

**Which experiment is where:**

| Exp | Topic | Main files |
|---|---|---|
| 1 | basic React pages | `Home.jsx`, `Hero.jsx`, `Team.jsx` |
| 2 | props, hooks, conditions, events | `Tag.jsx`, `Students.jsx` |
| 3 | forms and validation | `AuthForm.jsx`, `Contact.jsx` |
| 7 | MongoDB CRUD | `exp7_crud.js`, `db.js`, `crew.js` |
| 8 | React + Node REST API | `Students.jsx`, `server/exp8-students/routes.js` |

---

## 2. Words explained simply

| Word | Plain meaning |
|---|---|
| **Component** | A function that returns a piece of the page. Like a LEGO brick: build once, use many times. |
| **JSX** | HTML written inside JavaScript. `<h1>Hello</h1>` inside a `.jsx` file is JSX. |
| **Props** | Values you hand to a component, like arguments to a function. `<Tag label="Exp 3" />` hands the text "Exp 3" to Tag. The component can read them but not change them. |
| **State** | A value the component remembers between redraws, e.g. what is typed in a box. When state changes, React redraws that component. |
| **Hook** | A special function starting with `use` (`useState`, `useEffect`) that gives a component memory or lets it do things at certain moments. |
| **Render** | React drawing the component on screen. It re-renders whenever state or props change. |
| **Array** | A list: `['a', 'b', 'c']`. |
| **Object** | A bundle of named values: `{ name: 'Raj', age: 24 }`. |
| **Array of objects** | A list of bundles. Think of a table: each object is one row, each key is a column. This is how we store data like team members. |
| **`.map()`** | Go through a list and turn each item into something else. We use it to turn each data row into a card or table row on screen. |
| **Destructuring** ("unpacking") | `const { name, age } = person` pulls `name` and `age` out of the `person` bundle into their own variables, so you write `name` instead of `person.name`. |
| **Spread `...`** | "Copy everything from this object". `{ ...form, name: 'Raj' }` = a copy of `form` where only `name` is replaced. |
| **Ternary** `a ? b : c` | A one-line if/else: if `a` is true use `b`, else use `c`. |
| **`a && b`** | If `a` is true show `b`, otherwise show nothing. |
| **API** | A set of URLs a program can call to get or send data. |
| **Request / response** | Request: the browser asks. Response: the server answers. |
| **JSON** | Text format for data that looks like a JavaScript object: `{"name":"Raj"}`. Browsers and servers exchange data in JSON. |
| **Promise / async / await** | Some jobs take time (calling the server, reading the database). A Promise is "I will give you the answer later". `await` means "wait here until the answer arrives". A function using `await` must be marked `async`. |
| **CRUD** | Create, Read, Update, Delete: the four basic things you do with data. |
| **REST** | A way to design an API: the URL names the thing (`/students`), the method says the action (GET read, POST create, PUT update, DELETE delete). |
| **Collection / document** | MongoDB words. Collection = a table. Document = one row (it looks like a JSON object). |
| **Middleware** | A helper function that runs on every request before your route, e.g. one that reads the JSON body. |

---

## 3. How the app starts (used by every experiment)

**`src/main.jsx`**: the first file that runs.
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
```
Plain words: `index.html` has an empty box `<div id="root">`. This code says "put the `App` component inside that box". `ErrorBoundary` is a safety net: if a component crashes, it shows "Something went wrong" instead of a blank page.

**`src/App.jsx`**: the map of the site (lines 40-66).
```jsx
<Route path="/"         element={<Home />} />
<Route path="/students" element={<Students />} />
<Route path="/login"    element={<LoginForm />} />
```
Plain words: when the URL is `/`, show the Home page; when it is `/students`, show the Students page. This is **routing**. The `Navbar` at the top stays on every page; only the part below changes.

---

# EXP 1: Basic React pages

Goal of this experiment: build pages out of components using JSX.

### 3.1 `src/exp1-basic/Home.jsx` (12 lines)
```jsx
export default function Home() {
  return (
    <div>
      <Hero />
      <LatestNews />
    </div>
  );
}
```
Plain words: the home page does no work itself. It just stacks two other components (Hero and LatestNews). Each is in its own file, so each file stays small and easy to understand. This is called **composition**: big page = small pieces put together.

### 3.2 `src/exp1-basic/Hero.jsx` (the big title banner)
Key lines:
```jsx
<h1 ...>SomaiyaSat: a satellite that decides what to send down</h1>
<Link to="/telemetry" ...>View telemetry</Link>
<a href="#latest-news" ...>Latest news</a>
```
- `<h1>`, `<p>`, `<div>` are normal HTML tags written in JSX.
- `<Link to="/telemetry">` goes to another page **without reloading** the browser (it is from react-router).
- `<a href="#latest-news">` just scrolls down on the same page.
- `style={{ fontSize: '2rem' }}`: the outer `{ }` means "JavaScript here", the inner `{ }` is the style object. CSS names are written camelCase (`fontSize`, not `font-size`).

### 3.3 `src/exp1-basic/Team.jsx` (best file to explain Exp 1)

**Part A, the data (lines 8-50).**
```jsx
const facultyLeads = [
  { name: 'Dr. Umesh Shinde', role: 'Faculty Co-Lead...', institution: 'KJSIT Mumbai', ... },
  { name: 'Dr. Shailesh Nikam', ... },
];
```
Plain words: this is a **list of objects**. Each `{ ... }` is one person (one "row"), and `name`, `role`, `institution` are the "columns". There is a second list, `studentTeams`, for the three student subsystems. Keeping data separate from the drawing code means you can add a person by adding one more `{ ... }`, and the page updates by itself.

**Part B, a reusable card (lines 70-88).**
```jsx
function PersonCard({ icon: Icon, color, name, nameSize, role, children }) {
  return (
    <div ...>
      <Icon size={20} />
      <div>{name}</div>
      <div>{role}</div>
      {children}
    </div>
  );
}
```
Plain words:
- `PersonCard` is a component (a mini page piece) that draws one card.
- The `{ icon: Icon, color, name, ... }` in the brackets is **unpacking the props**. React hands the component one bundle of values (props); this line takes each value out of the bundle by name so we can use `name`, `role` directly.
- `icon: Icon` means "take the value called `icon` and call it `Icon`". We rename it with a capital letter because React treats `<icon />` as an HTML tag, but `<Icon />` as a component.
- `{children}` is whatever you write between `<PersonCard>` and `</PersonCard>` when you use it. It lets each card have different extra content inside the same frame.

**Part C, turning data into cards (lines 103-112).**
```jsx
{facultyLeads.map((lead) => (
  <PersonCard key={lead.name} icon={GraduationCap} color={lead.color} name={lead.name} role={lead.role}>
    <div>{lead.dept} • {lead.institution}</div>
    <div>{lead.focus}</div>
  </PersonCard>
))}
```
Plain words: "for every `lead` in the `facultyLeads` list, draw one `PersonCard`". Two leads in the list = two cards on screen. `key={lead.name}` is a unique label React needs on each item in a list so it can track them if the list changes.

**What you see:** open `localhost:3000/about/team`: two faculty cards and three subsystem cards.
**URL link:** `App.jsx:45` has `<Route path="team" element={<Team />} />` inside the `/about` route, which is why the address is `/about/team`.

---

# EXP 2: Props, hooks (useState, useEffect), conditional rendering, events

### 4.1 `src/exp2-hooks/Tag.jsx`: the simplest example of props
```jsx
export default function Tag({ label, kind }) {
  return <span className={kind === 'exp' ? `${styles.tag} ${styles.exp}` : styles.tag}>{label}</span>;
}
```
Plain words:
- `Tag` is a small pill-shaped label.
- `({ label, kind })` unpacks the two props it receives.
- It shows `label` as the text. If `kind` is `'highlight'` it uses the blue style, otherwise the grey style (this `? :` is the ternary, an if/else in one line).
- Where it is used: `Students.jsx` table rows (lines 137-138): `<Tag label={s.branch} />` gives a grey pill, and `<Tag label={s.cgpa} kind="highlight" />` gives a blue pill when CGPA is above 9.
- `styles.tag` comes from `Tag.module.css`. A **CSS Module** makes the class names private to this file, so they can never clash with another file's `.tag`.

### 4.2 `src/exp2-hooks/Students.jsx`: hooks, conditions and events together

This page lets you list, filter, add, edit and delete students.

**Step 1: State (lines 30-36), the page's memory.**
```jsx
const [students, setStudents] = useState([]);
const [form, setForm] = useState(EMPTY);
const [editId, setEditId] = useState(null);
const [view, setView] = useState('all');
const [filter, setFilter] = useState({ key: 'state', value: '' });
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
```
Plain words: each line makes a variable plus a function to change it.
`const [students, setStudents] = useState([])` means: "`students` starts as an empty list; call `setStudents(newList)` to change it; when I do, redraw the page."

| State | What it remembers |
|---|---|
| `students` | the list shown in the table |
| `form` | what is currently typed in all the input boxes |
| `editId` | `null` = adding a new student; an id = editing that student |
| `view` | which tab is open: all students or scholarship list |
| `filter` | what to filter by (state/year/subject) and the typed value |
| `loading` | true while waiting for the server |
| `error` | an error message to show, or empty |

**Step 2: Fetch the data when the page opens (lines 39-49).**
```jsx
const load = useCallback(() => {
  let path = view === 'scholarship' ? '/students/scholarship' : '/students';
  if (view === 'all' && filter.value.trim()) path += `?${filter.key}=${encodeURIComponent(filter.value.trim())}`;
  setLoading(true);
  api(path).then(setStudents).catch((e) => setError(e.message)).finally(() => setLoading(false));
}, [view, filter]);
useEffect(() => { load(); }, [load]);
```
Plain words:
- `load` works out which URL to call, e.g. `/students?state=Gujarat`, asks the server, then puts the answer into `students`.
- `useEffect(() => { load(); }, [load])` means "run `load` when the page first appears, and run it again whenever the list in the square brackets changes". This is the **effect**.
- `useCallback(..., [view, filter])` keeps `load` the same function until `view` or `filter` change. Without it, `load` would be a "new" function on every redraw and the effect would run forever.
- Result: open the page, students load. Click the Scholarship tab or type in the filter, `view`/`filter` change, `load` changes, the effect re-runs, the list updates.

**Step 3: The helper that talks to the server (lines 16-21).**
```jsx
async function api(path, options) {
  const res = await fetch(API + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
```
Plain words:
- `fetch` sends a request to the API and takes time, so we use `await` ("wait for the answer"), and the function is `async`.
- `res.json()` turns the answer text into usable data.
- `res.ok` is false for errors like 400 or 404; `fetch` does not treat those as failures by itself, so we `throw` an Error to make them reach the `catch` where the page shows the message.
- Every request in this page goes through this one helper, so the code is written once.

**Step 4: Typing in the boxes (events) (line 52 and 94-100).**
```jsx
const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
...
<input value={form.name} onChange={set('name')} />
```
Plain words:
- An **event** is something the user does (type, click, submit). `onChange` runs a function each time the box content changes.
- `set('name')` returns a function that updates just the `name` part of `form`. `{ ...form, [k]: e.target.value }` = copy the whole form, then replace the one field called `k` with what was typed.
- Because `value={form.name}` shows the state and `onChange` updates it, React always knows what's in the box. This is a **controlled input**.

**Step 5: Add or edit (lines 55-66).**
```jsx
const submit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    await api(editId ? `/students/${editId}` : '/students', { method: editId ? 'PUT' : 'POST', body: JSON.stringify(form) });
    setForm(EMPTY); setEditId(null); load();
  } catch (err) { setError(err.message); }
};
```
Plain words:
- `e.preventDefault()`: a form normally refreshes the page when submitted; this stops that.
- If we are editing (`editId` has a value) send a **PUT** to `/students/that-id`; if not, send a **POST** to `/students` to create one.
- `JSON.stringify(form)` turns the form object into JSON text to send.
- On success: clear the form, leave edit mode, reload the list. On failure: show the server's message.
- `try { ... } catch { ... }` means "try this; if anything fails, jump to the catch part".

**Step 6: What shows up depends on conditions (conditional rendering).**

| Line | Code | In plain words |
|---|---|---|
| 85 | `{editId ? 'Save' : 'Register'}` | button says Save while editing, otherwise Register |
| 86 | `{editId && <button>Cancel</button>}` | Cancel button only appears while editing |
| 90 | `{error && <p>...{error}</p>}` | red message only if there is an error |
| 95 | `{view === 'all' && (...filter boxes...)}` | filter boxes hidden on the scholarship tab |
| 107 | `loading ? <p>Loading…</p> : <table>...` | show "Loading…" until data arrives, then the table |
| 124 | `{students.length === 0 && <tr>No students found.</tr>}` | message when the list is empty |

**Step 7: Draw the table (lines 134-146).** Same idea as the team cards: `students.map((s) => <tr key={s._id}> ... </tr>)` draws one table row per student. `s._id` is the unique id MongoDB gave that student, used as the `key`.

**Step 8: Edit and delete.**
- Edit button runs `edit(s)` (line 80): copies that student's values into `form` and sets `editId`, so the same form now acts as an edit form.
- Delete button runs `remove(s)` (line 69): `window.confirm` asks "Delete Aarav?"; if you say yes, it sends a DELETE request and reloads.

---

# EXP 3: Forms and validation

Validation = checking what the user typed before accepting it, and showing a message if it's wrong.

### 5.1 `src/exp3-forms/AuthForm.jsx`: one form for both Sign in and Register
It receives a prop `mode` that is either `"login"` or `"register"`, so one file serves both.

**State (lines 12-13)**
```jsx
const [v, setV] = useState({ name: '', email: '', password: '', role: ROLES[0], agree: false });
const [errors, setErrors] = useState({});
```
`v` holds everything typed (name, email, password, the chosen role, whether the checkbox is ticked). `errors` holds one message per wrong field, e.g. `{ password: 'At least 6 characters' }`.

**Validation on submit (lines 17-31)**
```jsx
const submit = (e) => {
  e.preventDefault();
  const err = {};
  if (!v.name.trim()) err.name = ...;
  if (isReg && !/^\S+@\S+\.\S+$/.test(v.email)) err.email = 'Enter a valid email';
  if (v.password.length < 6) err.password = 'At least 6 characters';
  if (isReg && !v.agree) err.agree = 'Please accept the terms';
  setErrors(err);
  if (Object.keys(err).length) return;
  if (isReg) register({ ... }); else login(...);
  onDone?.();
};
```
Plain words, step by step:
1. Stop the page refresh.
2. Make an empty `err` box. Check each field; for each wrong one, add a message to `err`.
3. The email check `/^\S+@\S+\.\S+$/` means: some characters, then `@`, then some characters, a dot, then some characters. `d@x` fails (no dot part), `d@x.com` passes.
4. `setErrors(err)` shows the messages under the fields.
5. `Object.keys(err).length` counts the problems. If there is at least one, `return` stops here and nothing is submitted.
6. If no problems: call `login` or `register` from the AuthContext, then `onDone?.()` tells the parent "finished" (the `?.` means "only call it if it exists").

**Why the form works as it does**
- `<form onSubmit={submit} noValidate>` (line 43): `noValidate` turns off the browser's own pop-ups so you see our messages.
- `field(...)` (line 34) is a small helper function that draws a label + input + error line, so we don't repeat that block four times.
- Dropdown: `<select value={v.role} onChange={set('role')}>`; checkbox: `checked={v.agree}` (checkboxes use `checked`, not `value`).

### 5.2 `src/exp3-forms/AuthContext.jsx`: remembering who is logged in
**Context** is a way to share data with every component without passing it down by hand. `AuthProvider` wraps the app (`App.jsx`) and holds `user`; any component can read it with `useAuth()`.
- `login(username)` builds a user object with a callsign (`VU2-` + first 4 letters in capitals, e.g. `VU2-DHRU`), puts it in state and saves it in the browser's `localStorage`.
- On refresh, `useState(() => ...)` reads `localStorage` once, so you stay logged in.
- This is a **demo**: any username is accepted and nothing is checked on a server.

### 5.3 `LoginForm.jsx` and `RegisterForm.jsx`
```jsx
const navigate = useNavigate();
<AuthForm mode="login" onDone={() => navigate('/telemetry')} />
```
They are tiny wrappers: show the shared form and, when it says it is done, jump to `/telemetry`. `useNavigate` gives a function that changes the page from code.

### 5.4 `AuthModal.jsx`: the Sign in popup
- `useState('login')` remembers which tab (Sign in / Register) is open.
- `if (!isOpen) return null;` draws nothing when closed.
- The `useEffect` (lines 9-14) listens for the Escape key to close the popup, and its `return () => ...` **cleanup** removes the listener when the popup closes, so it doesn't pile up.
- The dark background has `onClick={onClose}`; the white box inside has `onClick={(e) => e.stopPropagation()}` so a click inside the box doesn't count as a click on the background.
- `<AuthForm key={mode} ...>`: changing `key` makes React rebuild the form, which clears typed text and errors when you switch tabs.

### 5.5 `Contact.jsx`: a form that redirects
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (message.trim()) {
    setSubmitted(true);
    setTimeout(() => navigate('/'), 2000);
  }
};
```
Plain words: ignore empty messages; otherwise set `submitted` (the page then shows a thank-you instead of the form: `{!submitted ? <form> : <thanks>}`), and after 2 seconds `navigate('/')` sends you to the home page. That is **programmatic navigation**: the code, not a click, changes the page.

### 5.6 Routing pieces in Exp 3
- `Link` / `NavLink`: clickable links that change the page without reloading. `NavLink` knows if it is the current page (`isActive`) so it can be highlighted (`About.jsx:9`, `Navbar.jsx:47`).
- Nested routes: `App.jsx:43-46` puts `team` and `company` inside `/about`. `About.jsx` has `<Outlet />` (line 55), the empty slot where the chosen child page appears, while the heading and tabs stay.
- `<Route path="*">` (line 66): any unknown URL goes back to the home page.

---

# EXP 7: MongoDB CRUD

MongoDB stores data as **documents** inside **collections**. We use the official Node driver (`mongodb` package) to create, read, update and delete them.

### 6.1 `server/exp7-mongodb/exp7_crud.js`: the experiment itself
Run it with `npm run exp7`. It prints results in the terminal. It runs five small programs in order:

```js
const client = new MongoClient(uri);          // prepare a connection
await client.connect();                        // 1. connect
const collection = client.db('company').collection('Employee');
await collection.insertOne(doc);               // 2. Create
await collection.find({ name: 'Raj' }).toArray();   // 3. Read
await collection.updateOne(filter, { $set: { city: 'Mumbai', salary: 50000 } });  // 4. Update
await collection.deleteOne(filter);            // 5. Delete
await client.close();                          // finally: always close
```
Plain words:
- Database `company`, collection `Employee`. MongoDB creates both the first time you insert something.
- `insertOne(doc)` saves one document (here Raj). MongoDB gives it a unique `_id`.
- `find({ name: 'Raj' })` searches; `.toArray()` turns the results into a normal list.
- `updateOne(filter, { $set: {...} })`: `filter` says which document, `$set` says which fields to change (the others stay as they are).
- `deleteOne(filter)` removes one match; `deletedCount === 1` confirms it worked.
- `await` is used on each step because each one talks to the database and takes time.
- The `finally { await client.close() }` part closes the connection even if something above crashed.

Output you will see: `Connected Successfully`, `Database Created`, `Document inserted successfully`, `Inserted ID: ...`, the Raj document, `1 document matched.`, `1 document modified.`, the updated Raj (city Mumbai, salary 50000), `Successfully deleted one document.`, `Remaining documents: 1` (the "Admin" document).

### 6.2 `server/db.js`: connect once, reuse
```js
let client;
export async function connectDB() {
  if (!client) {
    client = new MongoClient(URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}
export const crew = async () => (await connectDB()).collection('crew');
```
Plain words: the first call connects and remembers the connection in `client`; every later call reuses it (`if (!client)` is false). Opening a new connection on every request would be slow. `crew()` is a shortcut that gives you the `crew` collection.

### 6.3 `server/exp6-express/crew.js`: the four CRUD functions for the website
| Function | Does | Mongo call |
|---|---|---|
| `addMember` | creates a member with a random callsign and join time | `insertOne` |
| `findMembers` | gets all, newest first | `find().sort({ joinedAt: -1 })` |
| `updateMember` | changes name and branch, returns the new version | `findOneAndUpdate` with `$set` |
| `deleteMember` | removes one, true if it worked | `deleteOne` |

`toId` (line 7) turns the id text from the URL into a MongoDB id, or `null` if it isn't a valid one (so a wrong URL gives a clean "not found" instead of a crash).

### 6.4 `server/exp6-express/api.js`: the Express routes for crew
```js
app.use(cors());           // lets the page on :3000 talk to :5000
app.use(express.json());   // reads JSON sent by the browser
crewRouter.get('/',    async (req, res) => res.json(await findMembers()));
crewRouter.post('/',   ...);   // create
crewRouter.put('/:id', ...);   // update
crewRouter.delete('/:id', ...);// delete
app.use('/api/crew', crewRouter);
```
Plain words: each line says "when the browser sends GET to `/api/crew`, call `findMembers()` and send back the result as JSON". `:id` is a placeholder for the id in the URL. If a required field is missing the route replies **400** (bad request); if the id doesn't exist, **404** (not found); a created item gets **201** (created).

### 6.5 `src/exp7-mongodb/CrewRegistry.jsx`: the web page for it (`/crew`)
This is the front end that uses all the above. It is built like `Students.jsx`: state for the list and form, an `api()` helper using `fetch`, an effect that loads the list, a `submit` that sends POST or PUT, and a table made with `.map`. One extra feature, delete confirmation:
- First click on Delete sets `confirmId`, and the button changes to "Confirm?".
- Second click on the same button actually sends DELETE.
- An effect (lines 37-42) resets `confirmId` after 4 seconds using `setTimeout`, and its cleanup `clearTimeout` cancels the timer if the page changes first.

---

# EXP 8: React + Node REST API (Student Management)

Same three layers as Exp 7, now for students, with more features.

### 7.1 The flow of one action (Add a student)
```
You click Register
  -> Students.jsx submit()            builds JSON from the form
  -> fetch POST /api/students         sent to port 5000
  -> api.js app.use('/api/students')  Express sends it to the student router
  -> routes.js router.post('/')       checks the data
  -> add.js addStudent()              saves it with insertOne
  -> MongoDB                          stored in 'students'
  <- 201 Created + the new student    goes back
  -> Students.jsx load()              fetches the list again
  -> table redraws with the new row
```

### 7.2 `server/exp8-students/routes.js`: the API's front door
| Line | Request | What it does |
|---|---|---|
| 30 | `GET /api/students` | all students; or filtered with `?state=`, `?year=`, `?subject=` |
| 39 | `GET /api/students/scholarship` | students with CGPA above 9 |
| 42 | `GET /api/students/:id` | one student plus attendance percent |
| 49 | `POST /api/students` | create |
| 55 | `PUT /api/students/:id` | update |
| 63 | `DELETE /api/students/:id` | delete |
| 69 | `POST /api/students/:id/attendance` | add one attendance day |
| 78 | `POST /api/students/:id/grades` | add or replace marks for a subject |

Two helper functions at the top:
- `fields(b)` (line 15): the browser sends everything as text, so this converts it: `Number(b.cgpa)`, trims spaces from names, splits `"WP-II, DBMS"` into a list `['WP-II', 'DBMS']`.
- `valid(b)` (line 25): required fields must be filled and CGPA must be 0-10. If not valid the route answers 400 with a message.

`/scholarship` (line 39) is written before `/:id` (line 42) on purpose: Express checks routes top to bottom, and `/:id` would swallow the word "scholarship" as if it were an id.

### 7.3 One small file per job (`server/exp8-students/`)
| File | Job | Key idea |
|---|---|---|
| `find.js` | read | `find({ state })`, `find({ joiningYear })`, `find({ subjects: 'CN' })` (matches if the list contains it) |
| `add.js` | create | inserts with empty `attendance` and `grades` lists and a `createdAt` date |
| `update.js` | update | `$set` the new values, return the updated student |
| `delete.js` | delete | `deleteOne`, true only if one was removed |
| `attendance.js` | attendance | `$push` adds a day to the `attendance` list; percent = present days / all days x 100 |
| `grades.js` | marks | `$pull` removes the old entry for that subject, `$push` adds the new one, so no duplicates |
| `scholarship.js` | filter | `find({ cgpa: { $gt: 9 } })` ($gt = greater than), sorted highest first |
| `seed.js` | demo data | `npm run seed` clears the collection and inserts 10 sample students |

### 7.4 The front end
`src/exp2-hooks/Students.jsx` is explained in the Exp 2 section above (state, `useEffect`, conditional rendering, events). For Exp 8 the point to make is: **it never touches the database; it only calls the API with `fetch`**, and the API validates and talks to MongoDB.

### 7.5 See it working without the website
```
curl http://localhost:5000/api/students
curl "http://localhost:5000/api/students?state=Gujarat"
curl http://localhost:5000/api/students/scholarship
curl -X POST http://localhost:5000/api/students -H "Content-Type: application/json" -d "{\"name\":\"Test\"}"
```
The last returns a 400 message because required fields are missing.

---

## 8. Sentences you can say in the viva

- "A component is a function that returns JSX; I reuse it by giving it different props."
- "State is the component's memory; calling the setter makes React redraw."
- "`useEffect` runs code after the page draws; the brackets at the end decide when it runs again."
- "I show different things with a ternary or `&&` depending on state; that is conditional rendering."
- "A controlled input shows its value from state and updates the state on every change."
- "On submit I check each field, put messages in an errors object, and stop if there is any error."
- "The browser never talks to MongoDB directly; React calls my Express API, and the API talks to MongoDB."
- "`await` pauses the function until the database or server answers, so I get the real result and not a pending promise."
- "GET reads, POST creates, PUT updates, DELETE removes. 200 is OK, 201 created, 400 bad input, 404 not found."

## 9. Run it before you go
```
start-mongo.bat
npm run seed
npm run api
npm run dev
```
Then open: `localhost:3000/about/team` (Exp 1), `/students` (Exp 2, 8), `/register` and `/experiments/contact` (Exp 3), `/crew` (Exp 7), and run `npm run exp7` in a terminal for the Exp 7 script. `localhost:3000/experiments` lists every experiment with its files and line numbers.
