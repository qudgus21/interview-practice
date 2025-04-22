"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InterviewQuestion, Priority } from "@/types/interview";
import { Plus, Trash2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Modal } from "@/components/ui/modal";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [filter, setFilter] = useState<Priority | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<InterviewQuestion | null>(null);
  const [formData, setFormData] = useState({
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

  const handleEditQuestion = (question: InterviewQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      priority: question.priority,
    });
    setIsModalOpen(true);
  };

  const handleSaveQuestion = () => {
    if (!formData.question || !formData.answer) return;

    if (editingQuestion) {
      // 수정 모드
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              question: formData.question,
              answer: formData.answer,
              priority: formData.priority,
            }
          : q
      );
      saveQuestions(updatedQuestions);
    } else {
      // 추가 모드
      const question: InterviewQuestion = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      saveQuestions([...questions, question]);
    }

    setFormData({ question: "", answer: "", priority: "medium" });
    setEditingQuestion(null);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({ question: "", answer: "", priority: "medium" });
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
            <Button onClick={() => setIsModalOpen(true)}>
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

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingQuestion ? "질문 수정" : "새 질문 추가"}
        >
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
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
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
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
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
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
              <Button variant="outline" onClick={handleModalClose}>
                취소
              </Button>
              <Button onClick={handleSaveQuestion}>
                {editingQuestion ? "수정" : "저장"}
              </Button>
            </div>
          </div>
        </Modal>

        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEditQuestion(q)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{q.question}</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {q.answer}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(q.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
