"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Mic } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-2">면접 연습</h1>
      <p className="text-gray-600 mb-12">
        음성 인식과 타이머를 활용한 실전 면접 연습
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">질문 세트 관리</h2>
            </div>
            <p className="text-gray-600 mb-4">
              면접 질문과 답변을 관리하고 연습할 수 있습니다.
            </p>
            <ul className="text-gray-600 mb-8 space-y-2">
              <li>• 질문과 답변 추가/수정/삭제</li>
              <li>• 카테고리별 질문 관리</li>
              <li>• 자주 사용하는 질문 저장</li>
            </ul>
            <Link href="/questions" className="mt-auto">
              <Button className="w-full">시작하기</Button>
            </Link>
          </div>
        </div>

        <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <Mic className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">연습 모드</h2>
            </div>
            <p className="text-gray-600 mb-4">
              음성 인식을 활용한 실전 면접 연습을 시작하세요.
            </p>
            <ul className="text-gray-600 mb-8 space-y-2">
              <li>• 음성으로 질문 듣기</li>
              <li>• 음성으로 답변하기</li>
              <li>• 타이머로 시간 관리</li>
            </ul>
            <Link href="/practice" className="mt-auto">
              <Button className="w-full">시작하기</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
