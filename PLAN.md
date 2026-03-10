# Feature Plan — Admin UI (Add / Edit / Delete Posts)

**Goal:** Write and manage blog posts directly from the browser at `/admin`.
**Auth:** Supabase magic link (email OTP — enter email, get one-click login link).
**Editor:** Tiptap WYSIWYG (bold, italic, headings, lists, code blocks).

---

## Task Status

| #  | Task                                                              | File(s)                                              | Status                |
|----|-------------------------------------------------------------------|------------------------------------------------------|-----------------------|
| 0  | Supabase dashboard setup — RLS policies + redirect URLs          | Supabase dashboard (manual)                          | Pending — do first    |
| 1  | Install Tiptap packages                                           | `package.json`                                       | Pending               |
| 2  | Add `createSupabaseMiddlewareClient()` to Supabase lib            | `lib/supabase.ts`                                    | Pending               |
| 3  | Create middleware — protect `/admin/*`, refresh sessions          | `middleware.ts`                                      | Pending               |
| 4  | Create auth callback route — exchange magic link for session      | `app/auth/callback/route.ts`                         | Pending               |
| 5  | Create Server Actions — createPost, updatePost, deletePost        | `app/admin/actions.ts`                               | Pending               |
| 6  | Create Tiptap WYSIWYG editor component                            | `app/components/TiptapEditor.tsx`                    | Pending               |
| 7  | Create admin layout + header (sign out button)                    | `app/admin/layout.tsx`, `app/admin/AdminHeader.tsx`  | Pending               |
| 8  | Create login page + magic link form                               | `app/admin/login/page.tsx`, `LoginForm.tsx`          | Pending               |
| 9  | Create admin dashboard — all posts table with edit/delete         | `app/admin/page.tsx`, `DeletePostButton.tsx`         | Pending               |
| 10 | Create new post form                                              | `app/admin/posts/new/page.tsx`                       | Pending               |
| 11 | Create edit post form                                             | `app/admin/posts/[id]/edit/page.tsx`, `EditPostForm.tsx` | Pending          |
| 12 | Update post detail page — render HTML instead of plain text       | `app/blog/[slug]/page.tsx`                           | Pending               |
| 13 | Add `.input` CSS utility class                                    | `app/globals.css`                                    | Pending               |

---

## Task 0 — Supabase Dashboard Setup (manual — do before any code)

### A. Run this SQL in Supabase → SQL Editor

```sql
-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anonymous users can only read published posts
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT TO anon
  USING (published = true);

-- Authenticated admin has full access
CREATE POLICY "Authenticated users have full access"
  ON posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Prevent duplicate slugs
ALTER TABLE posts ADD CONSTRAINT posts_slug_unique UNIQUE (slug);
```

### B. Add redirect URLs in Supabase → Authentication → URL Configuration

Add both of these to "Redirect URLs":
- `http://localhost:3000/auth/callback`
- `https://<your-vercel-domain>/auth/callback`

---

## Task 1 — Install Tiptap packages

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-link
```

---

## Task 2 — `lib/supabase.ts`

Add a new exported function `createSupabaseMiddlewareClient(request, response)` at the bottom.
This uses the `NextRequest`/`NextResponse` cookie API instead of `next/headers` — required in middleware.

---

## Task 3 — `middleware.ts` (project root)

- Runs on every request (broad matcher — required for Supabase session refresh to work on all routes)
- Calls `supabase.auth.getUser()` — **not** `getSession()` (getUser verifies with Supabase server; getSession only reads the cookie and can be spoofed)
- Redirects unauthenticated users on `/admin/*` → `/admin/login`
- Redirects already-logged-in users on `/admin/login` → `/admin`
- **Critical:** must return the same `response` object passed into `createSupabaseMiddlewareClient` — otherwise refreshed session tokens are lost

---

## Task 4 — `app/auth/callback/route.ts`

GET handler. When the user clicks the magic link in their email, Supabase redirects here with a `?code=` param.
Calls `supabase.auth.exchangeCodeForSession(code)` then redirects to `/admin`.
On failure, redirects to `/admin/login?error=auth_failed`.

---

## Task 5 — `app/admin/actions.ts`

`"use server"` file. Three exported async functions:

| Function | What it does |
|----------|-------------|
| `createPost(data)` | Inserts new row, auto-generates slug from title if not provided, calls `revalidatePath`, redirects to `/admin` |
| `updatePost(id, data)` | Updates row by id, calls `revalidatePath` on `/blog`, `/blog/[slug]`, and `/admin`, redirects to `/admin` |
| `deletePost(id)` | Deletes row by id, calls `revalidatePath`, no redirect (caller stays on dashboard) |

Each function verifies `supabase.auth.getUser()` internally as a security double-check.

---

## Task 6 — `app/components/TiptapEditor.tsx`

`"use client"` component. Props: `initialContent?: string` (HTML), `onChange: (html: string) => void`.

Toolbar buttons: Bold, Italic, H2, H3, Bullet List, Ordered List, Blockquote, Code Block.

Two critical implementation rules:
1. Set `immediatelyRender: false` in `useEditor` — prevents SSR/hydration mismatch in Next.js App Router
2. Every toolbar button must have `type="button"` — prevents accidental form submission

---

## Task 7 — `app/admin/layout.tsx` + `AdminHeader.tsx`

**`layout.tsx`** (Server Component):
- Calls `supabase.auth.getUser()` — redirects to login if no session (belt-and-suspenders beyond middleware)
- Renders admin chrome (no public Navbar/Footer) + `{children}`

**`AdminHeader.tsx`** (`"use client"`):
- Shows user email + Sign Out button + link to View Site
- Sign out: calls `supabase.auth.signOut()`, then `router.push('/admin/login')` + `router.refresh()`

---

## Task 8 — `app/admin/login/page.tsx` + `LoginForm.tsx`

**`page.tsx`** (Server Component): simple wrapper with heading and centered card layout.

**`LoginForm.tsx`** (`"use client"`):
- Email input + submit button
- Calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '/auth/callback' } })`
- Shows success state ("Check your email") after sending
- Shows error message on failure

---

## Task 9 — `app/admin/page.tsx` + `DeletePostButton.tsx`

**`page.tsx`** (Server Component):
- Fetches ALL posts (no `published` filter) — shows drafts + published
- Table with columns: Title/Slug, Status badge (Published/Draft), Date, Actions (Edit link + Delete button)
- "New Post" button links to `/admin/posts/new`

**`DeletePostButton.tsx`** (`"use client"`):
- Uses `useTransition` for pending state
- `window.confirm()` before calling `deletePost(postId)`
- Shows "Deleting…" while pending

---

## Task 10 — `app/admin/posts/new/page.tsx`

`"use client"` component (needs Tiptap + local state).

Fields:
| Field | Notes |
|-------|-------|
| Title | Required. Auto-generates slug as user types |
| Slug | Required. Editable. Shows preview URL `/blog/{slug}` |
| Excerpt | Optional textarea. Shown on blog listing cards |
| Content | TiptapEditor component |
| Publish | Checkbox — toggles `published` boolean |

Calls `createPost()` on submit. Uses `useTransition` for loading state.

---

## Task 11 — `app/admin/posts/[id]/edit/page.tsx` + `EditPostForm.tsx`

**`page.tsx`** (Server Component): fetches post by `id` param from Supabase → passes to `EditPostForm` as props.

**`EditPostForm.tsx`** (`"use client"`): identical structure to the new post form but:
- All fields pre-populated from `post` props
- Passes `initialContent={post.content}` to TiptapEditor
- Calls `updatePost(post.id, data)` on submit

---

## Task 12 — `app/blog/[slug]/page.tsx`

Change content rendering from plain text to HTML:
- Remove `whitespace-pre-wrap` and `{post.content}`
- Use `dangerouslySetInnerHTML={{ __html: post.content }}`
- Add Tailwind arbitrary selectors to style Tiptap HTML output (`[&_h2]:`, `[&_p]:`, `[&_code]:`, etc.)

**Note on existing posts:** Posts previously stored as plain text will lose line breaks when rendered as HTML. Update them in Supabase dashboard to wrap paragraphs in `<p>` tags after this change.

---

## Task 13 — `app/globals.css`

Add a reusable `.input` utility class used across all admin form inputs:

```css
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
}
```

---

## New File Map

```
middleware.ts                                          NEW
app/
├── auth/
│   └── callback/route.ts                             NEW
├── admin/
│   ├── layout.tsx                                    NEW  (Server Component)
│   ├── AdminHeader.tsx                               NEW  "use client"
│   ├── page.tsx                                      NEW  (dashboard)
│   ├── DeletePostButton.tsx                          NEW  "use client"
│   ├── actions.ts                                    NEW  "use server"
│   ├── login/
│   │   ├── page.tsx                                  NEW
│   │   └── LoginForm.tsx                             NEW  "use client"
│   └── posts/
│       ├── new/
│       │   └── page.tsx                              NEW  "use client"
│       └── [id]/
│           └── edit/
│               ├── page.tsx                          NEW  (Server Component)
│               └── EditPostForm.tsx                  NEW  "use client"
└── components/
    └── TiptapEditor.tsx                              NEW  "use client"

lib/supabase.ts                                       MODIFIED
app/blog/[slug]/page.tsx                              MODIFIED
app/globals.css                                       MODIFIED
```
