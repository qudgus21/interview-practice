"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { InterviewQuestion } from "@/types/interview";
import { Trash2 } from "lucide-react";

interface SortableCardProps {
  question: InterviewQuestion;
  onClick: () => void;
  onDelete: () => void;
}

export function SortableCard({
  question,
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
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 border border-[#DED0C3] rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-[180px] flex flex-col hover:border-[#E8AA9B] relative group"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              question.priority === "high"
                ? "bg-[#FFE5E5] text-[#FF7676]"
                : question.priority === "medium"
                ? "bg-[#FFF3E5] text-[#FFA05A]"
                : "bg-[#E8F3E5] text-[#7AB55C]"
            }`}
          >
            {question.priority === "high"
              ? "높음"
              : question.priority === "medium"
              ? "보통"
              : "낮음"}
          </span>
          {question.category && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E8E8E8] text-[#5C6B73]">
              {question.category}
            </span>
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
