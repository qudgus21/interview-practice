import Link from "next/link";
import { articles } from "@/data/articles";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "자료실 | 인터뷰 준비 블로그",
  description:
    "인터뷰 준비, 답변 작성, 질문 분석 등 면접에 도움이 되는 다양한 글을 확인하세요.",
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-3xl mt-15">
        <h1 className="text-3xl font-bold text-[#2C3639] mb-8">
          인터뷰 준비 Articles
        </h1>
        <ul className="space-y-8">
          {articles.map((article) => (
            <li
              key={article.slug}
              className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 hover:shadow-md transition-all"
            >
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-2xl font-semibold text-[#2C3639] mb-2 hover:text-[#E8AA9B]">
                  {article.title}
                </h2>
              </Link>
              <p className="text-[#5C6B73] mb-2">{article.summary}</p>
              <Link
                href={`/articles/${article.slug}`}
                className="text-[#E8AA9B] hover:underline text-sm font-medium"
              >
                자세히 보기 &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
