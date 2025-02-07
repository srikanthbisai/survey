import React, { createContext, useContext, useState } from 'react';
import { Answer } from '../types';
import { useAuth } from './AuthContext';

interface SurveyContextType {
  answers: Answer[];
  setAnswer: (questionId: number, answer: string | string[]) => void;
  submitSurvey: () => Promise<void>;
}

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { user } = useAuth();

  const setAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing !== -1) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, answer };
        return newAnswers;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const submitSurvey = async () => {
    if (!user) throw new Error('User not authenticated');
    
    const transformedAnswers = answers.map((answer) => ({
      questionId: answer.questionId,
      answer: Array.isArray(answer.answer) ? answer.answer : [answer.answer],
    }));
  
    try {
      const response = await fetch('http://localhost:3001/api/submit-survey', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userId: user.email, 
          answers: transformedAnswers 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit survey');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    }
  };
  
  return (
    <SurveyContext.Provider value={{ answers, setAnswer, submitSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within SurveyProvider');
  return context;
};
