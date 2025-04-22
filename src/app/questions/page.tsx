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
          <div className="mb-4 p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">새 질문 추가</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="question"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  질문
                </label>
                <input
                  id="question"
                  type="text"
                  placeholder="면접 질문을 입력하세요"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  답변
                </label>
                <textarea
                  id="answer"
                  placeholder="모범 답안을 입력하세요"
                  className="w-full p-2 border rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  value={newQuestion.answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, answer: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  중요도
                </label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
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
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  취소
                </Button>
                <Button onClick={addQuestion}>저장</Button>
              </div>
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
