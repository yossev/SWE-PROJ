"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

interface Quiz {
  quizId: string; // Unique Quiz ID
  questions: Array<{ 
    questionId: string; // Unique Question ID
    question: string; 
    options: string[] 
  }>;
}

export default function QuizContentPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Extract userId from query params
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const router = useRouter();

  // Fetch the quiz assigned to the user
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:3001/quiz/assigned", {
          params: { userId },
        });

        console.log("API Response:", response.data);

        const quiz = response.data;
        if (quiz && quiz.questions) {
          setQuizData({
            ...quiz,
            quizId: quiz._id, // Ensure quizId is extracted
          });
          setUserAnswers(new Array(quiz.questions.length).fill("")); // Initialize empty answers
        } else {
          setError("No quiz found for this user.");
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError("Error fetching quiz. Please try again.");
      }
    };

    if (userId) {
      fetchQuiz();
    }
  }, [userId]);

  // Handle radio button changes
  const handleOptionChange = (index: number, option: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (!quizData || !userId) {
      console.error("Missing quiz data or userId");
      setError("Cannot submit quiz due to missing data.");
      return;
    }
  
    try {
      // Build answers payload with questionId and userAnswer
      const answers = quizData.questions.map((q, index) => ({
        questionId: q.questionId, // Correct question ID
        answer: userAnswers[index] || "", // User-selected answer
      }));
  
      // Send request to evaluate the quiz
      const response = await axios.post(
        "http://localhost:3001/quiz/evaluate",
        {
          quizId: quizData.quizId, // Pass quizId explicitly
          answers: answers, // Structured answers array
        },
        { params: { userId } } // Send userId in query params
      );
  
      console.log("Evaluation Response:", response.data);
  
      // Extract score and feedback
      const { score, feedback } = response.data.data;
  
      // Redirect to the results page with score and feedback
      router.push(`/quiz/results?score=${score}&feedback=${encodeURIComponent(feedback)}`);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Error submitting quiz. Please try again.");
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Content</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {quizData ? (
        <form onSubmit={(e) => e.preventDefault()}>
          {quizData.questions.map((q, idx) => (
            <div key={q.questionId || idx} className="mb-6">
              <h3 className="text-lg font-medium">
                Q{idx + 1}: {q.question}
              </h3>
              {q.options.map((option) => (
                <label key={option} className="block">
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
