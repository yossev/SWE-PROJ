"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; 
import axios from "axios";
import { useRouter } from "next/navigation"; 
interface Quiz {
  questions: Array<{ question: string; options: string[] }>;
}

export default function QuizContentPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); 
  console.log("User ID:", userId);

  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<{ score: number; feedback: string } | null>(null); 

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:3001/quiz/assigned", {
          params: { userId },
        });

        console.log("API Response:", response.data);

        const quiz = response.data; 
        console.log("Extracted Quiz Data:", quiz);

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
      fetchQuiz();
    }
  }, [userId]);

  const handleOptionChange = (index: number, option: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = option;
    setUserAnswers(updatedAnswers);
  };

const router = useRouter();

const handleSubmit = async () => {
  if (!quizData || !userId) {
    console.error("Missing required data: quizData or userId");
    setError("Cannot submit quiz due to missing data.");
    return;
  }

  try {
    
    const response = await axios.post(
      "http://localhost:3001/quiz/evaluate",
      {
        userAnswers, 
        selectedQuestions: quizData.questions,
      },
      { params: { userId } } 
    );

    console.log("Evaluation Response:", response.data);

    
    const { score, feedback } = response.data.data;

   
    router.push(`/quiz/results?score=${score}&feedback=${encodeURIComponent(feedback)}`);
  } catch (err) {
    console.error("Failed to evaluate quiz:", err);
    setError("Error submitting the quiz. Please try again.");
  }
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
        error && <p>{error}</p>
      )}

      {}
      {quizResults && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Your Results</h2>
          <p className="text-lg">
            <strong>Score:</strong> {quizResults.score}%
          </p>
          <p className="text-lg">
            <strong>Feedback:</strong> {quizResults.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
