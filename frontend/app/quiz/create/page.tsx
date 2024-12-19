"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateQuizPage() {
  const [formData, setFormData] = useState({
    moduleId: "",
    questionType: "MCQ",
    number: 0, 
    userId: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "number" ? parseInt(value, 10) || 0 : value, 
    });
  };

  const handleSubmit = async () => {
    if (!formData.moduleId || !formData.number || !formData.questionType) {
      setErrorMessage("All fields are required. Please check your input.");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        moduleId: formData.moduleId.trim(),
        questionType: formData.questionType,
        number: formData.number,
        userId: formData.userId.trim(),
      };

      const response = await axios.post(
        "http://localhost:3001/quiz/generateQuiz",
        payload,
        { params: { userId: payload.userId } }
      );

      setSuccessMessage("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error);
      setErrorMessage("Failed to create quiz. Please check the input fields.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <main className="max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Create a Quiz</h1>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span>Module ID:</span>
            <input
              type="text"
              name="moduleId"
              value={formData.moduleId}
              onChange={handleInputChange}
              className="p-3 border border-gray-700 rounded text-black"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Question Type:</span>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleInputChange}
              className="p-3 border border-gray-700 rounded text-black"
            >
              <option value="MCQ">MCQ</option>
              <option value="TrueFalse">True/False</option>
              <option value="Both">Both</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span>Number of Questions:</span>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              className="p-3 border border-gray-700 rounded text-black"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>User ID:</span>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="p-3 border border-gray-700 rounded text-black"
            />
          </label>

          <button
            onClick={handleSubmit}
            className="mt-4 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg hover:scale-105 transition-transform duration-200 text-lg h-12 px-6"
          >
            Create Quiz
          </button>

          {successMessage && <p className="text-green-400 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-400 mt-4">{errorMessage}</p>}
        </div>
      </main>
    </div>
  );
}
