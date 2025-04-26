import { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 | Interview Mate",
  description: "Interview Mate에 문의하실 내용이 있다면 이메일로 연락해주세요.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">문의하기</h1>

      <section className="mb-8">
        <p className="mb-6 text-[#5C6B73]">
          Interview Mate 서비스 이용에 관한 문의사항이나 피드백이 있으시다면
          아래 이메일로 연락해 주세요. 최대한 빠르게 답변 드리도록 하겠습니다.
        </p>

        <div className="bg-[#FDF8F3] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#2C3639]">
            이메일 문의
          </h2>
          <a
            href="mailto:hbh4231@gmail.com"
            className="text-[#E8AA9B] hover:underline text-lg"
          >
            hbh4231@gmail.com
          </a>

          <div className="mt-6 text-sm text-[#5C6B73]">
            <p className="mb-2">
              ※ 보다 빠른 답변을 위해 아래 내용을 포함해 주시면 감사하겠습니다:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>문의하시는 기능이나 내용</li>
              <li>사용 중인 브라우저 정보</li>
              <li>문제가 발생한 경우 구체적인 상황 설명</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
