"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // To get query parameters
import axios from "axios";

interface Quiz {
  questions: Array<{ question: string; options: string[] }>;
}

export default function QuizContentPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Extract userId from query params
  console.log("User ID:", userId);

  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Updated API endpoint to fetch quiz by userId
        const response = await axios.get("http://localhost:3001/quiz/assigned", {
          params: { userId }, // Pass userId as a query parameter
        });

        console.log("API Response:", response.data); // Log the API response for debugging
        
        const quiz = response.data; // Assign the correct structure of API response
        console.log("Extracted Quiz Data:", quiz);

        // Ensure quiz data is valid and has questions
        if (quiz && quiz.questions) {
          setQuizData(quiz);
          setUserAnswers(new Array(quiz.questions.length).fill(""));
        } else {
          setError("No quiz found for this user.");
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError("Error fetching quiz. Please check the user ID or try again.");
      }
    };

    if (userId) {
      fetchQuiz(); // Fetch the quiz when userId is available
    }
  }, [userId]);

  const handleOptionChange = (index: number, option: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    console.log("User Answers:", userAnswers);
    alert("Quiz Submitted Successfully!");
  };

  return (
    <div className="p-4">
      <h1>Quiz Content</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {quizData ? (
        <form onSubmit={(e) => e.preventDefault()}>
          {quizData.questions.map((q, idx) => (
            <div key={idx} className="mb-4">
              <h3>
                Q{idx + 1}: {q.question}
              </h3>
              {q.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={option}
                    checked={userAnswers[idx] === option}
                    onChange={() => handleOptionChange(idx, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit Quiz
          </button>
        </form>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
}
