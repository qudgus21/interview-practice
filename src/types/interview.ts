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

export interface Category {
  name: string;
  color: string;
}

export const CATEGORY_COLORS = [
  "#FFB6C1", // Light Pink
  "#98FB98", // Pale Green
  "#87CEEB", // Sky Blue
  "#DDA0DD", // Plum
  "#FFA07A", // Light Salmon
  "#B0E0E6", // Powder Blue
  "#F0E68C", // Khaki
  "#FFE4E1", // Misty Rose
  "#E6E6FA", // Lavender
  "#F0FFF0", // Honeydew
  "#F0F8FF", // Alice Blue
  "#FFF0F5", // Lavender Blush
  "#F5F5DC", // Beige
  "#FFE4B5", //
  "#FAFAD2", // Light Goldenrod Yellow
  "#F5DEB3", // Wheat
  "#D8BFD8", // Thistle
  "#FFDAB9", // Peach Puff
  "#B0C4DE", // Light Steel Blue
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export function generateRandomColor(usedColors: string[]): string {
  // 사용 가능한 색상 중에서 선택

  const availableColors = CATEGORY_COLORS.filter(
    (color) => !usedColors.includes(color)
  );

  if (availableColors.length > 0) {
    // 사용 가능한 색상이 있으면 랜덤으로 선택
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  }

  // 모든 색상이 사용 중이면 CATEGORY_COLORS에서 랜덤으로 선택
  const randomIndex = Math.floor(Math.random() * CATEGORY_COLORS.length);
  return CATEGORY_COLORS[randomIndex];
}

export interface PracticeRecord {
  questionId: string;
  category: string;
  question: string;
  timestamp: number; // 연습 시작 시간
  duration: number; // 응답 시간 (초)
  attempt: number; // 해당 문항의 몇 번째 시도인지
}

export interface PracticeHistory {
  records: PracticeRecord[];
  lastUpdated: number;
}
