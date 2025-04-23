"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { InterviewQuestion, Category } from "@/types/interview";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";

interface SortableCardProps {
  question: InterviewQuestion;
  categories: Category[];
  onClick: () => void;
  onDelete: () => void;
}

const categoryColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
];

const getCategoryColor = (category: string) => {
  if (!category) return "";
  // 카테고리 문자열을 해시값으로 변환하여 일관된 색상 부여
  const hash = category.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return categoryColors[Math.abs(hash) % categoryColors.length];
};

export function SortableCard({
  question,
  categories,
  onClick,
  onDelete,
}: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 100ms ease",
    opacity: isDragging ? 0.5 : 1,
  };

  const categoryColor = useMemo(
    () => getCategoryColor(question.category),
    [question.category]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 border border-[#DED0C3] rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-100 cursor-pointer h-[180px] flex flex-col hover:border-[#E8AA9B] relative group"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3 min-h-[24px]">
          {question.category && (
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: categories.find(
                    (c) => c.name === question.category
                  )?.color,
                }}
              >
                {question.category}
              </span>
            </div>
          )}
        </div>
        <h3 className="text-base font-semibold text-[#2C3639] break-words whitespace-normal line-clamp-3 min-h-[4rem]">
          {question.question}
        </h3>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#5C6B73] hover:text-[#FF7676] hover:bg-[#FFE5E5]"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
