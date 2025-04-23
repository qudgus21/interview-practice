"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InterviewQuestion } from "@/types/interview";
import { Plus, Tag, X } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Modal } from "@/components/ui/modal";
import { CustomSelect } from "@/components/ui/custom-select";
import { SortableCard } from "@/components/ui/sortable-card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<InterviewQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [errors, setErrors] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 드래그해야 드래그로 인식
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    const savedCategories = localStorage.getItem("interviewCategories");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  const saveQuestions = (newQuestions: InterviewQuestion[]) => {
    setQuestions(newQuestions);
    localStorage.setItem("interviewQuestions", JSON.stringify(newQuestions));
  };

  const saveCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    localStorage.setItem("interviewCategories", JSON.stringify(newCategories));
  };

  const handleEditQuestion = (question: InterviewQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      category: question.category,
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {
      question: "",
      answer: "",
      category: "",
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
              category: formData.category,
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

    setFormData({ question: "", answer: "", category: "" });
    setEditingQuestion(null);
    setErrors({ question: "", answer: "", category: "" });
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({ question: "", answer: "", category: "" });
    setErrors({ question: "", answer: "", category: "" });
  };

  const deleteQuestion = (id: string) => {
    saveQuestions(questions.filter((q) => q.id !== id));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [newCategory.trim(), ...categories];
      saveCategories(updatedCategories);
      setNewCategory("");
    }
  };

  const deleteCategory = (category: string) => {
    const updatedCategories = categories.filter((c) => c !== category);
    saveCategories(updatedCategories);
    // 해당 카테고리의 질문들의 카테고리를 빈 문자열로 설정
    const updatedQuestions = questions.map((q) =>
      q.category === category ? { ...q, category: "" } : q
    );
    saveQuestions(updatedQuestions);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    saveQuestions(newQuestions);
  };

  const filteredQuestions = questions.filter(
    (q) => categoryFilter === "all" || q.category === categoryFilter
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto p-4 max-w-5xl">
        <div className="mt-16 md:mt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C3639] mb-2">
                면접 질문 관리
              </h1>
              <p className="text-[#5C6B73]">
                면접 준비를 위한 질문을 관리하세요
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#E8AA9B] hover:bg-[#E09686] text-white shadow-md transition-colors w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                질문 추가
              </Button>
              <Button
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-white text-[#2C3639] border border-[#DED0C3] hover:bg-[#FDF8F3] w-full sm:w-auto"
              >
                <Tag className="mr-2 h-4 w-4" />
                카테고리 관리
              </Button>
              <div className="flex flex-col sm:flex-row gap-2">
                <CustomSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={[
                    { value: "all", label: "전체 카테고리" },
                    ...categories.map((category) => ({
                      value: category,
                      label: category,
                    })),
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={filteredQuestions.map((q) => q.id)}>
                {filteredQuestions.map((q) => (
                  <SortableCard
                    key={q.id}
                    question={q}
                    onClick={() => handleEditQuestion(q)}
                    onDelete={() => deleteQuestion(q.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingQuestion ? "질문 수정" : "새 질문 추가"}
        className="max-w-4xl bg-[#FDF8F3]"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-[#2C3639] mb-2"
            >
              질문
            </label>
            <input
              id="question"
              type="text"
              placeholder="면접 질문을 입력하세요"
              className={`w-full p-3 border rounded-lg bg-white text-[#2C3639] focus:outline-none focus:ring-2 focus:ring-[#E8AA9B] focus:border-[#E8AA9B] transition-colors ${
                errors.question ? "border-red-500" : "border-[#DED0C3]"
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
              className="block text-sm font-medium text-[#2C3639] mb-2"
            >
              답변
            </label>
            <textarea
              id="answer"
              placeholder="모범 답안을 입력하세요"
              className={`w-full p-3 border rounded-lg bg-white text-[#2C3639] focus:outline-none focus:ring-2 focus:ring-[#E8AA9B] focus:border-[#E8AA9B] transition-colors h-96 resize-none ${
                errors.answer ? "border-red-500" : "border-[#DED0C3]"
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
              htmlFor="category"
              className="block text-sm font-medium text-[#2C3639] mb-2"
            >
              카테고리
            </label>
            <select
              id="category"
              className={`w-full p-3 border rounded-lg bg-white text-[#2C3639] focus:outline-none focus:ring-2 focus:ring-[#E8AA9B] focus:border-[#E8AA9B] transition-colors ${
                errors.category ? "border-red-500" : "border-[#DED0C3]"
              }`}
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errors.category) {
                  setErrors({ ...errors, category: "" });
                }
              }}
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="outline"
              onClick={handleModalClose}
              className="border-[#DED0C3] hover:bg-[#FDF8F3] text-[#2C3639]"
            >
              취소
            </Button>
            <Button
              onClick={handleSaveQuestion}
              className="bg-[#E8AA9B] hover:bg-[#E09686] text-white shadow-md"
            >
              {editingQuestion ? "수정" : "저장"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="카테고리 관리"
        className="max-w-md bg-[#FDF8F3]"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="새 카테고리 입력"
              className="flex-1 p-2 border border-[#DED0C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8AA9B] focus:border-[#E8AA9B]"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addCategory();
                }
              }}
            />
            <Button
              onClick={addCategory}
              className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
            >
              추가
            </Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#DED0C3]"
              >
                <span className="text-[#2C3639]">{category}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(category)}
                  className="text-[#5C6B73] hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
