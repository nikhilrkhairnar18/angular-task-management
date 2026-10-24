# Angular Task Management

Standalone Angular application for managing tasks with a JSON Server REST API, reactive forms, routing, and signal-based state management.

## Prerequisites

- Node.js 20+ (project uses npm 11)
- Two terminals for app + API during local development

## Installation

```bash
npm install
```

## Run the application

Terminal 1 — REST API (JSON Server):

```bash
npm run api
```

Terminal 2 — Angular dev server (proxies `/api` → `http://localhost:3000`):

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app redirects to `/tasks`.

## Tests

```bash
npm test
```

This project uses Angular’s Vitest-based unit test runner (`@angular/build:unit-test`).

## Project architecture

```
src/app/
  core/
    models/          Task interfaces and filter types
    services/
      task-api.service.ts    HttpClient CRUD (only layer that talks to HTTP)
      task-state.service.ts  Signal store + orchestration
    utils/           Pure helpers (overdue, stats, filtering)
  features/
    dashboard/     Statistics cards (derived from state)
    tasks/           List, form, delete dialog, form page
    not-found/       404 page
  layout/          Shell with sidebar navigation
  shared/          Reusable UI (feedback banner)
```

### State management rationale

`TaskStateService` is the **single source of truth**:

- Holds tasks in a private `signal`, exposed read-only.
- Uses **computed signals** for `stats` and `filteredTasks` (immutable derived data).
- Mutations go through methods that call `TaskApiService` and apply **immutable** array updates.
- UI components inject `TaskStateService` only — they never use `HttpClient` directly.

Signals were chosen over NgRx for this assessment scope: less boilerplate, easy to explain in an interview, while still demonstrating reactive, derived state.

### Data flow

1. `FeedbackBannerComponent` (on task screens) triggers `loadTasks()` on init; the state service deduplicates successful and in-flight loads.
2. `TaskStateService.loadTasks()` → `TaskApiService.getAll()` → updates `tasks` signal and marks the initial load complete.
3. List/dashboard read `filteredTasks()` / `stats()` computeds.
4. Create/update/delete call state methods → API → optimistic/local update → success/error signals for UI feedback.

The task list and form wait for the initial load to complete, preventing empty-state and missing-task messages from appearing while data is still being retrieved. A failed initial load can be retried from the error banner.

### Assumptions

- Task `id` is a string; new IDs are generated with `crypto.randomUUID()` before POST.
- `dueDate` is stored as `YYYY-MM-DD` (HTML date input format).
- Overdue means due date before today (local) and status is not `completed`.
- JSON Server runs on port `3000`; Angular proxy serves API at `/api`.

### Trade-offs

- **Client-side filtering/search** keeps the UI simple for demo data; no server pagination.
- **Optimistic updates** on create/update/delete improve perceived speed; failed requests roll back where implemented.
- **No auth** — suitable for local assessment only.
- Edit page resolves tasks from in-memory state after initial load (no dedicated route resolver).

### Incomplete / optional requirements

- No pagination, sorting beyond default table order, or drag-and-drop.
- No persistent toast queue; inline banners for success/error.
- No e2e tests (unit tests only).

### Production improvements

- Real backend with auth, validation, and audit logging.
- Environment-specific API URLs and HTTPS.
- Global error handler and structured logging.
- Optimistic update conflict handling and idempotency keys.
- Accessibility audit (focus trap in dialog, keyboard shortcuts).
- CI pipeline running `ng build` and `ng test` on every PR.

### Scaling to thousands of tasks

- **Server-side** search, filter, sort, and cursor-based pagination.
- **Virtual scroll** (`@angular/cdk/scrolling`) for the table/list DOM.
- Debounced search input; avoid recomputing filters on every keystroke without debounce.
- Keep statistics aggregated on the server or via incremental counters if the full list is not loaded.
- Cache policy (HTTP cache headers or short-lived client cache with invalidation on mutations).

## AI coding assistance declaration

This project was implemented with **AI coding assistance** (Cursor / Claude) for scaffolding, styling, tests, and documentation. All code was reviewed and adjusted to meet the assessment requirements; tests and builds were run locally to verify behavior.
