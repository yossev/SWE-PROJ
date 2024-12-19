"use client";
import { useState } from "react";
import axios from "axios";
import { Quiz } from "../../../types/quiz"; // Assuming your Quiz type is stored here

export default function UpdateQuizPage() {
  const [quizId, setQuizId] = useState<string>(""); // For the quiz ID
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false); // Controls pop-up visibility
  const [quizDetails, setQuizDetails] = useState<Quiz | null>(null); // Holds the current quiz details
  const [updatedData, setUpdatedData] = useState<Partial<Quiz>>({
    questionType: "",
    numberOfQuestions: 0,
  });
  const [message, setMessage] = useState<string>("");

  // Show popup for user input
  const handleShowPopup = () => setIsPopupVisible(true);

  // Handle fetching the quiz data by quizId
  const handleFetchQuiz = async () => {
    try {
      if (!quizId) {
        setMessage("Please enter a valid Quiz ID.");
        return;
      }

      const response = await axios.get("http://localhost:3001/quiz/singlequiz", {
        params: { id: quizId },
      });

      setQuizDetails(response.data as Quiz); // Store fetched quiz details
      setUpdatedData({
        questionType: response.data.questionType || "",
        numberOfQuestions: response.data.numberOfQuestions || 0,
      });
      setIsPopupVisible(false); // Hide popup
      setMessage("");
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
      setMessage("Error fetching quiz. Please check the Quiz ID.");
    }
  };

  // Handle form input changes for updated data
  const handleInputChange = (field: keyof Quiz, value: any) => {
    setUpdatedData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle updating the quiz
  const handleUpdateQuiz = async () => {
    try {
      const payload = {
        questionType: updatedData.questionType || quizDetails?.questionType,
        numberOfQuestions:
          updatedData.numberOfQuestions || quizDetails?.numberOfQuestions,
      };

      const response = await axios.put(
        `http://localhost:3001/quiz/updatequiz?id=${quizId}`,
        payload
      );

      setQuizDetails(response.data as Quiz); // Update displayed quiz details
      setMessage("Quiz updated successfully!");
    } catch (error) {
      console.error("Failed to update quiz:", error);
      setMessage("Error updating quiz. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Update Quiz</h1>

      {/* Pop-up for entering quiz ID */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg mb-4">Enter Quiz ID</h2>
            <input
              type="text"
              placeholder="Quiz ID"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              className="border p-2 w-full text-black"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleFetchQuiz}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Fetch Quiz
              </button>
              <button
                onClick={() => setIsPopupVisible(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show button to update quiz */}
      <button
        onClick={handleShowPopup}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 mb-4"
      >
        Enter Quiz ID to Update
      </button>

      {/* Display quiz details */}
      {quizDetails && (
        <div className="border p-4 mb-4">
          <h2 className="text-xl font-bold">Quiz Details</h2>
          <p>
            <strong>Quiz ID:</strong> {quizDetails._id}
          </p>
          <p>
            <strong>Module ID:</strong> {quizDetails.module_id}
          </p>
          <p>
            <strong>Question Type:</strong> {quizDetails.questionType}
          </p>
          <p>
            <strong>Number of Questions:</strong> {quizDetails.numberOfQuestions}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(quizDetails.created_at).toLocaleString()}
          </p>
          <p>
            <strong>User ID:</strong> {quizDetails.userId}
          </p>
          <p>
            <strong>Questions:</strong>
          </p>
          <ul className="list-disc pl-4">
            {quizDetails.questions.map((question, index) => (
              <li key={index}>
                <p>
                  <strong>Q{index + 1}:</strong> {question.question}
                </p>
                <p>
                  <strong>Options:</strong> {question.options.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Update form */}
      {quizDetails && (
        <div>
          <h2 className="text-lg font-bold mb-2">Update Quiz Details</h2>

          {/* Dropdown for Question Type */}
          <label className="block mb-2 font-medium">Question Type:</label>
          <select
            onChange={(e) => handleInputChange("questionType", e.target.value)}
            value={updatedData.questionType || ""}
            className="border p-2 w-full mb-4 text-black"
          >
            <option value="">Select Question Type</option>
            <option value="MCQ">MCQ</option>
            <option value="True/False">True/False</option>
            <option value="Both">Both</option>
          </select>

          {/* Number of Questions Input */}
          <label className="block mb-2 font-medium">Number of Questions:</label>
          <input
            type="number"
            placeholder="Number of Questions"
            value={updatedData.numberOfQuestions || ""}
            onChange={(e) =>
              handleInputChange("numberOfQuestions", Number(e.target.value))
            }
            className="border p-2 w-full mb-4 text-black"
          />

          {/* Update Button */}
          <button
            onClick={handleUpdateQuiz}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          >
            Update Quiz
          </button>
        </div>
      )}

      {/* Success or error message */}
      {message && <p className="mt-4 text-lg font-medium">{message}</p>}
    </div>
  );
}

