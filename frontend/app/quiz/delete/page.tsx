"use client";
import { useState } from "react";
import axios from "axios";

export default function DeleteQuizPage() {
  const [quizId, setQuizId] = useState<string>(""); // Stores the Quiz ID
  const [message, setMessage] = useState<string>(""); // Notification message

  // Handle Deletion of Quiz
  const handleDeleteQuiz = async () => {
    try {
      if (!quizId) {
        setMessage("Please enter a valid Quiz ID.");
        return;
      }

      // Send DELETE request to backend
      const response = await axios.delete(`http://localhost:3001/quiz/deletequiz?id=${quizId}`);

      // Notify the user of success
      setMessage("Quiz deleted successfully!");
      setQuizId(""); // Clear input box
    } catch (error) {
      console.error("Error deleting quiz:", error);
      setMessage("Failed to delete quiz. Please try again.");
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Delete Quiz</h1>

      {/* Input Box for Quiz ID */}
      <div className="mb-4 w-full max-w-md">
        <label htmlFor="quizId" className="block mb-2 font-medium">
          Enter Quiz ID to Delete:
        </label>
        <input
          id="quizId"
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="border p-2 w-full rounded text-black"
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteQuiz}
        className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
      >
        Delete Quiz
      </button>

      {/* Notification for Success or Error */}
      {message && (
        <p
          className={`mt-4 text-lg font-medium ${
            message.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
