"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Mic, FileText } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8 md:py-16 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12 md:mb-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#2C3639] mt-4">
            면접 준비를 위한 최고의 도구
          </h1>
          <div className="inline-block bg-[#FFE5E5] text-[#FF7676] px-4 py-1.5 rounded-full text-base md:text-lg font-medium">
            모든 기능 무료
          </div>
          <p className="text-lg md:text-xl text-[#5C6B73] leading-relaxed px-4">
            체계적인 면접 준비와 효과적인 연습을 통해
            <br className="hidden md:block" />
            면접 성공률을 높여보세요
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
            <Link href="/questions">
              <Button className="w-full md:w-auto bg-[#E8AA9B] hover:bg-[#E09686] text-white shadow-md transition-colors px-6 py-5 text-base md:text-lg h-auto">
                <BookOpen className="mr-2 h-5 w-5" />
                질문 관리 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/practice">
              <Button className="w-full md:w-auto bg-[#5C6B73] hover:bg-[#4A5559] text-white shadow-md transition-colors px-6 py-5 text-base md:text-lg h-auto">
                <Mic className="mr-2 h-5 w-5" />
                실전 연습 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#E8AA9B] transition-all duration-200">
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 bg-[#FFE5E5] rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-[#FF7676]" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2C3639]">
                질문 관리
              </h3>
            </div>
            <ul className="space-y-3 text-sm md:text-base text-[#5C6B73] flex flex-col items-center">
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7676] mr-2.5"></div>
                질문/답변 작성 및 수정
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7676] mr-2.5"></div>
                카테고리 분류 및 관리
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7676] mr-2.5"></div>
                난이도 설정 (상/중/하)
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#5C6B73] transition-all duration-200">
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 bg-[#E8E8E8] rounded-lg flex items-center justify-center mb-3">
                <Mic className="h-6 w-6 text-[#5C6B73]" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2C3639]">
                실전 연습
              </h3>
            </div>
            <ul className="space-y-3 text-sm md:text-base text-[#5C6B73] flex flex-col items-center">
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C6B73] mr-2.5"></div>
                음성 인식 기반 답변 연습
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C6B73] mr-2.5"></div>
                실시간 음성 분석
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C6B73] mr-2.5"></div>
                답변 시간 측정
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#E8AA9B] transition-all duration-200">
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 bg-[#E8F3E5] rounded-lg flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-[#7AB55C]" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2C3639]">
                피드백
              </h3>
            </div>
            <ul className="space-y-3 text-sm md:text-base text-[#5C6B73] flex flex-col items-center">
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7AB55C] mr-2.5"></div>
                답변 내용 분석
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7AB55C] mr-2.5"></div>
                발음 및 속도 평가
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7AB55C] mr-2.5"></div>
                개선점 제안
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
