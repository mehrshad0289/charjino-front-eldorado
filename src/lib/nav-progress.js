/* YouTube/GitHub-style top bar for App Router navigations.
   Not BlogReadingProgress (scroll depth on an article).
   State lives on window so instrumentation-client and the React
   bundle share one bar even if webpack splits the module twice. */

const ROOT_ID = "charjino-nav-progress";
const STORE = "__charjinoNavProgress";

function store() {
  const g = globalThis;
  if (!g[STORE]) {
    g[STORE] = { status: 0, trickle: 0, hide: 0 };
  }
  return g[STORE];
}

function root() {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(ROOT_ID);
  if (el) return el;
  el = document.createElement("div");
  el.id = ROOT_ID;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<div class="charjino-nav-progress-peg"></div>';
  (document.body || document.documentElement).appendChild(el);
  return el;
}

function paint() {
  const el = document.getElementById(ROOT_ID);
  if (!el) return;
  const peg = el.firstElementChild;
  if (peg) peg.style.width = `${Math.max(store().status, 0) * 100}%`;
}

function trickle() {
  const s = store();
  clearTimeout(s.trickle);
  if (s.status <= 0 || s.status >= 1) return;
  s.trickle = window.setTimeout(() => {
    if (s.status <= 0 || s.status >= 1) return;
    const rest = 1 - s.status;
    s.status = Math.min(0.94, s.status + Math.max(0.008, rest * 0.07));
    paint();
    trickle();
  }, 320);
}

export function startNavProgress() {
  if (typeof document === "undefined") return;
  const s = store();
  clearTimeout(s.hide);
  const el = root();
  if (!el) return;
  el.classList.add("is-on");
  s.status = s.status > 0 && s.status < 1 ? Math.min(s.status, 0.2) : 0.14;
  paint();
  trickle();
}

export function doneNavProgress() {
  if (typeof document === "undefined") return;
  const s = store();
  if (s.status === 0) return;
  clearTimeout(s.trickle);
  s.status = 1;
  paint();
  const el = document.getElementById(ROOT_ID);
  s.hide = window.setTimeout(() => {
    el?.classList.remove("is-on");
    s.hide = window.setTimeout(() => {
      s.status = 0;
      paint();
    }, 200);
  }, 180);
}
