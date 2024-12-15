"use client";
import { useRouter } from "next/navigation"; // For navigation
import { useParams } from "next/navigation"; // Get dynamic params

export default function StartQuizPage() {
  const router = useRouter();
  const { quizid } = useParams(); 
  const handleStartQuiz = () => {
    router.push(`/quiz/${quizid}/content`); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Welcome to the Quiz</h1>
      <button
        onClick={handleStartQuiz}
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Quiz
      </button>
    </div>
  );
}
