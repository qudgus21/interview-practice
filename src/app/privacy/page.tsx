import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Interview Mate",
  description: "Interview Mate의 개인정보처리방침을 확인하세요.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">개인정보처리방침</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. 개인정보 수집</h2>
        <p className="mb-4">
          Interview Mate는 별도의 회원 가입 절차 없이 서비스를 제공하며,
          사용자의 개인정보를 수집하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. 데이터 저장 및 관리</h2>
        <p className="mb-4">
          모든 데이터는 사용자의 브라우저 내 localStorage에 저장되며, 서버로
          전송되지 않습니다:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>면접 질문 및 답변</li>
          <li>카테고리 정보</li>
          <li>연습 기록 및 분석 데이터</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. 쿠키 사용</h2>
        <p>
          필수적인 웹 기능 구현을 위한 기술적 쿠키만을 사용할 수 있으며, 사용자
          추적이나 마케팅 목적의 쿠키는 사용하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. 데이터 보안</h2>
        <p>
          사용자의 데이터는 브라우저의 localStorage에만 저장되므로, 데이터의
          보안과 관리는 사용자의 브라우저 보안 설정에 따릅니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. 제3자 제공</h2>
        <p>
          Interview Mate는 어떠한 사용자 데이터도 수집하거나 저장하지 않으므로,
          제3자에게 제공하는 정보가 없습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. 사용자 권리</h2>
        <p className="mb-4">
          사용자는 언제든지 브라우저 설정을 통해 localStorage를 초기화하여
          저장된 모든 데이터를 삭제할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. 정책 변경</h2>
        <p>
          본 개인정보처리방침은 2024년 4월 26일부터 적용되며, 법률 또는 서비스
          변경사항을 반영하기 위해 내용이 변경될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. 문의하기</h2>
        <p>
          개인정보처리방침에 대한 문의사항이 있으시면
          <Link href="/contact" className="text-[#E8AA9B] hover:underline mx-1">
            문의하기
          </Link>
          페이지를 통해 연락주시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
