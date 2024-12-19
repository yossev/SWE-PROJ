"use client";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <main className="text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to the App!</h1>
        <p className="text-gray-400 text-xl mb-6">
          Choose a module to manage or participate in.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg hover:scale-105 transition-transform duration-200 text-lg h-14 px-8 flex items-center justify-center"
            href="/questionbank"
          >
            Manage Question Bank
          </a>
          <a
            className="rounded-lg bg-gradient-to-r from-green-600 to-green-400 text-white shadow-lg hover:scale-105 transition-transform duration-200 text-lg h-14 px-8 flex items-center justify-center"
            href="/quiz"
          >
            Go to Quiz
          </a>
        </div>
      </main>
    </div>
  );
}
