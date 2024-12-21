"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:3001"; // Replace with your backend URL

const ForumPage = ({ params }: { params: { forumId: string } }) => {
  const { forumId } = params;
  const [threads, setThreads] = useState<any[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get(`${backendUrl}/forums/getThreads`, {
        params: { id: forumId },
      });
      setThreads(response.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching threads:", err.message);
      } else {
        console.error("Unknown error occurred while fetching threads:", err);
      }
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle) return; // Avoid empty thread titles

    try {
      const response = await axios.post(
        `${backendUrl}/threads/create`,
        {
          title: newThreadTitle,
          forum_id: forumId,
        },
        { withCredentials: true }
      );
      setNewThreadTitle(""); // Clear input
      fetchThreads(); // Refresh threads
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating thread:", err.message);
      } else {
        console.error("Unknown error occurred while creating thread:", err);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Forum</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          placeholder="Create a new thread"
          className="border border-gray-300 rounded-md p-2 w-full"
        />
        <button
          onClick={handleCreateThread}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Create Thread
        </button>
      </div>
      <div>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div
              key={thread._id}
              className="border border-gray-300 rounded-md p-4 mb-2"
            >
              <h2 className="text-xl font-semibold">{thread.title}</h2>
              <p className="text-gray-600">Created at: {thread.createdAt}</p>
            </div>
          ))
        ) : (
          <p>No threads found.</p>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
