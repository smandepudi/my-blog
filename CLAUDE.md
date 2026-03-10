# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (run this to catch type errors before committing)
npm run lint     # ESLint check
npm run start    # Run production build locally
```

No test framework is configured. Verify changes with `npm run build`.

## Architecture

**"The Curious Stack"** — a Next.js 16 App Router personal blog backed by Supabase (PostgreSQL).

- **Framework:** Next.js 16.1.1, React 19, TypeScript strict
- **Database:** Supabase via `@supabase/ssr` 0.8.0
- **Styling:** TailwindCSS 4 — utility classes only, no CSS Modules
- **Fonts:** Geist + Geist Mono loaded in `app/layout.tsx` as CSS variables `--font-geist-sans` / `--font-geist-mono`
- **Deploy target:** Vercel

### Supabase `posts` table schema

```typescript
type Post = {
  id: string; // UUID primary key
  title: string;
  slug: string; // unique, URL-safe
  excerpt: string | null;
  content: string; // HTML (rendered with dangerouslySetInnerHTML)
  published: boolean; // always filter by this for public queries
  created_at: string; // ISO 8601
};
```

### Supabase client factories (`lib/supabase.ts`)

| Function                                   | Use when                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| `createSupabaseServerClient()`             | Server Components, route handlers — reads/writes cookies via `next/headers` |
| `createSupabaseBrowserClient()`            | `"use client"` components                                                   |
| `createSupabaseMiddlewareClient(req, res)` | `middleware.ts` only — uses `NextRequest`/`NextResponse` cookies            |

The `setAll` cookie handler in the server client is wrapped in `try/catch` because Server Components are read-only rendering contexts. Do not remove that pattern.

### Route structure

```
app/
├── layout.tsx                    # Root layout — Navbar + Footer wrap all public pages
├── blog/page.tsx                 # /blog — published post listing
├── blog/[slug]/page.tsx          # /blog/:slug — post detail (dangerouslySetInnerHTML for content)
├── admin/                        # Protected by middleware — no Navbar/Footer
│   ├── layout.tsx                # Admin shell, server-side auth check
│   ├── page.tsx                  # Dashboard: all posts table (drafts + published)
│   ├── actions.ts                # "use server" — createPost, updatePost, deletePost
│   ├── login/page.tsx            # Magic link login form
│   └── posts/new/page.tsx        # New post form
│   └── posts/[id]/edit/page.tsx  # Edit post form
└── auth/callback/route.ts        # Exchanges Supabase magic link code for session
middleware.ts                     # Protects /admin/*, refreshes sessions on all routes
lib/supabase.ts                   # All Supabase client factories
```

### Key patterns

**Next.js 16:** Dynamic params arrive as a `Promise` — always `await params` before use:

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
}
```

**Auth middleware:** Uses `supabase.auth.getUser()` (not `getSession()`) — `getUser` verifies with the Supabase server; `getSession` only reads the cookie and can be spoofed. The middleware must return the same `response` object passed into `createSupabaseMiddlewareClient` to preserve refreshed session tokens.

**Server Actions** (`app/admin/actions.ts`): Each action calls `supabase.auth.getUser()` internally as a security check, then calls `revalidatePath()` after mutations.

**Tiptap editor** (`app/components/TiptapEditor.tsx`): Set `immediatelyRender: false` in `useEditor` to prevent SSR/hydration mismatch. All toolbar buttons must have `type="button"` to prevent form submission.

**Admin pages** are `"use client"` when they include Tiptap or local form state; otherwise Server Components.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Set in `.env.local` for local dev; configured directly in Vercel dashboard for production.

## In-progress work

See `PLAN.md` for the admin UI feature plan (add/edit/delete posts from the browser). Tasks 1–13 implement auth, Tiptap editor, and all admin pages.
