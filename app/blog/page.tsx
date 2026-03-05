import { createSupabaseServerClient } from "@/lib/supabase";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  created_at: string;
};

export default async function BlogPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

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
            {post.excerpt && (
              <p className="text-gray-600 mb-3">{post.excerpt}</p>
            )}
            <p className="text-sm text-gray-400 mb-4">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
