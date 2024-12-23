"use client";

import { useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";

export default function CreateQuizPage() {
  const path = usePathname().split('/');
  
    const getInstructorData = async () => {
      const instructorId = path[path.length - 1];
      const res = await fetch('http://localhost:3001/users/fetch/' + instructorId, { credentials: 'include' });
      return res.json();
    };
    
  const [formData, setFormData] = useState({
    moduleId: "",
    questionType: "MCQ",
    numberOfQuestions: 0, // Corrected key
    userId: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const role = getCookie("role");
  console.log("Role fetched: " + role);

  const userid = getCookie("userId");
  console.log("User ID: " + userid);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "numberOfQuestions" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.moduleId || !formData.numberOfQuestions || !formData.questionType) {
      setErrorMessage("All fields are required. Please check your input.");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        moduleId: formData.moduleId.trim(),
        questionType: formData.questionType,
        numberOfQuestions: formData.numberOfQuestions, // Corrected key
        userId: userid,
      };

      const response = await axios.post(
        "http://localhost:3001/quiz/generateQuiz",
        payload,
        { withCredentials: true }
      );

      console.log("Quiz Created Successfully:", response.data);
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
              placeholder="Enter Module ID"
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
              <option value="True/False">True/False</option>
              <option value="Both">Both</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span>Number of Questions:</span>
            <input
              type="number"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleInputChange}
              className="p-3 border border-gray-700 rounded text-black"
              placeholder="Enter Number of Questions"
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
              placeholder="Enter User ID"
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
