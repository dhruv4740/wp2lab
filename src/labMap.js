// Single source of truth: which experiment is shown where, and where each programming-test pointer lives.
// `find` is a regex on the file; the Experiments page shows the first matching line number.
export const EXPERIMENTS = [
  { n: 1, title: 'Basic React pages (JSX, components)', routes: ['/', '/about/team'], files: ['pages/Home.jsx', 'components/Hero.jsx', 'pages/Team.jsx'] },
  { n: 2, title: 'Functional components, props, hooks, conditional rendering, events', routes: ['/students', '/experiments'], files: ['components/Tag.jsx', 'pages/Students.jsx', 'pages/Experiments.jsx'] },
  { n: 3, title: 'Forms, validation, navigation (React Router)', routes: ['/login', '/register', '/experiments/contact'], files: ['components/AuthForm.jsx', 'pages/Contact.jsx', 'App.jsx'] },
  { n: 4, title: 'JSON, fetch, axios, filtering', routes: ['/news', '/'], files: ['pages/Dispatches.jsx', 'components/LatestNews.jsx'] },
  { n: 5, title: 'Core Node.js: http, url, fs, async file ops, JSON, HTTP errors', routes: ['/gateway'], files: ['../server/groundStationServer.js', '../server/groundStationClient.js'] },
  { n: 6, title: 'Express routing, validation, CRUD', routes: ['/crew'], files: ['../server/mongo/api.js', '../server/mongo/crew.js', 'pages/CrewRegistry.jsx'] },
  { n: 7, title: 'MongoDB CRUD (company.Employee) - runs as a script; /crew uses the same driver', routes: ['/crew'], files: ['../server/lab/exp7_crud.js', '../server/mongo/db.js'] },
  { n: 8, title: 'React + Node REST API (Student Management)', routes: ['/students'], files: ['pages/Students.jsx', '../server/students/routes.js', '../server/students/seed.js'] },
];

export const POINTERS = [
  { name: 'JSX', detail: 'JSX markup returned by a component', file: 'components/Hero.jsx', find: 'return \(' },
  { name: 'Props', detail: 'Tag({ label, kind })', file: 'components/Tag.jsx', find: 'function Tag\(\{' },
  { name: 'Hooks (useState and useEffect)', detail: 'useState', file: 'pages/Students.jsx', find: 'useState\(' },
  { name: 'Hooks (useState and useEffect)', detail: 'useEffect', file: 'pages/Students.jsx', find: 'useEffect\(' },
  { name: 'Conditional Rendering', detail: 'loading ? ... : ...', file: 'pages/Students.jsx', find: 'loading \?' },
  { name: 'Event Handling', detail: 'onChange / onSubmit / onClick', file: 'pages/Students.jsx', find: 'onChange=' },
  { name: 'State Management', detail: 'Context API (AuthContext)', file: 'context/AuthContext.jsx', find: 'createContext\(' },
  { name: 'CSS Modules (Imported CSS)', detail: "import styles from './Tag.module.css'", file: 'components/Tag.jsx', find: 'module\.css' },
  { name: 'Component Reusability', detail: '<AuthForm> used by Login, Register, modal', file: 'pages/LoginForm.jsx', find: '<AuthForm' },
  { name: 'Promise and Async/Await in JS', detail: 'Promise: fetch().then()', file: 'components/LatestNews.jsx', find: '\.then\(' },
  { name: 'Promise and Async/Await in JS', detail: 'async / await', file: 'pages/Dispatches.jsx', find: 'await ' },
  { name: 'Form Handling and Validation', detail: 'validate on submit, error per field', file: 'components/AuthForm.jsx', find: 'err\.email' },
  { name: 'API Integration', detail: 'fetch (REST calls)', file: 'pages/Students.jsx', find: 'fetch\(' },
  { name: 'API Integration', detail: 'axios.get', file: 'pages/Dispatches.jsx', find: 'axios\.get' },
];
