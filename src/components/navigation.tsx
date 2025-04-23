"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic } from "lucide-react";

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
              href="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-[#E8AA9B] text-white"
                  : "text-[#5C6B73] hover:bg-[#FDF8F3]"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>홈</span>
            </Link>
            <Link
              href="/questions"
              className="text-sm md:text-base text-[#5C6B73] hover:text-[#2C3639] transition-colors"
            >
              질문 관리
            </Link>
            <Link
              href="/practice"
              className="text-sm md:text-base text-[#5C6B73] hover:text-[#2C3639] transition-colors"
            >
              실전 연습
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
