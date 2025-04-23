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
  "#E8AA9B", // 핑크
  "#5C6B73", // 그레이
  "#2C3639", // 다크 그레이
  "#DED0C3", // 베이지
  "#A5BECC", // 라이트 블루
  "#7D8E95", // 미디엄 그레이
  "#B4C4D9", // 파스텔 블루
  "#D9B4A7", // 코랄
  "#8C9EA4", // 슬레이트
  "#C4D1D9", // 라이트 슬레이트
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export function generateRandomColor(usedColors: string[]): string {
  // 사용 가능한 색상 중에서 선택
  const availableColors = CATEGORY_COLORS.filter(
    (color) => !usedColors.includes(color)
  );

  if (availableColors.length > 0) {
    // 사용 가능한 색상이 있으면 그 중에서 선택
    // 결정론적인 방식으로 색상 선택
    const index = usedColors.length % availableColors.length;
    return availableColors[index];
  }

  // 모든 색상이 사용 중이면 새로운 색상 생성
  // 결정론적인 방식으로 색상 생성
  const hue = (usedColors.length * 137.508) % 360; // 황금각을 사용하여 색상 분포 개선
  return `hsl(${hue}, 30%, 45%)`;
}
