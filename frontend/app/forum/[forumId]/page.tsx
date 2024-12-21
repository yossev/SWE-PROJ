"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Thread = {
  id: string;
  title: string;
  creator: string;
  time: string;
  replies: number;
};

export default function ForumPage() {
  const { forumId } = useParams();
  const [search, setSearch] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchResult, setSearchResult] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (forumId) {
      fetch(`/api/forums/${forumId}/threads`)
        .then((res) => res.json())
        .then((data) => setThreads(data))
        .catch((err) => console.error("Error fetching threads:", err));
    }
  }, [forumId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchResult(null);
    setError("");
  };

  const searchByTitle = () => {
    setLoading(true);
    setError("");
    const result = threads.find((thread) =>
      thread.title.toLowerCase().includes(search.toLowerCase())
    );
    setLoading(false);
    if (result) {
      setSearchResult(result);
    } else {
      setError("No threads found matching the title.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-700 text-2xl font-bold">
          Forum Navigation
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => {}}
                className="block w-full text-left py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                📄 All Threads
              </button>
            </li>
            <li>
              <button
                onClick={() => {}}
                className="block py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                ➕ Create New Thread
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Forum: {forumId}</h1>
          <p className="text-gray-600">
            Browse threads or search for specific discussions below.
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Threads</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition-all duration-300"
              placeholder="Search threads by title"
              value={search}
              onChange={handleSearch}
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
              onClick={searchByTitle}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {searchResult && (
            <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">Search Result:</h3>
              <p className="text-gray-700">Title: {searchResult.title}</p>
              <p className="text-gray-700">Creator: {searchResult.creator}</p>
              <p className="text-gray-700">Replies: {searchResult.replies}</p>
            </div>
          )}
        </section>

        {/* Threads Section */}
        <section className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Threads</h2>
          <ul>
            {threads.map((thread) => (
              <li
                key={thread.id}
                className="border-b last:border-none pb-4 mb-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-bold text-blue-800 hover:underline">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created by: {thread.creator} • {thread.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{thread.replies}</span> replies
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
