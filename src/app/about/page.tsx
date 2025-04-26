import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Interview Mate | 면접 질문 관리 플랫폼",
  description:
    "Interview Mate는 면접 준비를 위한 최고의 도구입니다. 체계적인 질문 관리와 실전 연습으로 면접 성공률을 높여보세요.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About Interview Mate</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">서비스 소개</h2>
        <p className="mb-4">
          Interview Mate는 면접 준비를 위한 종합 플랫폼입니다. 체계적인 질문
          관리와 실전 연습을 통해 면접 성공률을 높일 수 있도록 도와드립니다.
        </p>
        <p>
          모든 기능을 무료로 제공하며, 사용자들의 면접 준비 과정을 최대한
          효율적으로 만들어드립니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">주요 기능</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>질문/답변 작성 및 수정</li>
          <li>카테고리 분류 및 관리</li>
          <li>드래그앤드롭 순서 조정</li>
          <li>음성 인식 기반 답변 연습</li>
          <li>카테고리별 맞춤 면접 연습</li>
          <li>답변 시간 측정 및 관리</li>
          <li>답변 내용 분석 및 피드백</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">비전</h2>
        <p className="mb-4">
          Interview Mate는 모든 구직자가 자신의 역량을 최대한 발휘할 수 있는
          기회를 얻을 수 있도록 지원하는 것을 목표로 합니다.
        </p>
        <p>
          지속적인 업데이트와 개선을 통해 더 나은 면접 준비 경험을 제공하고자
          합니다.
        </p>
      </section>
    </div>
  );
}
