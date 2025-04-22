"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#DED0C3] z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#2C3639]">
            면접 준비
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
          </div>
        </div>
      </div>
    </nav>
  );
}
