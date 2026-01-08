export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Me</h1>
      
      <div className="space-y-6">
        <section className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            👋 Hello, I'm [Your Name]
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            I'm a full-stack developer passionate about building modern web applications
            with cutting-edge technologies. I specialize in React, TypeScript, Node.js,
            and cloud deployment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Currently, I'm focused on creating AI-powered applications and learning
            new technologies to solve real-world problems.
          </p>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            🛠️ Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
              <p className="font-medium text-blue-700">React</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
              <p className="font-medium text-blue-700">TypeScript</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
              <p className="font-medium text-blue-700">Next.js</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
              <p className="font-medium text-blue-700">Node.js</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
              <p className="font-medium text-blue-700">TailwindCSS</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
              <p className="font-medium text-blue-700">PostgreSQL</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            📫 Get In Touch
          </h2>
          <p className="text-gray-700">
            Feel free to reach out at{' '}
            <a 
              href="mailto:your.email@example.com" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              your.email@example.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}