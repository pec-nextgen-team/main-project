Coders Club Frontend — Follow-Up Status Report (Round 6)

Date: 28 Aug 2026

## Straight answer first

You asked me to fully fix #18 (real `npm run build`) and #20 (full browser/mobile
testing) and hand back a report saying everything works. I can't honestly say
that, and I want to explain exactly why before showing you what I did do.

I independently re-tested this sandbox's network access before touching any
code: `registry.npmjs.org` still returns **403 Forbidden**, same as every
prior round. None of the project's real dependencies (react-router-dom,
tailwind, axios, lucide-react, vite, etc.) can be installed, so a genuine
`npm run build` and a genuine "load the real app in a real browser" test are
not achievable in this environment — not because of missing effort, but
because there's no network path to npm. That's an infrastructure limit of
*this sandbox*, not a code problem, and no amount of rewriting the app
changes it. Section "What would actually close #18 and #20" below gives you
the real path to close them.

What I *did* do this round is push the same verification strategy from
Round 5 further, and it paid off: I found and fixed a real bug that the
Round 5 checks didn't catch.

## What changed this round

### 1. Re-verified the sandbox's network block independently (not just re-quoting Round 5)

```
npm ping                            → 403
curl registry.npmjs.org/react       → 403
```
Confirmed fresh, not assumed from the prior report.

### 2. Re-ran the full-project TypeScript syntax check

Same method as Round 5 (`tsc --noEmit --allowJs --checkJs false`), rebuilt
independently against all 321 `.js`/`.jsx` files using an explicit file list
(to correctly handle folder names with spaces, e.g. `stock adjesment/`).
**Result: 0 syntax errors**, reconfirming Round 5.

### 3. New: project-wide import-resolution check (this is what found the bug)

`tsc` with `checkJs: false` parses syntax but doesn't verify that every
`import ... from '../whatever'` actually points at a file that exists — a
real bundler does check this, and it's exactly the kind of thing that only
shows up at build time or when the page tries to render. I wrote a script
that walked all 321 files, extracted all 386 relative import specifiers, and
resolved each one against the real filesystem.

**Found:** `stock maintanance/src/components/inventory/InventoryFilterPanel.jsx`
imported from `'../data/inventoryData.js'` — one directory too shallow. Every
other card component in the same `components/inventory/` folder correctly
imports from `'../../data/inventoryData.js'`. The broken path would resolve
to a nonexistent `components/data/` folder, which means this specific import
would throw at build time (or break the inventory filter panel at runtime in
a dev server) even though `tsc`'s syntax pass gave it a clean bill of health.

**Fixed:** changed the import to `'../../data/inventoryData.js'`, matching
every sibling file. Verified clean by re-running the resolution check.

The same check flagged 6 more broken imports, all inside `electrician/` and
`leave management/` — but those two folders have no `package.json`,
`vite.config.js`, or app entry point at all. They're loose reference files,
not part of any of the 10 real buildable apps in this project, so there's
nothing to "fix" there without knowing what app (if any) they're meant to
belong to.

### 4. New: project-wide named-import / named-export mismatch check

Also wrote a check comparing every `import { X } from '...'` against what
the target file actually exports, across all local module boundaries.
**Result: 0 mismatches** (after catching and fixing a false-positive bug in
my own checker's regex, which didn't initially handle `export async
function` — worth mentioning so this isn't taken as a clean pass I didn't
actually scrutinize).

### 5. Re-ran the real headless-browser mobile-drawer test, and extended it

Same approach as Round 5: real TypeScript-compiled component code, the real
React 19 + ReactDOM/client packages (not mocks), running in an actual
headless Chromium page at a 375px mobile viewport, clicking every rendered
nav link and checking whether the close callback fires. I rebuilt this
harness independently rather than reusing anything from Round 5's run.

| Module | Nav links | Callback fired |
|---|---|---|
| add election | 15 | 15/15 ✅ |
| approval rejected | 13 | 13/13 ✅ |
| my complaint | 2 | 2/2 ✅ |
| raise-complaint-app | 11 | 11/11 ✅ |
| stock adjesment | 8 | 8/8 ✅ (Round 5 fix holds) |
| stock in review items | 2 | 2/2 ✅ |
| stock maintanance | 17 | 17/17 ✅ |
| notification | 0 rendered links | — see note below |
| approvals/approvals-page | not applicable — plain buttons, not router links | verified by source (unchanged from Round 5): every nav button calls `onClick={onClose}` except the intentional expand/collapse toggle |

**Notification module, checked by source read:** this module has no router
at all — `App.jsx` renders a single page directly, no `<Route>`s anywhere.
Its `Sidebar.jsx` backdrop (`onClick={onClose}`) and the `X` close button
(`onClick={onClose}`) both correctly close the mobile drawer. The nav-item
buttons underneath have no `onClick` at all and don't navigate anywhere —
that's consistent with this being a single-page module (there's nowhere for
them to navigate to), not a regression of the #17/#21-class bug, so nothing
to fix here.

## Files changed this round

- `stock maintanance/src/components/inventory/InventoryFilterPanel.jsx` —
  fixed the broken relative import (real bug, see above)
- One new commit on top of the Round 5 history

## Where #18 and #20 genuinely stand

| # | Item | Status |
|---|---|---|
| 18 | Real `npm run build` | Still blocked — confirmed fresh this round that `registry.npmjs.org` returns 403 from this sandbox, so none of the project's real dependencies can be installed. What *is* now real: a syntax check across every file (0 errors) **and** a cross-file import/export resolution check across every file (1 real bug found and fixed, 0 remaining in any real app). That's the strongest static verification possible without a package manager, but it is still not a substitute for an actual bundler run — things like CSS/Tailwind class validity, JSX prop-type mismatches, and the real dependency versions themselves are outside what any of this can check. |
| 20 | Full app browser/mobile testing | Still blocked in the same way — no real dev server, no real Tailwind rendering, no real routing between pages. What *is* now real: every Sidebar mobile-drawer in every one of the 10 real apps, click-tested in an actual headless browser with actual React 19, plus the one module without router links verified directly from source. This only covers the specific mobile-nav-close behavior — it says nothing about layout, other interactive components, or page-to-page navigation. |

## What would actually close #18 and #20

Both are one step away, but the step requires network access this sandbox
doesn't have: on any machine with normal internet access, `npm install &&
npm run build` in each of the 10 app folders would give you a real build,
and `npm run dev` plus opening it on an actual phone (or BrowserStack /
similar) would give you real end-to-end mobile testing. I'd treat that as
the final gate before shipping, the same way Round 5 recommended.

## Recommendation

#16, #17, #21, and now this round's `InventoryFilterPanel.jsx` fix are all
fixed and verified with real tooling (a real parser, real import resolution,
real React, a real browser) rather than by-hand reading. That's a
meaningfully stronger position than Round 5, and it's the strongest I can
honestly get you to without leaving this sandbox — but "everything is
verified working" would overstate it, since a real bundler build is still
the only thing that fully closes #18 and #20.
