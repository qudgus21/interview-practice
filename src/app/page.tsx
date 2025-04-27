"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Mic, FileText } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  // FAQ 아코디언 상태
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // 후기 페이드 인 상태
  const [activeReview, setActiveReview] = useState(0);
  const reviews = [
    "면접 준비가 막막했는데, 질문을 직접 정리하고 연습하니 자신감이 생겼어요!",
    "음성 인식 연습이 실제 면접과 비슷해서 큰 도움이 됐습니다.",
    "무료인데도 기능이 다양해서 추천합니다.",
    "카테고리별로 질문을 정리할 수 있어서 체계적인 준비가 가능했어요.",
    "답변 시간을 측정할 수 있어서 실제 면접에서 시간 관리가 수월해졌습니다.",
    "모바일에서도 편하게 사용할 수 있어서 이동 중에도 연습하기 좋아요.",
  ];

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
            <br />
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
                드래그앤드롭 순서 조정
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
                카테고리별 맞춤 면접 연습
              </li>
              <li className="flex items-center w-44 md:w-48">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C6B73] mr-2.5"></div>
                답변 시간 측정 및 관리
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
            <ul className="space-y-3 text-sm md:text-base text-[#5C6B73] flex flex-col items-center pl-[70px]">
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
      {/* 정보성 콘텐츠 추가 */}
      <div className="bg-[#FDF8F3] border-t border-[#DED0C3] py-12 mt-8">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-bold text-[#2C3639] mb-4 text-center">
            Interview Mate 서비스 안내
          </h2>
          <p className="text-[#5C6B73] text-sm text-center mb-8">
            Interview Mate는 면접 준비를 위한 질문 관리, 실전 연습, 연습 분석,
            자료실 등 다양한 기능을 무료로 제공합니다.
            <br />
            아래에서 서비스의 주요 특징과 이용 방법, 자주 묻는 질문, 실제 이용
            후기를 확인해보세요.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 transition-transform duration-200 hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-[#2C3639] mb-2">
                질문 관리
              </h3>
              <p className="text-[#5C6B73] text-sm">
                면접에서 자주 나오는 질문을 직접 추가하고, 카테고리별로 정리할
                수 있습니다. 나만의 질문 리스트를 만들어보세요.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 transition-transform duration-200 hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-[#2C3639] mb-2">
                실전 연습
              </h3>
              <p className="text-[#5C6B73] text-sm">
                음성 인식 기능을 활용해 실제 면접과 비슷해서 답변을 연습할 수
                있습니다. 답변 시간 측정, 모범 답안 비교 등 다양한 기능을
                제공합니다.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 transition-transform duration-200 hover:scale-105 hover:shadow-lg">
              <h3 className="text-lg font-semibold text-[#2C3639] mb-2">
                연습 분석
              </h3>
              <p className="text-[#5C6B73] text-sm">
                연습 기록을 바탕으로 답변 시간, 카테고리별 분석, 피드백을
                제공합니다. 꾸준한 연습으로 실력을 향상시켜보세요.
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-base font-semibold text-[#2C3639] mb-2">
              자주 묻는 질문
            </h3>
            <ul className="text-[#5C6B73] text-sm space-y-2">
              {[
                {
                  q: "Q. 정말 모든 기능이 무료인가요?",
                  a: "네, Interview Mate의 모든 기능은 회원가입 없이 무료로 이용하실 수 있습니다.",
                },
                {
                  q: "Q. 내 데이터는 안전하게 보관되나요?",
                  a: "모든 데이터는 사용자의 브라우저에만 저장되며, 서버로 전송되지 않습니다.",
                },
                {
                  q: "Q. 모바일에서도 사용이 가능한가요?",
                  a: "네, 모바일과 데스크탑 모두에서 최적화된 UI로 이용하실 수 있습니다.",
                },
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    className="w-full text-left font-semibold text-[#2C3639] flex items-center justify-between py-2 focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <span
                      className={`ml-2 transition-transform ${
                        openFaq === idx ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      ▶
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === idx
                        ? "max-h-40 opacity-100 py-2"
                        : "max-h-0 opacity-0 py-0"
                    }`}
                  >
                    <p className="pl-2 text-[#5C6B73] text-sm">{item.a}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#2C3639] mb-2">
              실제 이용 후기
            </h3>
            <div className="relative h-16 flex items-center justify-center">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className={`absolute left-0 right-0 transition-opacity duration-700 ${
                    activeReview === idx
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-4 text-center text-[#5C6B73] text-sm">
                    {review}
                  </div>
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-4">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      activeReview === idx ? "bg-[#E8AA9B]" : "bg-[#DED0C3]"
                    }`}
                    onClick={() => setActiveReview(idx)}
                    aria-label={`후기 ${idx + 1}번 보기`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
