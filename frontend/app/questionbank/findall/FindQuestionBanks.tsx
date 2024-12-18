"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FindQuestionBanks() {
  const [questionBanks, setQuestionBanks] = useState<any[]>([]); // To store all QuestionBanks
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(""); // Error state

  // Fetch all QuestionBanks on component load
  const fetchAllQuestionBanks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3001/questionbank/allquestionbanks"
      );
      setQuestionBanks(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching Question Banks:", err);
      setError("Failed to fetch Question Banks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuestionBanks();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-black">All Question Banks</h1>

      {/* Loading and Error States */}
      {loading && <p className="text-gray-500 text-lg">Loading...</p>}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {/* Scrollable List */}
      <div className="w-full max-w-4xl h-[70vh] overflow-y-auto border rounded-lg shadow-md p-4 bg-gray-100">
        {questionBanks.length > 0 ? (
          questionBanks.map((qb) => (
            <div
              key={qb._id}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b pb-4 mb-4 last:border-none"
            >
              {/* Details */}
              <div className="text-black text-sm">
                <p>
                  <strong>ID:</strong> {qb._id}
                </p>
                <p className="truncate">
                  <strong>Question:</strong> {qb.question}
                </p>
                <p>
                  <strong>Difficulty:</strong> {qb.difficulty_level}
                </p>
                <p>
                  <strong>Type:</strong> {qb.question_type}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No Question Banks found.</p>
        )}
      </div>
    </div>
  );
}
