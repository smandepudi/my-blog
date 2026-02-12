import { createSupabaseServerClient } from '@/lib/supabase';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  created_at: string;
};

async function getPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  console.log('Fetched posts:', data);
  return data || [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-white max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-600">No blog posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {post.excerpt || 'Click to read more...'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}