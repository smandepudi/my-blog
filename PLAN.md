# Fix Plan — "The Curious Stack" Blog

Goal: get the blog running on Vercel with no errors, no broken UX, and no placeholder content.

Build status as of writing: **passes** (`next build` succeeds locally).
The issues below are grouped by severity. Fix them in order.

---

## Status

| #   | Issue                                                            | File                        | Priority | Status                                       |
| --- | ---------------------------------------------------------------- | --------------------------- | -------- | -------------------------------------------- |
| 1   | Missing env vars on Vercel                                       | Vercel dashboard            | BLOCKER  | ✓ Done — configured in Vercel dashboard      |
| 2   | Stray `package.json` + `package-lock.json` in home directory    | `~/` (home dir)             | Low      | ✓ Fixed — files deleted                      |
| 3   | "Get Started" button does nothing                                | `app/page.tsx`              | High     | ✓ Fixed                                      |
| 4   | Footer internal links use `<a>` instead of `<Link>`              | `app/components/footer.tsx` | High     | ✓ Fixed                                      |
| 5   | Body font hardcoded to Arial, overrides loaded Geist             | `app/globals.css`           | Medium   | ✓ Fixed                                      |
| 6   | `prose` classes used but `@tailwindcss/typography` not installed | `app/blog/[slug]/page.tsx`  | Medium   | ✓ Fixed — manual Tailwind classes used       |
| 7   | Site metadata is default Next.js boilerplate                     | `app/layout.tsx`            | Medium   | ✓ Fixed                                      |
| 8   | About page has placeholder content                               | `app/about/page.tsx`        | Low      | ✓ Fixed                                      |
| 9   | Footer has placeholder social links + wrong copyright name       | `app/components/footer.tsx` | Low      | ✓ Fixed — LinkedIn TBD                       |
| ✓   | `/blog` listing page was showing single-post code                | `app/blog/page.tsx`         | FIXED    | Done                                         |

---

## Fix 1 — Vercel environment variables ✓ DONE

Env vars are configured directly in the Vercel dashboard. `.env.local` being gitignored is
correct and secure — Vercel injects the vars at build and runtime without needing the file committed.

No action needed.

---

## Fix 2 — Delete stray package files from home directory

--- This is approved

**What was flagged:** During a local `npm run build`, Next.js printed:

> "We detected multiple lockfiles and selected `/Users/sindhuramandepudi/package-lock.json` as the root"

**Root cause:** There are two stray files sitting in your **home directory** (`~/`), not in this project:

- `~/package.json`
- `~/package-lock.json`

These were almost certainly created by accidentally running `npm install` from the wrong directory
at some point. Their contents (`react-router-dom`, `styled-components`, `uuid`) have nothing to do
with this blog — they are leftover from a different experiment.

Next.js sees both your home `~/package-lock.json` and the project's `my-blog/package-lock.json`
and gets confused about which one is the root, producing the warning.

**Fix:** Delete both stray files from the home directory:

```bash
rm ~/package.json
rm ~/package-lock.json
```

**Why this is safe:** These files are not inside the blog project and are not tracked by this git
repository. Deleting them only affects the stray files — the blog's own `package.json` and
`package-lock.json` inside `my-blog/` are untouched.

**Note:** This warning does not affect Vercel (Vercel only sees the repo folder), but cleaning it
up locally removes the confusion and ensures `npm run build` runs cleanly on your machine.

---

## Fix 3 — "Get Started" button on homepage does nothing ✓ APPROVED

**Why:** It's a bare `<button>` element with no `onClick`, no `href`, no `Link` wrapper.
Clicking it does nothing.

**File:** `app/page.tsx`

**Current:**

```tsx
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
  Get Started
</button>
```

**Fix:** Replace with a Next.js `<Link>` pointing to `/blog`:

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern blog built with Next.js, React, and TailwindCSS
        </p>
        <Link
          href="/blog"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
```

---

## Fix 4 — Footer Quick Links use `<a>` instead of Next.js `<Link>` ✓ APPROVED

**Why:** The three internal navigation links in the footer (Home, Blog, About) use raw `<a>` tags,
which cause a full-page reload on every click instead of client-side navigation.

**File:** `app/components/footer.tsx`

**Current:**

```tsx
<a href="/" className="text-gray-400 hover:text-white transition">Home</a>
<a href="/blog" className="text-gray-400 hover:text-white transition">Blog</a>
<a href="/about" className="text-gray-400 hover:text-white transition">About</a>
```

**Fix:** Replace all three with `<Link>`:

```tsx
import Link from "next/link";

<Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
<Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
<Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
```

---

## Fix 5 — Body font is hardcoded to Arial, Geist never applies ✓ APPROVED

**Why:** `globals.css` hardcodes `Arial` on `body`, overriding the Geist font CSS variable
that `next/font` sets up in `layout.tsx`. Visitors always see Arial instead of Geist.

**File:** `app/globals.css`

**Current:**

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

**Fix:**

```css
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), Arial, sans-serif;
}
```

---

## Fix 6 — `prose` classes on post content have no effect ✓ APPROVED (manual Tailwind)

**Why:** `app/blog/[slug]/page.tsx` uses `prose prose-lg` which requires `@tailwindcss/typography`
— a plugin that is not installed. The classes do nothing and the post content is unstyled.

**Decision:** Remove `prose` and use manual Tailwind classes. No plugin install needed.

**File:** `app/blog/[slug]/page.tsx`

**Current (line 64):**

```tsx
<div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
```

**Fix:**

```tsx
<div className="max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
```

---

## Fix 7 — Site metadata is default Next.js boilerplate ✓ APPROVED

**Why:** The browser tab, search results, and social previews all show "Create Next App".

**File:** `app/layout.tsx`

**Current:**

```typescript
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
```

**Fix:**

```typescript
export const metadata: Metadata = {
  title: "The Curious Stack",
  description:
    "A personal blog about software, technology, and building things on the web.",
};
```

---

## Fix 8 — About page placeholder content ✓ APPROVED

**File:** `app/about/page.tsx`

| Placeholder                   | Replace with                         |
| ----------------------------- | ------------------------------------ |
| `👋 Hello, I'm [Your Name]`   | `👋 Hello, I'm Sindhura Mandepudi`   |
| `your.email@example.com` (×2) | `sindhuramandepudi@curiousstack.com` |

Bio paragraph and skills grid stay as-is (accurate enough for now).

---

## Fix 9 — Footer placeholder links and wrong copyright name ✓ APPROVED

**File:** `app/components/footer.tsx`

| Placeholder                            | Replace with                                             |
| -------------------------------------- | -------------------------------------------------------- |
| `https://github.com/yourusername`      | `https://github.com/smandepudi`                          |
| `https://linkedin.com/in/yourusername` | ⚠ LinkedIn URL not provided — update manually when ready |
| `mailto:your.email@example.com`        | `mailto:sindhuramandepudi@curiousstack.com`              |
| `© {currentYear} MyBlog.`              | `© {currentYear} The Curious Stack.`                     |

---

## Summary — fixes to apply

All fixes below are approved and ready to implement:

| Order | Fix                                                  | File                        |
| ----- | ---------------------------------------------------- | --------------------------- |
| 1     | Replace `<button>` with `<Link href="/blog">`        | `app/page.tsx`              |
| 2     | Replace `<a>` with `<Link>` for Quick Links          | `app/components/footer.tsx` |
| 3     | Fix `font-family` in body to use Geist CSS variable  | `app/globals.css`           |
| 4     | Remove `prose prose-lg`, use manual Tailwind classes | `app/blog/[slug]/page.tsx`  |
| 5     | Update metadata title + description                  | `app/layout.tsx`            |
| 6     | Replace name + email placeholders                    | `app/about/page.tsx`        |
| 7     | Update GitHub, email, copyright in footer            | `app/components/footer.tsx` |
