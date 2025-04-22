"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Mic, FileText } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#2C3639] mb-6">
            면접 준비를 위한
            <br />
            <span className="bg-gradient-to-r from-[#E8AA9B] to-[#FF7676] bg-clip-text text-transparent">
              최고의 도구
            </span>
          </h1>
          <p className="text-xl text-[#5C6B73] mb-12">
            체계적인 면접 준비와 효과적인 연습을 통해
            <br />
            당신의 면접 성공률을 높여보세요
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <Link href="/questions">
              <Button className="bg-[#E8AA9B] hover:bg-[#E09686] text-white shadow-md transition-colors px-8 py-6 text-lg">
                <BookOpen className="mr-2 h-5 w-5" />
                질문 관리 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/practice">
              <Button className="bg-[#5C6B73] hover:bg-[#4A5559] text-white shadow-md transition-colors px-8 py-6 text-lg">
                <Mic className="mr-2 h-5 w-5" />
                실전 연습 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#E8AA9B] transition-all duration-200">
              <div className="w-12 h-12 bg-[#FFE5E5] rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-[#FF7676]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3639] mb-2">
                질문 관리
              </h3>
              <p className="text-[#5C6B73]">
                체계적인 면접 질문 관리와 카테고리 분류
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#5C6B73] transition-all duration-200">
              <div className="w-12 h-12 bg-[#E8E8E8] rounded-lg flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-[#5C6B73]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3639] mb-2">
                실전 연습
              </h3>
              <p className="text-[#5C6B73]">
                음성 인식을 활용한 실전 면접 연습
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#DED0C3] hover:border-[#E8AA9B] transition-all duration-200">
              <div className="w-12 h-12 bg-[#E8F3E5] rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-[#7AB55C]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C3639] mb-2">
                피드백
              </h3>
              <p className="text-[#5C6B73]">면접 연습 결과 분석과 피드백</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
