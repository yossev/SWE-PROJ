"use client";
import { useState } from "react";
import axios from "axios";

export default function FindQuestionBankById() {
  const [id, setId] = useState<string>(""); // State to store the input ID
  const [questionBank, setQuestionBank] = useState<any>(null); // State to store the fetched question bank
  const [error, setError] = useState<string>(""); // State to handle errors
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Function to fetch the question bank by ID
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
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Find Question Bank by ID</h1>

      {/* Input Field */}
      <div className="w-full max-w-md flex items-center gap-2 mb-6">
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

      {/* Loading State */}
      {loading && <p className="text-gray-500 text-lg">Loading...</p>}

      {/* Error State */}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {/* Display Question Bank */}
      {questionBank && (
        <div className="w-full max-w-md border rounded-lg shadow-md p-4 bg-gray-100 text-black">
          <h2 className="text-xl font-semibold mb-4">Question Bank Details</h2>
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
  );
}
