"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Mic, BarChart2, Menu, X, FileText } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      href: "/questions",
      icon: BookOpen,
      label: "질문 관리",
    },
    {
      href: "/practice",
      icon: Mic,
      label: "실전 연습",
    },
    {
      href: "/feedback",
      icon: BarChart2,
      label: "연습 분석",
    },
    {
      href: "/articles",
      icon: FileText,
      label: "자료실",
    },
  ];

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

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-[#E8AA9B] text-white"
                    : "text-[#5C6B73] hover:bg-[#FDF8F3]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 text-[#5C6B73] hover:bg-[#FDF8F3] rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#DED0C3]">
            <div className="container mx-auto px-4 py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-[#E8AA9B] text-white"
                      : "text-[#5C6B73] hover:bg-[#FDF8F3]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
