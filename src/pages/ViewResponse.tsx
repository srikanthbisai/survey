import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questions } from '../lib/Questions';
import { IoExitOutline } from "react-icons/io5";

interface SurveyResponse {
  questionId: number;
  answer: string[];
}

export const ViewResponse: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedResponses, setEditedResponses] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      fetchResponses();
    }
  }, [user]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchResponses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/get-responses/${user?.email}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const formattedAnswers = data.answers.map((answer: SurveyResponse) => ({
          questionId: answer.questionId,
          answer: Array.isArray(answer.answer) ? answer.answer : [answer.answer]
        }));
        setResponses(formattedAnswers);
        setEditedResponses(formattedAnswers);
      } else {
        throw new Error(data.error || 'No responses found');
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      setError('Failed to load responses. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedResponses([...responses]); 
  };

  const handleAnswerChange = (questionId: number, newAnswer: string | string[]) => {
    const formattedAnswer = Array.isArray(newAnswer) ? newAnswer : [newAnswer];
    
    setEditedResponses(prev => 
      prev.map(response => 
        response.questionId === questionId 
          ? { ...response, answer: formattedAnswer }
          : response
      )
    );
  };

  const handleSubmit = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/update-survey`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.email,
          answers: editedResponses
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResponses(editedResponses);
        setIsEditing(false);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to update survey');
      }
    } catch (error) {
      console.error('Error updating responses:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  const renderAnswer = (question: any, response: SurveyResponse) => {
    if (!isEditing) {
      return Array.isArray(response.answer) ? response.answer.join(', ') : response.answer;
    }

    switch (question.type) {
      case 'rating':
        return (
          <div className="flex gap-2">
            {question.options?.map((option: string) => (
              <button
                key={option}
                onClick={() => handleAnswerChange(question.id, [option])}
                className={`px-4 py-2 rounded ${
                  response.answer[0] === option
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'single':
        return (
          <select
            value={response.answer[0]}
            onChange={(e) => handleAnswerChange(question.id, [e.target.value])}
            className="w-full p-2 border rounded"
          >
            {question.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiple':
        return (
          <div className="space-y-2">
            {question.options?.map((option: string) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={response.answer.includes(option)}
                  onChange={(e) => {
                    const currentAnswers = [...response.answer];
                    if (e.target.checked) {
                      currentAnswers.push(option);
                    } else {
                      const index = currentAnswers.indexOf(option);
                      if (index > -1) {
                        currentAnswers.splice(index, 1);
                      }
                    }
                    handleAnswerChange(question.id, currentAnswers);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={response.answer[0]}
            onChange={(e) => handleAnswerChange(question.id, [e.target.value])}
            className="w-full p-2 border rounded"
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-2/3 mx-auto mt-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-yellow-500 font-serif">Your Survey Responses</h1>
        <button
          onClick={() => navigate('/survey')}
          className="px-4 py-2 text-4xl text-black rounded hover:text-gray-700"
        >
          <IoExitOutline/>
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading responses...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && responses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No survey responses found. Please submit a survey first.</p>
          <button
            onClick={() => navigate('/survey')}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Go to Survey
          </button>
        </div>
      )}

      {!isLoading && !error && responses.length > 0 && (
        <>
          <div className="space-y-6">
            {questions.map(question => {
              const response = editedResponses.find(r => r.questionId === question.id) || 
                             responses.find(r => r.questionId === question.id);
              if (!response) return null;

              return (
                <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-medium text-cyan-800">{question.id}. {question.text}</p>
                  </div>
                  <div className="mt-2">
                    {renderAnswer(question, response)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Responses
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedResponses(responses);
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};