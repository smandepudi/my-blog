export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog</h1>
      
      <div className="space-y-6">
        {/* Blog Post 1 */}
        <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Getting Started with Next.js
          </h2>
          <p className="text-gray-600 mb-4">
            Learn how to build modern web applications with Next.js, React, and TypeScript.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">January 7, 2026</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Read More →
            </button>
          </div>
        </article>

        {/* Blog Post 2 */}
        <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Mastering Tailwind CSS
          </h2>
          <p className="text-gray-600 mb-4">
            Discover how to style your applications efficiently using Tailwind's utility-first approach.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">January 6, 2026</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Read More →
            </button>
          </div>
        </article>

        {/* Blog Post 3 */}
        <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Building Full-Stack Applications
          </h2>
          <p className="text-gray-600 mb-4">
            A comprehensive guide to creating full-stack apps with Node.js and PostgreSQL.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">January 5, 2026</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Read More →
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}