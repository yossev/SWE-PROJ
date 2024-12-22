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
  
      console.log("Deleting quiz with ID:", quizId); // Check if the correct quizId is printed
  
      // Fetch Quiz details to check if there are any responses
      const response = await axios.get("http://localhost:3001/quiz/singlequiz", {
        params: { id: quizId },
      });
  
      if (response.data.responses && response.data.responses.length > 0) {
        setMessage("This quiz has already been taken by students and cannot be deleted.");
        return;
      }
  
      // Send DELETE request to backend if no responses exist
      const deleteResponse = await axios.delete(
        `http://localhost:3001/quiz/deletequiz?id=${quizId}`
      );
  
      setMessage("Quiz deleted successfully!");
      setQuizId(""); // Clear input box
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
  
      // Simplified error handling
      setMessage("This quiz has already been taken by a student and cannot be deleted.");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-8">
      <h1 className="text-3xl font-extrabold mb-8">Delete Quiz</h1>

      {/* Input Box for Quiz ID */}
      <div className="mb-6 w-full max-w-sm">
        <label htmlFor="quizId" className="block mb-2 font-medium text-lg">
          Enter Quiz ID to Delete:
        </label>
        <input
          id="quizId"
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="border p-3 w-full rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteQuiz}
        className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300"
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
