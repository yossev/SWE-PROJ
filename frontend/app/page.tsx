"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [showFindById, setShowFindById] = useState(false);
  const [id, setId] = useState<string>(""); // Input ID
  const [questionBank, setQuestionBank] = useState<any>(null); // Fetched question bank
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error state

  // Function to fetch question bank by ID
  const fetchQuestionBankById = async () => {
    if (!id) {
      setError("Please enter a valid ID.");
      return;
    }
    setLoading(true);
    setError("");
    setQuestionBank(null);

    try {
      const response = await axios.get(
        `http://localhost:3001/questionbank/questionbank?id=${id}`
      );
      setQuestionBank(response.data);
    } catch (err) {
      console.error("Error fetching Question Bank by ID:", err);
      setError("No Question Bank found for the provided ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Quiz App Header */}
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to the Quiz App!
        </h1>
        <p className="text-gray-400 text-lg text-center sm:text-left">
          Test your knowledge with interactive quizzes.
        </p>

        {/* Buttons Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center mt-8">
          {/* First Row */}
          <a
            className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/quiz/start"
          >
            Start a Quiz
          </a>

          <a
            className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/quiz/history"
          >
            View Quiz History
          </a>

          <a
            className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/quiz/update"
          >
            Update Quiz
          </a>

          <button
            className="rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            onClick={() => setShowFindById(true)}
          >
            Find a Question
          </button>

          {/* Second Row */}
          <a
            className="rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/questionbank/delete"
          >
            Delete a Question
          </a>

          <a
            className="rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/questionbank/findall"
          >
            Find All Questions
          </a>

          <a
            className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/questionbank/update"
          >
            Update a Question
          </a>

          <a
            className="rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg hover:scale-105 hover:brightness-110 transition-transform duration-200 ease-in-out text-base h-12 px-6 flex items-center justify-center"
            href="/questionbank/create"
          >
            Create a Question
          </a>
        </div>

        {/* Find by ID Section */}
        {showFindById && (
          <div className="mt-8 w-full max-w-md flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Find by ID</h2>
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Question Bank ID"
                className="border p-2 w-full rounded text-black"
              />
              <button
                onClick={fetchQuestionBankById}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>

            {/* Loading */}
            {loading && <p className="text-gray-400">Loading...</p>}

            {/* Error */}
            {error && <p className="text-red-400">{error}</p>}

            {/* Display Question Bank */}
            {questionBank && (
              <div className="w-full border rounded-lg shadow-md p-4 bg-gray-100 text-black">
                <h3 className="text-xl font-semibold">Question Bank Details</h3>
                <p>
                  <strong>ID:</strong> {questionBank._id}
                </p>
                <p>
                  <strong>Question:</strong> {questionBank.question}
                </p>
                <p>
                  <strong>Difficulty:</strong> {questionBank.difficulty_level}
                </p>
                <p>
                  <strong>Type:</strong> {questionBank.question_type}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="text-gray-400 hover:underline hover:underline-offset-4"
          href="/quiz/about"
        >
          About Quizzes
        </a>
        <a
          className="text-gray-400 hover:underline hover:underline-offset-4"
          href="/quiz/rules"
        >
          Rules & Guidelines
        </a>
      </footer>
    </div>
  );
}
