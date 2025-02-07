import React, { useState, useEffect } from "react";
import { useSurvey } from "../context/SurveyContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Question } from "../types";
import { questions } from "../lib/Questions";
import { IoExitOutline } from "react-icons/io5";

export const Survey: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { answers, setAnswer, submitSurvey } = useSurvey();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const answeredQuestions = answers.length;
    const totalQuestions = questions.length;
    const newProgress = (answeredQuestions / totalQuestions) * 100;
    setProgress(newProgress);
  }, [answers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await submitSurvey();
      navigate("/submitted");
    } catch (error: any) {
      if (error.message.includes("already submitted")) {
        setError(
          "You have already submitted a survey. Multiple submissions are not allowed."
        );
      } else {
        setError(
          "An error occurred while submitting the survey. Please try again."
        );
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "rating":
        return (
          <div className="space-y-2 font-serif">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">
                {question.labels?.[0]}
              </span>
              <span className="text-sm text-gray-500">
                {question.labels?.[1]}
              </span>
            </div>
            <div className="flex justify-between gap-1">
              {question.options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswer(question.id, option)}
                  className={`w-28 h-12 rounded border ${
                    answers.find((a) => a.questionId === question.id)
                      ?.answer === option
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "single":
        return (
          <div className="space-y-2 font-serif font-thin">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded font-serif"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  onChange={(e) => setAnswer(question.id, e.target.value)}
                  className="mt-1"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "multiple":
        return (
          <div className="grid grid-cols-2 gap-2 font-serif">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="checkbox"
                  value={option}
                  onChange={(e) => {
                    const currentAnswer =
                      (answers.find((a) => a.questionId === question.id)
                        ?.answer as string[]) || [];
                    if (e.target.checked) {
                      setAnswer(question.id, [...currentAnswer, option]);
                    } else {
                      setAnswer(
                        question.id,
                        currentAnswer.filter((a) => a !== option)
                      );
                    }
                  }}
                  className="mt-1"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "text":
        return (
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows={4}
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(question.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="w-2/3 mx-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-500 font-serif">
          Customer Satisfaction Survey
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/view-response")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Responses
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-4xl text-black rounded"
          >
            <IoExitOutline />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <p className="font-medium text-cyan-800 mb-4">
              {question.id}. {question.text}
            </p>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="bg-white p-4 progressBar">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-800"
              >
                Submit Survey
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
