import { createSupabaseServerClient } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  created_at: string;
};

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/blog"
        className="text-blue-600 hover:text-blue-700 font-medium mb-8 inline-block"
      >
        ← Back to Blog
      </Link>

      <article>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        <p className="text-sm text-gray-400 mb-8">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </main>
  );
}
