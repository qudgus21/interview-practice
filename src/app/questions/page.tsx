"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InterviewQuestion, Priority } from "@/types/interview";
import { Plus } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [filter, setFilter] = useState<Priority | "all">("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    priority: "medium" as Priority,
  });

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const saveQuestions = (newQuestions: InterviewQuestion[]) => {
    setQuestions(newQuestions);
    localStorage.setItem("interviewQuestions", JSON.stringify(newQuestions));
  };

  const addQuestion = () => {
    if (!newQuestion.question || !newQuestion.answer) return;

    const question: InterviewQuestion = {
      id: Date.now().toString(),
      ...newQuestion,
      createdAt: new Date(),
    };

    saveQuestions([...questions, question]);
    setNewQuestion({ question: "", answer: "", priority: "medium" });
    setIsAdding(false);
  };

  const deleteQuestion = (id: string) => {
    saveQuestions(questions.filter((q) => q.id !== id));
  };

  const filteredQuestions = questions.filter(
    (q) => filter === "all" || q.priority === filter
  );

  return (
    <div className="container mx-auto p-4">
      <Navigation />
      <div className="mt-16">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">면접 질문 관리</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              질문 추가
            </Button>
            <select
              className="border rounded-md px-3 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Priority | "all")}
            >
              <option value="all">전체</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
          </div>
        </div>

        {isAdding && (
          <div className="mb-4 p-4 border rounded-md">
            <input
              type="text"
              placeholder="질문"
              className="w-full mb-2 p-2 border rounded"
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
            />
            <textarea
              placeholder="답변"
              className="w-full mb-2 p-2 border rounded"
              value={newQuestion.answer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer: e.target.value })
              }
            />
            <select
              className="w-full mb-2 p-2 border rounded"
              value={newQuestion.priority}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  priority: e.target.value as Priority,
                })
              }
            >
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                취소
              </Button>
              <Button onClick={addQuestion}>저장</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{q.question}</h3>
                  <p className="text-gray-600 mt-2">{q.answer}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                      q.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : q.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {q.priority === "high"
                      ? "높음"
                      : q.priority === "medium"
                      ? "보통"
                      : "낮음"}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteQuestion(q.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
