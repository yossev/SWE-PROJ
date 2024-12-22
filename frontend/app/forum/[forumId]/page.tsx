"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

type Reply = {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
};

type Thread = {
  id: string;
  threadTitle: string;
  content: string;
  createdBy: string;
  createdAt: string;
  replies: Reply[]; // Include replies
};

type Forum = {
  id: string;
  forumTitle: string;
};

const backend_url = "http://localhost:3001";

export default function ForumPage() {
  const { forumId } = useParams();
  const [forum, setForum] = useState<Forum | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForumData = async () => {
      if (forumId) {
        try {
          // Fetch forum details
          const forumRes = await axios.get(`${backend_url}/forums/getForum/${forumId}`, {
            withCredentials: true,
          });
          setForum({
            id: forumRes.data._id,
            forumTitle: forumRes.data.forumTitle,
          });

          // Fetch threads for the forum
          const threadsRes = await axios.get(`${backend_url}/threads/by-forum/${forumId}`, {
            withCredentials: true,
          });

          const threadsWithReplies = await Promise.all(
            threadsRes.data.map(async (thread: Thread) => {
              try {
                const repliesRes = await axios.get(
                  `${backend_url}/threads/getReplies?id=${thread.id}`,
                  { withCredentials: true }
                );
                return { ...thread, replies: repliesRes.data };
              } catch (err) {
                console.error(`Error fetching replies for thread ${thread.id}:`, err);
                return { ...thread, replies: [] }; // Set empty replies if fetching fails
              }
            })
          );

          setThreads(threadsWithReplies);
        } catch (err) {
          console.error("Error fetching forum or threads:", err);
          setError("Failed to load forum or threads data");
        }
      }
    };

    fetchForumData();
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
      thread.threadTitle.toLowerCase().includes(search.toLowerCase())
    );

    setLoading(false);
    if (result) {
      setSearchResult(result);
    } else {
      setError("No threads found matching the title.");
    }
  };

  if (!forum) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">{error || "Loading forum..."}</p>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Forum: {forum.forumTitle}</h1>
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
              <p className="text-gray-700">Title: {searchResult.threadTitle}</p>
              <p className="text-gray-700">Creator: {searchResult.createdBy}</p>
              <p className="text-gray-700">Content: {searchResult.content}</p>
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
                className="border-b last:border-none pb-4 mb-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-blue-800 hover:underline">
                    {thread.threadTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created by: {thread.createdBy} •{" "}
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-800">{thread.content}</p>
                </div>
                <ul className="mt-4 pl-4 border-l-2 border-gray-300">
                  {thread.replies.map((reply) => (
                    <li key={reply.id} className="mb-2">
                      <p className="text-sm text-gray-600">
                        {reply.createdBy} •{" "}
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </p>
                      <p>{reply.content}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
