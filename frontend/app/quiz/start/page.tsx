"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function StartQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Extract userId from query params

  const handleStartQuiz = () => {
    if (userId) {
      router.push(`/quiz/content?userId=${userId}`); // Pass userId in the URL
    } else {
      alert("User ID is missing!");
      console.error("User ID is missing");
    }
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
