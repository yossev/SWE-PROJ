"use client";

import React, { useState } from "react";

export default function QuizStart() {
  const [userId, setUserId] = useState<string>(""); // User ID input
  const [quizData, setQuizData] = useState<any>(null); // Quiz data from backend
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // User answers
  const [step, setStep] = useState<"start" | "quiz" | "results">("start"); // Workflow step
  const [score, setScore] = useState<number | null>(null); // Quiz score
  const [feedback, setFeedback] = useState<string | null>(null); // Feedback message
  const [error, setError] = useState<string | null>(null); // Error message

  const fetchQuiz = async () => {
    if (!userId.trim()) {
      setError("Please enter a valid User ID.");
      return;
    }
  
    try {
      setError(null);
      const response = await fetch(`http://localhost:3001/quiz/assigned?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quiz.");
      }
  
      const quiz = await response.json();
  
      // Transform questions to include questionId if missing
      const transformedQuiz = {
        ...quiz,
        questions: quiz.questions.map((q: any) => ({
          questionId: q.questionId,
          question: q.question,
          options: q.options,
        })),
      };
  
      // Store questionIds and pass them to evaluate
      setQuizData(transformedQuiz);
      setUserAnswers(new Array(transformedQuiz.questions.length).fill("")); // Initialize answers
      setStep("quiz");
    } catch (err) {
      console.error(err);
      setError("Error fetching quiz. Please try again.");
    }
  };
  
  // Handle answer selection
  const handleAnswerChange = (index: number, answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const submitQuiz = async () => {
    if (userAnswers.includes("")) {
      setError("Please answer all questions before submitting.");
      return;
    }
  
    try {
      setError(null);
  
      // Prepare the payload with questionIds and user answers
      const payload = {
        quizId: quizData.quizId,
        userAnswers,
        selectedQuestions: quizData.questions.map((q: any) => ({
          questionId: q.questionId, // Send correct questionId from the quiz data
        })),
        userId,
      };
  
      const response = await fetch(`http://localhost:3001/quiz/evaluate?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to evaluate quiz.");
      }
  
      const result = await response.json();
      setScore(result.data.score);
      setFeedback(result.data.feedback);
      setStep("results");
    } catch (err) {
      console.error(err);
      setError("Error submitting quiz. Please try again.");
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {step === "start" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Start Your Quiz</h1>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Your User ID"
            className="mb-4 px-4 py-2 rounded-md text-black"
          />
          <button
            onClick={fetchQuiz}
            className="px-6 py-2 bg-green-600 rounded-md hover:bg-green-500"
          >
            Start Quiz
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {step === "quiz" && quizData && (
        <div className="max-w-2xl w-full p-6 bg-white rounded-md shadow-lg text-black">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Quiz</h1>
          {quizData.questions.map((question: any, index: number) => (
            <div key={question.questionId} className="mb-6">
              <p className="font-semibold mb-2">{`Q${index + 1}: ${question.question}`}</p>
              {question.options.map((option: string, i: number) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={submitQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Submit Quiz
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {step === "results" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Quiz Results</h1>
          {score !== null && feedback ? (
            <>
              <p className="text-xl mb-4">Your Score: {score}%</p>
              <p className="text-lg">{feedback}</p>
            </>
          ) : (
            <p>Loading results...</p>
          )}
        </div>
      )}
    </div>
  );
}
