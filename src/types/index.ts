export interface User {
    email: string;
    password: string;
  }
 
  
  export interface Answer {
    questionId: number;
    answer: string | string[];
  }
  
  export interface SurveyResponse {
    userId: string;
    answers: Answer[];
  }

  export type QuestionType = "rating" | "single" | "multiple" | "text";

  export interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options?: string[];
    labels?: string[];
  }

export interface Answer {
  questionId: number;
  answer: string | string[];
}

export interface User {
  email: string;
  password: string;
}