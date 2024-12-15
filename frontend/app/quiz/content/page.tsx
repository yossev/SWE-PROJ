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

  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:3001/quiz/generateQuiz", {
          params: { userId }, // Pass userId as a query parameter
        });
        setQuizData(response.data.data); // Adjust based on backend response structure
        setUserAnswers(new Array(response.data.data.questions.length).fill(""));
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError("Error fetching quiz.");
      }
    };

    if (userId) {
      fetchQuiz(); // Fetch only when userId exists
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
