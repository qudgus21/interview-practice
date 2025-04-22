"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Plus, Mic, Clock, Calendar } from "lucide-react";

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([
    {
      id: "1",
      title: "Google 기술 면접",
      date: "2024-03-15",
      duration: 45,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Amazon 문화 면접",
      date: "2024-03-20",
      duration: 60,
      status: "upcoming",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto p-4 max-w-5xl">
        <Navigation />
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3639] mb-2">
                면접 관리
              </h1>
              <p className="text-[#5C6B73]">
                예정된 면접을 관리하고 준비하세요
              </p>
            </div>
            <Button className="bg-[#E8AA9B] hover:bg-[#E09686] text-white shadow-md transition-colors">
              <Plus className="mr-2 h-4 w-4" />새 면접 추가
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#E8AA9B] transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#2C3639] mb-2">
                      {interview.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-[#5C6B73]">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{interview.duration}분</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      interview.status === "upcoming"
                        ? "bg-[#FFF3E5] text-[#FFA05A]"
                        : "bg-[#E8F3E5] text-[#7AB55C]"
                    }`}
                  >
                    {interview.status === "upcoming" ? "예정" : "완료"}
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="border-[#DED0C3] text-[#5C6B73] hover:bg-[#FDF8F3]"
                  >
                    수정
                  </Button>
                  <Button className="bg-[#E8AA9B] hover:bg-[#E09686] text-white">
                    <Mic className="mr-2 h-4 w-4" />
                    연습 시작
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
