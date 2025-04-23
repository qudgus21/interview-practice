"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Mic, BarChart2 } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-[#DED0C3] z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-[#2C3639]"
          >
            <span className="bg-gradient-to-r from-[#E8AA9B] to-[#FF7676] bg-clip-text text-transparent">
              InterviewMate
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/questions"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/questions"
                  ? "bg-[#E8AA9B] text-white"
                  : "text-[#5C6B73] hover:bg-[#FDF8F3]"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>질문 관리</span>
            </Link>
            <Link
              href="/practice"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/practice"
                  ? "bg-[#E8AA9B] text-white"
                  : "text-[#5C6B73] hover:bg-[#FDF8F3]"
              }`}
            >
              <Mic className="h-4 w-4" />
              <span>실전 연습</span>
            </Link>
            <Link
              href="/feedback"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/feedback"
                  ? "bg-[#E8AA9B] text-white"
                  : "text-[#5C6B73] hover:bg-[#FDF8F3]"
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span>연습 분석</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
