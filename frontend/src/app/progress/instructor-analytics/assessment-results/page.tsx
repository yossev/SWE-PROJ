"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AssessmentResultsPage() {
  const { courseId } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/progress/assessment-results/${courseId}`
        );
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to fetch Assessment Results data.");
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Assessment Results</h1>
      {error && <p className="text-red-500">{error}</p>}

      {data ? (
        <div>
          <p>Course Name: {data.courseName}</p>
          <h2 className="font-semibold mb-2">Quiz Results</h2>
          <ul>
            {data.results.map((quiz: any) => (
              <li key={quiz.quizId}>
                Quiz ID: {quiz.quizId}, Average Score: {quiz.averageScore}, Participants:{" "}
                {quiz.numParticipants}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
