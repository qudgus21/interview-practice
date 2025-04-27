import { articles } from "@/data/articles";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const article = articles.find((a) => a.slug === params.slug);
  return {
    title: article
      ? `${article.title} | 인터뷰 준비 블로그`
      : "글을 찾을 수 없습니다.",
    description: article ? article.summary : undefined,
  };
}

export default function ArticleDetailPage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return notFound();

  // 마크다운 헤더(#)를 h1/h2로, 줄바꿈을 <br />로 변환 (간단 변환)
  const html = article.content
    .replace(
      /^# (.*)$/gm,
      '<h1 class="text-2xl md:text-3xl font-bold text-[#2C3639] mb-6">$1</h1>'
    )
    .replace(
      /^## (.*)$/gm,
      '<h2 class="text-xl font-semibold text-[#2C3639] mb-4">$1</h2>'
    )
    .replace(/\n/g, "<br />");

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-6">
          <Link
            href="/articles"
            className="text-[#E8AA9B] hover:underline text-sm font-medium"
          >
            ← 자료실로 돌아가기
          </Link>
        </div>
        <article className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-8">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </div>
    </div>
  );
}
