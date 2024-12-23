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
  _id: string;
  threadTitle: string;
  content: string;
  createdBy: string;
  createdAt: string;
  replies: Reply[];
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
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [newReply, setNewReply] = useState({ threadId: "", content: "" });

  useEffect(() => {
    const fetchForumData = async () => {
      if (forumId) {
        try {
          const forumRes = await axios.get(`${backend_url}/forums/getForum/${forumId}`, {
            withCredentials: true,
          });
          setForum({
            id: forumRes.data._id,
            forumTitle: forumRes.data.forumTitle,
          });

          const threadsRes = await axios.get(`${backend_url}/threads/by-forum/${forumId}`, {
            withCredentials: true,
          });
          console.log("threadsRes", threadsRes);
          console.log("threadsRes.data", threadsRes.data);
          const threadsWithReplies = await Promise.all(
            threadsRes.data.map(async (thread: Thread) => {
              try {
                console.log("thread",thread);
                const repliesRes = await axios.get(
                  `${backend_url}/threads/getReplies?id=${thread._id}`,
                  { withCredentials: true }
                );
                return { ...thread, replies: repliesRes.data };
              } catch (err) {
                console.error(`Error fetching replies for thread ${thread._id}:`, err);
                return { ...thread, replies: [] };
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

  const handleCreateThread = async () => {
    if (!newThread.title || !newThread.content) {
      setError("Thread title and content are required.");
      return;
    }

    try {
      const res = await axios.post(
        `${backend_url}/threads/create`,
        {
          forum_id:forumId,
          threadTitle: newThread.title,
          content: newThread.content,
        },
        { withCredentials: true }
      );

      setThreads([...threads, res.data]);
      setNewThread({ title: "", content: "" });
    } catch (err) {
      console.error("Error creating thread:", err);
      setError("Failed to create thread.");
    }
  };

  const handleReply = async (threadId: string) => {
    if (!newReply.content) {
      setError("Reply content is required.");
      return;
    }

    try {
      const res = await axios.post(
        `${backend_url}/Reply/create`,
        { threadId, content: newReply.content },
        { withCredentials: true }
      );

      const updatedThreads = threads.map((thread) =>
        thread._id === threadId ? { ...thread, replies: [...thread.replies, res.data] } : thread
      );

      setThreads(updatedThreads);
      setNewReply({ threadId: "", content: "" });
    } catch (err) {
      console.error("Error adding reply:", err);
      setError("Failed to add reply.");
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
      <aside className="w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-700 text-2xl font-bold">
          Forum Navigation
        </div>
        <nav className="mt-6">
          <ul className="space-y-4">
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

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Forum: {forum.forumTitle}</h1>
          <p className="text-gray-600">Browse threads or search for specific discussions below.</p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Thread</h2>
          <input
            type="text"
            placeholder="Thread Title"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            value={newThread.title}
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
          />
          <textarea
            placeholder="Thread Content"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            rows={4}
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
          />
          <button
            onClick={handleCreateThread}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Create Thread
          </button>
        </section>

        <section className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Threads</h2>
          <ul>
            {threads.map((thread) => (
              <li key={thread._id} className="border-b last:border-none pb-4 mb-4">
                thread id:{thread._id}
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
                  {(thread.replies || []).map((reply) => (
                    <li key={reply.id} className="mb-2">
                      <p className="text-sm text-gray-600">
                        {reply.createdBy} •{" "}
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </p>
                      <p>{reply.content}</p>
                    </li>
                  ))}
                </ul>
                <textarea
                  placeholder="Write a reply..."
                  className="w-full px-4 py-2 border rounded-lg mt-4"
                  value={newReply.threadId === thread._id ? newReply.content : ""}
                  onChange={(e) =>
                    setNewReply({ threadId: thread._id, content: e.target.value })
                  }
                />
                <button
                  onClick={() => handleReply(thread._id)}
                  className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                >
                  Reply
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
