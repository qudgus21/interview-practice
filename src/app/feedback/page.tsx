"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { PracticeHistory } from "@/types/interview";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  calculateTotalDuration,
  calculateTotalQuestions,
  calculateAverageTime,
  calculateCategoryDurations,
  calculateCategoryAttempts,
  calculateTimeDistribution,
  analyzeQuestionDetails,
  formatTime,
} from "@/lib/practice";

const COLORS = ["#E8AA9B", "#D67D6A", "#C46A57", "#B25744", "#A04431"];

export default function FeedbackPage() {
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory>({
    records: [],
    lastUpdated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem("practiceHistory");
    if (savedHistory) {
      setPracticeHistory(JSON.parse(savedHistory));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Navigation />
        <div className="container mx-auto p-4 max-w-6xl">
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-[#2C3639] mb-4">
              데이터를 불러오는 중입니다...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (practiceHistory.records.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Navigation />
        <div className="container mx-auto p-4 max-w-6xl">
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-[#2C3639] mb-4">
              연습 기록이 없습니다
            </h1>
            <p className="text-[#5C6B73]">
              면접 연습을 시작하고 피드백을 확인해보세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalDuration = calculateTotalDuration(practiceHistory.records);
  const { total: totalQuestions, unique: uniqueQuestions } =
    calculateTotalQuestions(practiceHistory.records);
  const averageTime = calculateAverageTime(practiceHistory.records);
  const categoryDurations = calculateCategoryDurations(practiceHistory.records);
  const categoryAttempts = calculateCategoryAttempts(practiceHistory.records);
  const timeDistribution = calculateTimeDistribution(practiceHistory.records);
  const questionDetails = analyzeQuestionDetails(practiceHistory.records);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mt-16">
          <div className="text-center md:text-left mb-12">
            <h1 className="text-3xl font-bold text-[#2C3639] mb-2">
              면접 연습 분석
            </h1>
            <p className="text-[#5C6B73]">
              지금까지의 면접 연습 기록을 분석한 결과입니다
            </p>
          </div>

          {/* 전체 요약 섹션 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2C3639] mb-6">
              전체 요약
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <h3 className="text-sm font-medium text-[#5C6B73] mb-2">
                  총 녹음 시간
                </h3>
                <p className="text-3xl font-bold text-[#2C3639]">
                  {formatTime(totalDuration)}
                </p>
              </Card>
              <Card>
                <h3 className="text-sm font-medium text-[#5C6B73] mb-2">
                  총 응답 문항
                </h3>
                <p className="text-3xl font-bold text-[#2C3639]">
                  {uniqueQuestions}개 / {totalQuestions}회
                </p>
                <p className="text-sm text-[#5C6B73] mt-1">
                  (고유 문항 / 총 응답)
                </p>
              </Card>
              <Card>
                <h3 className="text-sm font-medium text-[#5C6B73] mb-2">
                  평균 응답 시간
                </h3>
                <p className="text-3xl font-bold text-[#2C3639]">
                  {formatTime(averageTime)}
                </p>
              </Card>
            </div>
          </section>

          {/* 카테고리 분석 섹션 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2C3639] mb-6">
              카테고리 분석
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#2C3639] mb-4">
                  카테고리별 응답 시간
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryDurations}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatTime(value)} />
                      <Tooltip
                        formatter={(value: number) => formatTime(value)}
                      />
                      <Bar dataKey="time" fill="#D67D6A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#2C3639] mb-4">
                  카테고리별 응답 횟수
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryAttempts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.name}: ${entry.value}회`}
                      >
                        {categoryAttempts.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </section>

          {/* 시간 분석 섹션 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2C3639] mb-6">
              시간 분석
            </h2>
            <Card>
              <h3 className="text-lg font-semibold text-[#2C3639] mb-4">
                응답 시간 분포
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#D67D6A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          {/* 상세 문항 분석 섹션 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#2C3639] mb-6">
              상세 문항 분석
            </h2>
            <Card>
              <div className="space-y-6">
                {questionDetails.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-[#DED0C3] last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-[#2C3639] mb-1">
                          {item.question}
                        </h4>
                        <p className="text-sm text-[#5C6B73]">
                          카테고리: {item.category}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-[#5C6B73]">시도 횟수:</span>{" "}
                          <span className="font-medium text-[#2C3639]">
                            {item.attempts}회
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[#5C6B73]">평균 시간:</span>{" "}
                          <span className="font-medium text-[#2C3639]">
                            {formatTime(item.avgTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.records.map((record, recordIndex) => (
                        <div
                          key={recordIndex}
                          className="bg-[#FDF8F3] rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#5C6B73]">
                              {record.attempt}번째 시도
                            </span>
                            <span className="text-sm font-medium text-[#2C3639]">
                              {formatTime(record.time)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
