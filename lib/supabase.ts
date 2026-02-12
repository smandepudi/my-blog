import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// ```

// ---

// ### **H. Add Sample Data:**

// Go back to Supabase:

// 1. Click **"Table Editor"** → **"posts"**
// 2. Click **"Insert row"**
// 3. Add a sample post:
// ```
// title: Getting Started with Next.js
// slug: getting-started-nextjs
// content: This is my first blog post! Next.js is amazing for building modern web applications.
// excerpt: Learn how to get started with Next.js
// published: true (check the box)