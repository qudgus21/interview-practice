import { PracticeHistory, PracticeRecord } from "@/types/interview";

// 총 녹음 시간 계산
export function calculateTotalDuration(records: PracticeRecord[]): number {
  return records.reduce((total, record) => total + record.duration, 0);
}

// 총 응답 문항 수 계산
export function calculateTotalQuestions(records: PracticeRecord[]): {
  total: number;
  unique: number;
} {
  const uniqueQuestions = new Set(records.map((record) => record.questionId));
  return {
    total: records.length,
    unique: uniqueQuestions.size,
  };
}

// 평균 응답 시간 계산
export function calculateAverageTime(records: PracticeRecord[]): number {
  if (records.length === 0) return 0;
  const totalDuration = calculateTotalDuration(records);
  return Math.round(totalDuration / records.length);
}

// 카테고리별 응답 시간 계산
export function calculateCategoryDurations(
  records: PracticeRecord[]
): { name: string; time: number }[] {
  const categoryMap = new Map<string, number>();

  records.forEach((record) => {
    const current = categoryMap.get(record.category) || 0;
    categoryMap.set(record.category, current + record.duration);
  });

  return Array.from(categoryMap.entries()).map(([name, time]) => ({
    name,
    time,
  }));
}

// 카테고리별 응답 횟수 계산
export function calculateCategoryAttempts(
  records: PracticeRecord[]
): { name: string; value: number }[] {
  const categoryMap = new Map<string, number>();

  records.forEach((record) => {
    const current = categoryMap.get(record.category) || 0;
    categoryMap.set(record.category, current + 1);
  });

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));
}

// 문항별 상세 분석
export function analyzeQuestionDetails(records: PracticeRecord[]): {
  questionId: string;
  question: string;
  category: string;
  attempts: number;
  avgTime: number;
  records: { attempt: number; time: number }[];
}[] {
  const questionMap = new Map<
    string,
    {
      question: string;
      category: string;
      times: number[];
    }
  >();

  records.forEach((record) => {
    const current = questionMap.get(record.questionId) || {
      question: record.question,
      category: record.category,
      times: [],
    };
    current.times.push(record.duration);
    questionMap.set(record.questionId, current);
  });

  return Array.from(questionMap.entries()).map(([questionId, data]) => ({
    questionId,
    question: data.question,
    category: data.category,
    attempts: data.times.length,
    avgTime: Math.round(
      data.times.reduce((a, b) => a + b, 0) / data.times.length
    ),
    records: data.times.map((time, index) => ({
      attempt: index + 1,
      time,
    })),
  }));
}

// 응답 시간 분포 계산
export function calculateTimeDistribution(
  records: PracticeRecord[]
): { range: string; count: number }[] {
  const ranges = [
    { max: 60, label: "1분 이하" },
    { max: 120, label: "1-2분" },
    { max: 180, label: "2-3분" },
    { max: 240, label: "3-4분" },
    { max: Infinity, label: "4분 이상" },
  ];

  const distribution = ranges.map((range) => ({
    range: range.label,
    count: 0,
  }));

  records.forEach((record) => {
    const rangeIndex = ranges.findIndex(
      (range) => record.duration <= range.max
    );
    if (rangeIndex !== -1) {
      distribution[rangeIndex].count++;
    }
  });

  return distribution;
}

// 시간 포맷 함수
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
