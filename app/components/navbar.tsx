import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            The Curious Stack
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}