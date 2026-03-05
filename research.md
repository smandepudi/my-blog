# Copilot / AI Agent Instructions — "The Curious Stack" Blog

This is a Next.js 16 (App Router) TypeScript personal blog called "The Curious Stack". It stores
posts in a Supabase PostgreSQL database and renders them server-side with TailwindCSS 4 styling.
Use these instructions as the authoritative reference before making any changes.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| UI | React | 19.2.3 |
| Language | TypeScript (strict) | 5.x |
| Database | Supabase (PostgreSQL) | JS 2.90.1, SSR 0.8.0 |
| Styling | TailwindCSS | 4.x |
| Fonts | Geist + Geist Mono | via next/font/google |
| Linting | ESLint flat config | 9.x |

---

## Directory Structure

```
app/
├── layout.tsx              # Root layout — Geist fonts, wraps all pages with Navbar + Footer
├── globals.css             # TailwindCSS @import + CSS variables (--background, --foreground)
├── page.tsx                # / homepage — hero section, "Get Started" button (no href yet)
├── about/
│   └── page.tsx            # /about — author bio + skills grid (placeholder content)
├── blog/
│   ├── page.tsx            # /blog — post listing page (BROKEN — see Known Issues)
│   └── [slug]/
│       └── page.tsx        # /blog/:slug — individual post detail page (working)
└── components/
    ├── navbar.tsx          # Site header: "The Curious Stack" branding + nav links
    └── footer.tsx          # Dark footer: 3-col layout, dynamic copyright year, social links

lib/
└── supabase.ts             # Supabase client factories (server + browser)

.env.local                  # NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
tsconfig.json               # strict: true, @/* alias maps to project root
next.config.ts              # Minimal — no custom config yet
postcss.config.mjs          # @tailwindcss/postcss
eslint.config.mjs           # ESLint 9 flat config, extends next/core-web-vitals + typescript
```

---

## Pages & Routes

| Route | File | Status | Notes |
|-------|------|--------|-------|
| `/` | `app/page.tsx` | Working | Hero section, placeholder CTA |
| `/about` | `app/about/page.tsx` | Working | "[Your Name]" placeholder content |
| `/blog` | `app/blog/page.tsx` | **BROKEN** | Contains wrong code — see Known Issues |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Working | Fetches post by slug from Supabase |

---

## Database — Supabase

**Table: `posts`**

```typescript
type Post = {
  id: string;             // UUID primary key
  title: string;          // Post title
  slug: string;           // URL-safe identifier (e.g., "my-first-post")
  excerpt: string | null; // Short preview text (optional)
  content: string;        // Full post body (plain text, whitespace-pre-wrap rendered)
  published: boolean;     // true = visible; false = draft (never query without this filter)
  created_at: string;     // ISO 8601 timestamp
};
```

**Standard query patterns:**

```typescript
// Fetch all published posts (listing page)
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false });

// Fetch single post by slug (detail page)
const { data: post } = await supabase
  .from('posts')
  .select('*')
  .eq('slug', slug)
  .eq('published', true)
  .single();
```

**Environment variables** (in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anonymous key (safe to expose; limited permissions by design)

---

## Supabase Client Usage

`lib/supabase.ts` exports two factories — use the correct one for context:

| Function | When to use |
|----------|-------------|
| `createSupabaseServerClient()` | Server Components, route handlers (default — use this) |
| `createSupabaseBrowserClient()` | `"use client"` components that need browser-side queries |

The server client reads/writes cookies via Next.js `next/headers`. Cookie setters are wrapped in
`try/catch` because some rendering contexts are read-only — do not remove that pattern.

```typescript
// Server component fetch (standard pattern)
const supabase = await createSupabaseServerClient();
const { data, error } = await supabase.from('posts').select('*').eq('published', true);

// Client component fetch
"use client";
const supabase = createSupabaseBrowserClient();
```

---

## Conventions & Patterns

**Components:**
- All pages and components are React Server Components by default (no `"use client"`)
- Only add `"use client"` when you need browser APIs, `useState`, `useEffect`, or event handlers
- Import alias: always use `@/*` (e.g., `@/lib/supabase`, `@/app/components/navbar`)

**Styling:**
- 100% Tailwind utility classes inline in JSX — no CSS Modules, no styled-components
- New global styles go in `app/globals.css` only
- Dark mode handled via `prefers-color-scheme` media query in `globals.css`
- Responsive patterns already in use: `md:grid-cols-*`, `md:col-*`

**TypeScript:**
- `strict: true` — always type props and data shapes explicitly
- Define a local `Post` type in files that query the posts table (see existing pages)
- Props typed with `readonly` constraints where applicable

**Fonts:**
- Loaded via `next/font/google` in `app/layout.tsx`
- Exposed as CSS variables: `--font-geist-sans`, `--font-geist-mono`
- Apply to `<body>` element — follow this pattern for any new fonts

**Next.js 16 specifics:**
- Dynamic params are `Promise<{slug: string}>` — always `await params` before using
- Use `notFound()` from `next/navigation` for 404 cases

---

## Known Issues (fix before shipping)

### 1. CRITICAL — `/blog` listing page is broken
`app/blog/page.tsx` currently contains single-post detail code instead of a post listing.
It was likely overwritten when `app/blog/[slug]/page.tsx` was added (commit `d22402c`).

**Correct implementation:**
```typescript
import { createSupabaseServerClient } from '@/lib/supabase';
import Link from 'next/link';

type Post = {
  id: string; title: string; slug: string;
  excerpt: string | null; created_at: string;
};

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (!posts || posts.length === 0) {
    return <p className="text-center py-12">No blog posts yet.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <div key={post.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            {post.excerpt && <p className="text-gray-600 mb-3">{post.excerpt}</p>}
            <p className="text-sm text-gray-400 mb-4">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### 2. Placeholder content (incomplete, not bugs)
- `app/about/page.tsx` — replace "[Your Name]" and update skills
- `app/components/footer.tsx` — update GitHub, LinkedIn, email links
- `app/page.tsx` — add `href` to "Get Started" button
- `app/layout.tsx` — update metadata title/description from "Create Next App"

### 3. No admin/write UI
Posts can only be created/edited via the Supabase dashboard. No auth or CMS UI exists yet.

---

## Important Files Quick Reference

- **`app/layout.tsx`** — global wrapper, font setup, metadata (update title/description here)
- **`app/blog/[slug]/page.tsx`** — canonical example of server-side Supabase fetch + dynamic routing
- **`lib/supabase.ts`** — start here before any database work; do not bypass the cookie try/catch
- **`app/components/navbar.tsx`** — reference for stateless Tailwind components with Next `Link`
- **`app/globals.css`** — only place for global CSS; add new theme tokens here

---

## Developer Commands

```bash
npm run dev      # Start dev server (next dev)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint check
```

Expected deploy target: **Vercel** (per project README).
