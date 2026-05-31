# CLAUDE.md — `frontend/`

> Rules for the user-facing Next.js application.
> Also read the root `CLAUDE.md` before working here.

---

## What This App Is

The public-facing Next.js frontend. End users interact with this app.
It communicates with `backend/` only via HTTP API calls — never directly.

## Stack

- Next.js (App Router)
- TypeScript (strict — no `any`)
- Tailwind CSS (no inline styles)
- tus-js-client (chunked video uploads)
- Web Workers (heavy client-side processing)

---

## Folder Structure

```
frontend/
└── src/
    ├── app/            ← ROUTING ONLY (Next.js App Router)
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── dashboard/page.tsx
    │   ├── videos/
    │   │   ├── page.tsx
    │   │   └── [id]/page.tsx
    │   ├── layout.tsx
    │   └── api/        ← Thin proxy routes to backend only
    │
    ├── pages/          ← FULL PAGE COMPOSITIONS
    │   ├── auth/
    │   │   ├── Login.page.tsx
    │   │   └── Register.page.tsx
    │   ├── dashboard/
    │   │   └── Dashboard.page.tsx
    │   └── videos/
    │       ├── VideoList.page.tsx
    │       └── VideoDetail.page.tsx
    │
    ├── components/
    │   ├── ui/         ← Atoms: Button, Input, Modal, Badge, Spinner
    │   ├── layout/     ← Navbar, Sidebar, PageWrapper
    │   ├── forms/      ← FormField, ValidationMessage
    │   └── features/   ← VideoUploader, MetricsGrid, UserCard
    │
    ├── hooks/          ← Global custom hooks (useAsync, useDebounce, etc.)
    ├── workers/        ← Web Workers (video.worker.ts, image.worker.ts)
    ├── lib/
    │   ├── api.ts      ← All fetch/axios calls to backend — single file
    │   ├── formatters.ts
    │   └── validators.ts
    ├── types/          ← Shared TypeScript types (api.types.ts, video.types.ts…)
    └── styles/
        └── globals.css
```

---

## The Two-Layer Rule (Most Important)

### `app/` — Routing Layer
- One `page.tsx` per route
- Imports **exactly one** page component
- Has metadata exports only
- **Zero** `useState`, `useEffect`, JSX logic, or data fetching

### `pages/` — Composition Layer
- Assembles components into a full page layout
- Uses hooks, manages local state, passes data down
- No routing concerns

```tsx
// ✅ Correct app/dashboard/page.tsx
import { DashboardPage } from '@/pages/dashboard/Dashboard.page';
export default function DashboardRoute() { return <DashboardPage />; }

// ❌ Wrong — never do this in app/page.tsx
export default function DashboardRoute() {
  const [data, setData] = useState([]); // NO
  return <div>...</div>;               // NO
}
```

---

## Component Rules

- Functional components always (class only for Error Boundaries)
- Props are the only contract — no page-specific logic inside components
- Reusable in 2+ places → extract to `hooks/use*.ts`
- `useMemo` / `useCallback` only for genuinely expensive operations

---

## Styling

```tsx
✅  className={cn('px-4 py-2', isActive && 'bg-blue-600')}
❌  style={{ padding: '8px 16px' }}
```

---

## API Calls

All calls to `backend/` go through `src/lib/api.ts`. No component or hook
imports `fetch` or `axios` directly — they call a named function from `api.ts`.

```ts
// ✅ src/lib/api.ts
export async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  return res.json();
}

// ✅ In a hook or page
import { getVideos } from '@/lib/api';
```

---

## Video Uploads

- Always use `tus-js-client` — never a raw `POST` with a full file
- Default chunk size: 5 MB
- All pre-processing (validation, thumbnail, compression) runs in `workers/video.worker.ts`
- Main thread must never block during file work

---

## File Naming

| Type | Pattern | Example |
|---|---|---|
| Route | `lowercase/page.tsx` | `app/dashboard/page.tsx` |
| Page | `PascalCase.page.tsx` | `Dashboard.page.tsx` |
| Component | `PascalCase.tsx` | `Button.tsx` |
| Types | `PascalCase.types.ts` | `Button.types.ts` |
| Hook | `useCamelCase.ts` | `useDebounce.ts` |
| Worker | `name.worker.ts` | `video.worker.ts` |
| Types | `name.types.ts` | `video.types.ts` |

---

## PR Checklist

- [ ] `app/page.tsx` has only metadata + one page import
- [ ] No `useState` / `useEffect` in `app/` layer
- [ ] Components are reusable with no page-specific logic
- [ ] All API calls go through `lib/api.ts`
- [ ] No `style={{}}` — Tailwind + `cn()` only
- [ ] No `any` types
- [ ] Video uploads use `tus-js-client`
- [ ] Heavy processing in Web Worker, not main thread
- [ ] Reused stateful logic extracted to `hooks/`
