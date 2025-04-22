"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InterviewQuestion, Priority } from "@/types/interview";
import { Plus, Trash2, Edit2 } from "lucide-react";
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
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
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

  const validateForm = () => {
    const newErrors = {
      question: "",
      answer: "",
    };

    if (!formData.question.trim()) {
      newErrors.question = "질문을 입력해주세요";
    }
    if (!formData.answer.trim()) {
      newErrors.answer = "답변을 입력해주세요";
    }

    setErrors(newErrors);
    return !newErrors.question && !newErrors.answer;
  };

  const handleSaveQuestion = () => {
    if (!validateForm()) return;

    if (editingQuestion) {
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
      const question: InterviewQuestion = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      saveQuestions([...questions, question]);
    }

    setFormData({ question: "", answer: "", priority: "medium" });
    setEditingQuestion(null);
    setErrors({ question: "", answer: "" });
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({ question: "", answer: "", priority: "medium" });
    setErrors({ question: "", answer: "" });
  };

  const deleteQuestion = (id: string) => {
    saveQuestions(questions.filter((q) => q.id !== id));
  };

  const filteredQuestions = questions.filter(
    (q) => filter === "all" || q.priority === filter
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Navigation />
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              면접 질문 관리
            </h1>
            <p className="text-gray-700">면접 준비를 위한 질문을 관리하세요</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              질문 추가
            </Button>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
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
          className="max-w-4xl"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                질문
              </label>
              <input
                id="question"
                type="text"
                placeholder="면접 질문을 입력하세요"
                className={`w-full p-3 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.question ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.question}
                onChange={(e) => {
                  setFormData({ ...formData, question: e.target.value });
                  if (errors.question) {
                    setErrors({ ...errors, question: "" });
                  }
                }}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-500">{errors.question}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                답변
              </label>
              <textarea
                id="answer"
                placeholder="모범 답안을 입력하세요"
                className={`w-full p-3 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-96 resize-none ${
                  errors.answer ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.answer}
                onChange={(e) => {
                  setFormData({ ...formData, answer: e.target.value });
                  if (errors.answer) {
                    setErrors({ ...errors, answer: "" });
                  }
                }}
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-500">{errors.answer}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                중요도
              </label>
              <select
                id="priority"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="outline"
                onClick={handleModalClose}
                className="border-gray-300 hover:bg-gray-50 text-gray-800"
              >
                취소
              </Button>
              <Button
                onClick={handleSaveQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                {editingQuestion ? "수정" : "저장"}
              </Button>
            </div>
          </div>
        </Modal>

        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleEditQuestion(q)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {q.question}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {q.answer}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(q.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
