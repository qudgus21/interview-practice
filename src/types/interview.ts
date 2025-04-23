export type Priority = "high" | "medium" | "low";

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: Date;
}

export interface InterviewSession {
  id: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
}
