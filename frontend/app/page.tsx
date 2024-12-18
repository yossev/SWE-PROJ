"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [showFindById, setShowFindById] = useState(false); // Toggle Find by ID input
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Quiz App Header */}
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Welcome to the Quiz App!
        </h1>
        <p className="text-gray-600 text-sm text-center sm:text-left">
          Test your knowledge with interactive quizzes.
        </p>

        {/* Quiz Actions */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Start a Quiz */}
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/quiz/start"
          >
            Start a Quiz
          </a>

          {/* View Quiz History */}
          <a
            className="rounded-full border border-solid border-blue-600 text-blue-600 transition-colors flex items-center justify-center hover:bg-blue-600 hover:text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/quiz/history"
          >
            View Quiz History
          </a>

          {/* Update Quiz */}
          <a
            className="rounded-full border border-solid border-yellow-500 text-yellow-500 transition-colors flex items-center justify-center hover:bg-yellow-500 hover:text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/quiz/update"
          >
            Update Quiz
          </a>

          {/* Find All Question Banks */}
          <button
            className="rounded-full border border-solid border-green-500 text-green-500 transition-colors flex items-center justify-center hover:bg-green-500 hover:text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            onClick={() => setShowFindById(true)}
          >
            Find All Question Banks
          </button>
        </div>

        {/* Find by ID Section */}
        {showFindById && (
          <div className="mt-8 w-full max-w-md flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-black">Find by ID</h2>
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
            {loading && <p className="text-gray-500">Loading...</p>}

            {/* Error */}
            {error && <p className="text-red-500">{error}</p>}

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
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/quiz/about"
        >
          About Quizzes
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/quiz/rules"
        >
          Rules & Guidelines
        </a>
      </footer>
    </div>
  );
}
