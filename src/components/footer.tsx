import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <div className="text-[#5C6B73] text-sm">
            © Interview Mate. All rights reserved.
          </div>
          <div className="flex items-center text-[#5C6B73] text-sm">
            <Link
              href="/about"
              className="hover:text-[#E8AA9B] transition-colors px-3"
            >
              서비스 소개
            </Link>
            <div className="w-[1px] h-3 bg-[#DED0C3]" />
            <Link
              href="/privacy"
              className="hover:text-[#E8AA9B] transition-colors px-3"
            >
              개인정보처리방침
            </Link>
            <div className="w-[1px] h-3 bg-[#DED0C3]" />
            <Link
              href="/contact"
              className="hover:text-[#E8AA9B] transition-colors px-3"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
