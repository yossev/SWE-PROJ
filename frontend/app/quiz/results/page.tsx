"use client";
import { useSearchParams } from "next/navigation";

export default function QuizResultsPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score");
  const feedback = searchParams.get("feedback");

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
      <div className="text-lg">
        <p>
          <strong>Score:</strong> {score}%
        </p>
        <p>
          <strong>Feedback:</strong> {feedback}
        </p>
      </div>
      <a
        href="/quiz/start"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Take Another Quiz
      </a>
    </div>
  );
}
