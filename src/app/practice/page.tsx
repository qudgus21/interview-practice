"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Mic, MicOff, RotateCcw, Pause, Play, BookOpen, X } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface InterviewQuestion {
  question: string;
  answer: string;
  category: string;
}

interface Category {
  name: string;
}

export default function PracticePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    const savedCategories = localStorage.getItem("interviewCategories");

    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      const shuffledQuestions = [...parsedQuestions].sort(
        () => Math.random() - 0.5
      );
      setQuestions(shuffledQuestions);
      setCurrentQuestion(shuffledQuestions[0]?.question || "");
    }

    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setCategories(parsedCategories);
      setSelectedCategories(parsedCategories);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && selectedCategories.length > 0) {
      let filteredQuestions = questions;
      if (selectedCategories.length < categories.length) {
        filteredQuestions = questions.filter((q) =>
          selectedCategories.includes(q.category)
        );
      }
      const shuffledQuestions = [...filteredQuestions].sort(
        () => Math.random() - 0.5
      );
      setQuestions(shuffledQuestions);
      setCurrentIndex(0);
      setCurrentQuestion(shuffledQuestions[0]?.question || "");
    }
  }, [selectedCategories]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  useEffect(() => {
    // 음성 인식 지원 여부 확인 후 로딩 상태 변경
    setIsLoading(false);
  }, [browserSupportsSpeechRecognition]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    SpeechRecognition.stopListening();
  };

  const togglePause = () => {
    if (isPaused) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
    setIsPaused(!isPaused);
  };

  const resetPractice = () => {
    setTimer(0);
    resetTranscript();
    setIsRecording(false);
    setIsPaused(false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestion(questions[currentIndex + 1].question);
      resetPractice();
      setShowAnswer(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories(categories);
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleComplete = () => {
    setShowCompletion(true);
    // 3초 후에 홈으로 이동
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Navigation />
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-[#2C3639] mb-4">
              음성 인식 지원 여부를 확인 중입니다...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Navigation />
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-[#2C3639] mb-4">
              브라우저가 음성 인식을 지원하지 않습니다.
            </h1>
            <p className="text-[#5C6B73]">
              Chrome, Edge, Safari 등의 최신 브라우저를 사용해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Navigation />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3639] mb-2">
                실전 면접 연습
              </h1>
              <p className="text-[#5C6B73]">
                음성 인식을 활용한 실전 면접 연습을 시작하세요
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center space-x-2"
              >
                <span>카테고리 설정</span>
                <span className="text-sm text-[#5C6B73]">
                  ({selectedCategories.length}개 선택)
                </span>
              </Button>
              <div className="text-3xl font-bold text-[#2C3639]">
                {formatTime(timer)}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#2C3639] mb-4">
                  현재 질문
                </h2>
                <p className="text-lg text-[#5C6B73] mb-6">{currentQuestion}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-[#5C6B73]">
                    {currentIndex + 1} / {questions.length}
                  </div>
                  {currentIndex < questions.length - 1 ? (
                    <Button
                      onClick={nextQuestion}
                      className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                    >
                      다음 질문
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
                    >
                      면접 완료
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#2C3639]">
                    답변 내용
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center space-x-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>모범답안 보기</span>
                  </Button>
                </div>
                <div className="min-h-[200px] p-4 bg-[#FDF8F3] rounded-lg border border-[#DED0C3] mb-4">
                  <p className="text-[#5C6B73] whitespace-pre-line">
                    {transcript || "음성 인식 결과가 여기에 표시됩니다."}
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      녹음 시작
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={togglePause}
                        className="bg-white text-[#2C3639] border border-[#DED0C3] hover:bg-[#FDF8F3]"
                      >
                        {isPaused ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            재개
                          </>
                        ) : (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            일시 정지
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={stopRecording}
                        className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                      >
                        <MicOff className="mr-2 h-4 w-4" />
                        녹음 중지
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={resetPractice}
                    className="bg-white text-[#2C3639] border border-[#DED0C3] hover:bg-[#FDF8F3]"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    초기화
                  </Button>
                </div>
              </div>
            </div>

            {/* Completion Animation */}
            {showCompletion && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full text-center animate-bounce">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#2C3639] mb-2">
                      면접 완료!
                    </h2>
                    <p className="text-[#5C6B73]">
                      수고하셨습니다. 홈으로 이동합니다...
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#4CAF50] h-2.5 rounded-full animate-progress"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category Selection Modal */}
            {showCategoryModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#2C3639]">
                      카테고리 선택
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCategoryModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllCategories}
                      >
                        전체 선택
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAllCategories}
                      >
                        전체 해제
                      </Button>
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2 p-2 hover:bg-[#FDF8F3] rounded-lg cursor-pointer"
                        onClick={() => toggleCategory(category)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => {}}
                          className="h-4 w-4 text-[#E8AA9B] border-[#DED0C3] rounded focus:ring-[#E8AA9B]"
                        />
                        <span className="text-[#263339]">{category}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowCategoryModal(false)}
                    className="w-full bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                  >
                    확인
                  </Button>
                </div>
              </div>
            )}

            {/* Sidebar */}
            <div
              className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg border-l border-[#DED0C3] transition-transform duration-300 ease-in-out transform z-50 ${
                showAnswer ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-[#DED0C3]">
                  <h2 className="text-xl font-semibold text-[#2C3639]">
                    모범답안
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnswer(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="bg-[#FDF8F3] p-4 rounded-lg">
                    <p className="text-[#5C6B73] whitespace-pre-wrap">
                      {questions[currentIndex]?.answer ||
                        "모범답안이 없습니다."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
