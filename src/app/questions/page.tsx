"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  InterviewQuestion,
  Category,
  generateRandomColor,
} from "@/types/interview";
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
  const [isMounted, setIsMounted] = useState(false);
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
  const [categories, setCategories] = useState<Category[]>([]);
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
    setIsMounted(true);
    const savedQuestions = localStorage.getItem("interviewQuestions");
    const savedCategories = localStorage.getItem("interviewCategories");

    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setCategories(
        parsedCategories.map((name: string) => ({
          name,
          color: generateRandomColor([]),
        }))
      );
    }
  }, []);

  const saveQuestions = (newQuestions: InterviewQuestion[]) => {
    setQuestions(newQuestions);
    localStorage.setItem("interviewQuestions", JSON.stringify(newQuestions));
  };

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(
      "interviewCategories",
      JSON.stringify(newCategories.map((category) => category.name))
    );
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
    if (
      newCategory.trim() &&
      !categories.some((c) => c.name === newCategory.trim())
    ) {
      const newCategories = [
        {
          name: newCategory.trim(),
          color: generateRandomColor(categories.map((c) => c.color)),
        },
        ...categories,
      ];
      saveCategories(newCategories);
      setNewCategory("");
    }
  };

  const deleteCategory = (categoryName: string) => {
    const updatedCategories = categories.filter((c) => c.name !== categoryName);
    saveCategories(updatedCategories);
    // 해당 카테고리의 질문들의 카테고리를 빈 문자열로 설정
    const updatedQuestions = questions.map((q) =>
      q.category === categoryName ? { ...q, category: "" } : q
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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mt-25">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3639] mb-2">
                면접 질문 관리
              </h1>
              <p className="text-[#5C6B73]">
                면접 질문과 모범 답안을 관리하세요
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center space-x-2 flex-1 md:flex-initial"
                >
                  <Tag className="h-4 w-4" />
                  <span>카테고리 관리</span>
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#E8AA9B] hover:bg-[#E09686] text-white flex-1 md:flex-initial"
                >
                  <Plus className="mr-2 h-4 w-4" />새 질문 추가
                </Button>
              </div>
              <CustomSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "all", label: "전체 카테고리" },
                  ...categories.map((category) => ({
                    value: category.name,
                    label: category.name,
                  })),
                ]}
                className="w-full md:w-[200px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredQuestions.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white p-6 rounded-lg border border-[#DED0C3] shadow-sm">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#FDF8F3] rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8 text-[#E8AA9B]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#2C3639] mb-2">
                        아직 질문이 없습니다
                      </h3>
                      <p className="text-[#5C6B73]">
                        새로운 면접 질문을 추가해보세요
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      질문 추가하기
                    </Button>
                  </div>
                </div>

                {/* 페이지 기능 설명 섹션 */}
                <div className="mt-16 space-y-8">
                  <div className="bg-white p-8 rounded-xl border border-[#DED0C3] shadow-sm hover:shadow-lg transition-all duration-300">
                    <h2 className="text-2xl font-bold text-[#2C3639] mb-6 relative inline-block">
                      면접 질문 관리 기능
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8AA9B] to-[#FDF8F3] rounded-full"></span>
                    </h2>

                    <div className="space-y-8">
                      <div className="group">
                        <h3 className="text-lg font-semibold text-[#2C3639] mb-3 flex items-center">
                          <span className="w-2 h-2 bg-[#E8AA9B] rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                          질문 추가하기
                        </h3>
                        <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                          <p className="text-[#5C6B73] leading-relaxed space-y-2">
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              상단의 '새 질문 추가' 버튼을 클릭하여 새로운 면접
                              질문을 추가할 수 있습니다.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              질문과 함께 모범 답안을 작성하여 저장할 수
                              있습니다.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              카테고리를 지정하여 질문을 체계적으로 관리할 수
                              있습니다.
                            </span>
                          </p>
                          <div className="mt-4 p-4 bg-white rounded-lg border border-[#DED0C3]">
                            <h4 className="font-medium text-[#2C3639] mb-2">
                              예시:
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <span className="text-[#E8AA9B] mr-2">•</span>
                                <span className="text-[#5C6B73]">
                                  질문: "React의 가상 DOM(Virtual DOM)에 대해
                                  설명해주세요."
                                </span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-[#E8AA9B] mr-2">•</span>
                                <span className="text-[#5C6B73]">
                                  답변: "가상 DOM은 실제 DOM의 가벼운
                                  복사본으로, React의 핵심 개념 중
                                  하나입니다..."
                                </span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-[#E8AA9B] mr-2">•</span>
                                <span className="text-[#5C6B73]">
                                  카테고리: "Frontend"
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <h3 className="text-lg font-semibold text-[#2C3639] mb-3 flex items-center">
                          <span className="w-2 h-2 bg-[#E8AA9B] rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                          카테고리 관리
                        </h3>
                        <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                          <p className="text-[#5C6B73] leading-relaxed space-y-2">
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              '카테고리 관리' 버튼을 통해 새로운 카테고리를
                              추가하거나 삭제할 수 있습니다.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              각 질문은 하나의 카테고리에 속할 수 있으며,
                              카테고리별로 질문을 필터링할 수 있습니다.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              카테고리는 면접 유형이나 주제별로 구분하여 사용할
                              수 있습니다.
                            </span>
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <h4 className="font-medium text-[#2C3639]">
                                Frontend
                              </h4>
                              <p className="text-sm text-[#5C6B73]">
                                React, Vue, JavaScript 관련 질문
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <h4 className="font-medium text-[#2C3639]">
                                Backend
                              </h4>
                              <p className="text-sm text-[#5C6B73]">
                                Node.js, Spring, 데이터베이스 관련 질문
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <h4 className="font-medium text-[#2C3639]">CS</h4>
                              <p className="text-sm text-[#5C6B73]">
                                자료구조, 알고리즘, 네트워크 관련 질문
                              </p>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <h4 className="font-medium text-[#2C3639]">
                                인성
                              </h4>
                              <p className="text-sm text-[#5C6B73]">
                                자기소개, 장단점, 지원동기 관련 질문
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <h3 className="text-lg font-semibold text-[#2C3639] mb-3 flex items-center">
                          <span className="w-2 h-2 bg-[#E8AA9B] rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                          질문 관리
                        </h3>
                        <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                          <p className="text-[#5C6B73] leading-relaxed space-y-2">
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              추가된 질문은 카드 형태로 표시되며, 드래그 앤
                              드롭으로 순서를 변경할 수 있습니다.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              각 질문 카드를 클릭하여 내용을 수정하거나 삭제할
                              수 있습니다.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              상단의 카테고리 필터를 사용하여 특정 카테고리의
                              질문만 볼 수 있습니다.
                            </span>
                          </p>
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <span className="text-[#E8AA9B] mr-3">1.</span>
                              <span className="text-[#5C6B73]">
                                질문 카드를 드래그하여 중요도 순으로 정렬
                              </span>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <span className="text-[#E8AA9B] mr-3">2.</span>
                              <span className="text-[#5C6B73]">
                                카테고리 필터에서 "Frontend" 선택 시 해당
                                카테고리의 질문만 표시
                              </span>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <span className="text-[#E8AA9B] mr-3">3.</span>
                              <span className="text-[#5C6B73]">
                                질문 카드 클릭 시 수정 모달이 열려 내용 수정
                                가능
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <h3 className="text-lg font-semibold text-[#2C3639] mb-3 flex items-center">
                          <span className="w-2 h-2 bg-[#E8AA9B] rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                          면접 준비 가이드
                        </h3>
                        <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                          <p className="text-[#5C6B73] leading-relaxed space-y-2">
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              기술 면접 준비: 주요 기술 스택과 관련된 질문들을
                              카테고리별로 정리하여 준비하세요.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              인성 면접 준비: 자기소개, 장단점, 지원 동기 등
                              일반적인 인성 면접 질문들을 준비하세요.
                            </span>
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                              실전 연습: 저장된 질문들을 바탕으로 실제 면접처럼
                              연습해보세요.
                            </span>
                          </p>
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <span className="text-[#E8AA9B] mr-3">💡</span>
                              <span className="text-[#5C6B73]">
                                카테고리별로 질문을 체계적으로 정리하여 준비
                              </span>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <span className="text-[#E8AA9B] mr-3">📊</span>
                              <span className="text-[#5C6B73]">
                                중요도 순으로 질문을 정렬하여 우선순위에 따라
                                학습
                              </span>
                            </div>
                            <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                              <span className="text-[#E8AA9B] mr-3">✍️</span>
                              <span className="text-[#5C6B73]">
                                모범 답안을 참고하여 자신만의 답변 스타일 개발
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
                      categories={categories}
                      onClick={() => handleEditQuestion(q)}
                      onDelete={() => deleteQuestion(q.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingQuestion ? "질문 수정" : "새 질문 추가"}
        className="max-w-4xl bg-[#FDF8F3] max-h-[70vh] md:max-h-[90vh] overflow-y-auto"
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
              className={`w-full p-3 border rounded-lg bg-white text-[#2C3639] focus:outline-none focus:ring-2 focus:ring-[#E8AA9B] focus:border-[#E8AA9B] transition-colors h-64 resize-none ${
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
                <option key={category.name} value={category.name}>
                  {category.name}
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
                key={category.name}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#DED0C3]"
              >
                <span className="text-[#2C3639]">{category.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(category.name)}
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
