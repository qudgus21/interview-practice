"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Mic, MicOff, RotateCcw, Pause, Play, BookOpen, X } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { PracticeHistory, PracticeRecord } from "@/types/interview";

interface InterviewQuestion {
  question: string;
  answer: string;
  category: string;
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
  const [allQuestions, setAllQuestions] = useState<InterviewQuestion[]>([]);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [isRandomOrder, setIsRandomOrder] = useState(true);
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("practiceHistory");
        return saved
          ? JSON.parse(saved)
          : { records: [], lastUpdated: Date.now() };
      }
      return { records: [], lastUpdated: Date.now() };
    }
  );

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // 더미 데이터 상태를 컴포넌트 최상단에서 선언
  const dummyQuestions: InterviewQuestion[] = [
    {
      question: "자기소개를 해주세요.",
      answer: "안녕하세요, 저는 ...",
      category: "자기소개",
    },
    {
      question: "지원동기는 무엇인가요?",
      answer: "저는 ... 때문에 지원하게 되었습니다.",
      category: "지원동기",
    },
    {
      question: "본인의 장단점은 무엇인가요?",
      answer: "저의 장점은 ... 단점은 ...",
      category: "장단점",
    },
  ];
  const [dummyIndex, setDummyIndex] = useState(0);
  const [showDummyAnswer, setShowDummyAnswer] = useState(false);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    const savedCategories = localStorage.getItem("interviewCategories");

    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      setAllQuestions(parsedQuestions);
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
    // @ts-ignore
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    // @ts-ignore
    SpeechRecognition.stopListening();
  };

  const togglePause = () => {
    if (isPaused) {
      // @ts-ignore
      SpeechRecognition.startListening({ continuous: true });
    } else {
      // @ts-ignore
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
    savePracticeRecord();
    setShowCompletion(true);
    // 3초 후에 피드백 페이지로 이동
    setTimeout(() => {
      window.location.href = "/feedback";
    }, 3000);
  };

  const handleCategoryConfirm = () => {
    let filteredQuestions = allQuestions;
    if (selectedCategories.length < categories.length) {
      filteredQuestions = allQuestions.filter((q) =>
        selectedCategories.includes(q.category)
      );
    }
    const shuffledQuestions = [...filteredQuestions].sort(
      () => Math.random() - 0.5
    );
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setCurrentQuestion(shuffledQuestions[0]?.question || "");
    setShowCategoryModal(false);
  };

  const handleRestartInterview = () => {
    let filteredQuestions = allQuestions;
    if (selectedCategories.length < categories.length) {
      filteredQuestions = allQuestions.filter((q) =>
        selectedCategories.includes(q.category)
      );
    }
    const questionsToUse = isRandomOrder
      ? [...filteredQuestions].sort(() => Math.random() - 0.5)
      : filteredQuestions;
    setQuestions(questionsToUse);
    setCurrentIndex(0);
    setCurrentQuestion(questionsToUse[0]?.question || "");
    setShowAnswer(false);
    resetPractice();
    setShowRestartModal(false);
  };

  // 연습 기록 저장 함수
  const savePracticeRecord = useCallback(() => {
    if (!currentQuestion) return;

    // 현재 문항의 시도 횟수 계산
    const questionAttempts = practiceHistory.records.filter(
      (record) => record.questionId === currentQuestion
    ).length;

    const newRecord: PracticeRecord = {
      questionId: currentQuestion,
      category: questions[currentIndex]?.category || "",
      question: questions[currentIndex]?.question || "",
      timestamp: Date.now(),
      duration: timer, // 현재 타이머 값
      attempt: questionAttempts + 1,
    };

    const newHistory: PracticeHistory = {
      records: [...practiceHistory.records, newRecord],
      lastUpdated: Date.now(),
    };

    setPracticeHistory(newHistory);
    localStorage.setItem("practiceHistory", JSON.stringify(newHistory));
  }, [currentQuestion, currentIndex, questions, timer, practiceHistory]);

  // 다음 질문으로 넘어갈 때 기록 저장
  const handleNextQuestion = () => {
    savePracticeRecord();
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestion(questions[nextIndex].question);
        return nextIndex;
      }
      setShowCompletion(true);
      return prev;
    });
    resetPractice();
  };

  // 질문이 없을 때 더미 데이터로 대체
  if (!isLoading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <Navigation />
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="mt-25">
            <div className="text-center md:text-left mb-12">
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C3639] mb-2">
                연습할 질문이 없습니다
              </h1>
              <p className="text-[#5C6B73] mb-6">
                아래는 예시 질문입니다. <br />
                나만의 질문을 추가하려면 <b>질문 관리</b>로 이동해 주세요!
              </p>
              <a
                href="/questions"
                className="inline-block bg-[#E8AA9B] hover:bg-[#E09686] text-white font-semibold rounded-lg px-6 py-3 transition-colors shadow-md mb-8"
              >
                질문 관리로 이동
              </a>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 mb-6 max-w-xl mx-auto">
              <h2 className="text-xl font-semibold text-[#2C3639] mb-4">
                예시 질문
              </h2>
              <p className="text-lg text-[#5C6B73] mb-6">
                {dummyQuestions[dummyIndex].question}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-[#5C6B73]">
                  {dummyIndex + 1} / {dummyQuestions.length}
                </div>
                {dummyIndex < dummyQuestions.length - 1 ? (
                  <Button
                    onClick={() => setDummyIndex(dummyIndex + 1)}
                    className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                  >
                    다음 질문
                  </Button>
                ) : (
                  <Button
                    onClick={() => setDummyIndex(0)}
                    className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
                  >
                    처음부터 다시
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 mb-6 max-w-xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2C3639]">
                  모범답안
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDummyAnswer(!showDummyAnswer)}
                  className="flex items-center space-x-1"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>모범답안 보기</span>
                </Button>
              </div>
              <div className="min-h-[100px] p-4 bg-[#FDF8F3] rounded-lg border border-[#DED0C3] mb-4">
                <p className="text-[#5C6B73] whitespace-pre-line">
                  {showDummyAnswer
                    ? dummyQuestions[dummyIndex].answer
                    : "모범답안을 보려면 버튼을 클릭하세요."}
                </p>
              </div>
            </div>

            {/* 페이지 기능 설명 섹션 */}
            <div className="mt-16 space-y-8">
              <div className="bg-white p-8 rounded-xl border border-[#DED0C3] shadow-sm hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-bold text-[#2C3639] mb-6 relative inline-block">
                  면접 연습 기능
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8AA9B] to-[#FDF8F3] rounded-full"></span>
                </h2>

                <div className="space-y-8">
                  <div className="group">
                    <h3 className="text-lg font-semibold text-[#2C3639] mb-3 flex items-center">
                      <span className="w-2 h-2 bg-[#E8AA9B] rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                      실전 면접 연습
                    </h3>
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                      <p className="text-[#5C6B73] leading-relaxed space-y-2">
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          실제 면접처럼 질문을 보고 답변을 연습할 수 있습니다.
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          음성 인식을 통해 답변을 녹음하고 확인할 수 있습니다.
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          타이머 기능으로 답변 시간을 관리할 수 있습니다.
                        </span>
                      </p>
                      <div className="mt-4 p-4 bg-white rounded-lg border border-[#DED0C3]">
                        <h4 className="font-medium text-[#2C3639] mb-2">
                          예시 사용법:
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <span className="text-[#E8AA9B] mr-2">1.</span>
                            <span className="text-[#5C6B73]">
                              질문을 읽고 답변을 준비합니다.
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#E8AA9B] mr-2">2.</span>
                            <span className="text-[#5C6B73]">
                              마이크 버튼을 눌러 답변을 녹음합니다.
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#E8AA9B] mr-2">3.</span>
                            <span className="text-[#5C6B73]">
                              답변 후 모범 답안을 확인하고 피드백을 받습니다.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <h3 className="text-lg font-semibold text-[#2C3639] mb-3 flex items-center">
                      <span className="w-2 h-2 bg-[#E8AA9B] rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                      카테고리별 연습
                    </h3>
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                      <p className="text-[#5C6B73] leading-relaxed space-y-2">
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          원하는 카테고리의 질문만 선택하여 연습할 수 있습니다.
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          기술 면접, 인성 면접 등 유형별로 구분하여 연습
                          가능합니다.
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          랜덤 순서로 질문을 섞어 실제 면접처럼 연습할 수
                          있습니다.
                        </span>
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                          <h4 className="font-medium text-[#2C3639]">
                            기술 면접
                          </h4>
                          <p className="text-sm text-[#5C6B73]">
                            프론트엔드, 백엔드, CS 관련 질문
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                          <h4 className="font-medium text-[#2C3639]">
                            인성 면접
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
                      연습 기록 관리
                    </h3>
                    <div className="bg-[#FDF8F3] p-4 rounded-lg border border-[#DED0C3] group-hover:border-[#E8AA9B] transition-colors duration-300">
                      <p className="text-[#5C6B73] leading-relaxed space-y-2">
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          각 질문별 연습 기록이 자동으로 저장됩니다.
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          답변 시간, 시도 횟수 등 상세한 기록을 확인할 수
                          있습니다.
                        </span>
                        <span className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#E8AA9B] rounded-full mr-2"></span>
                          피드백 페이지에서 전체 연습 기록을 확인할 수 있습니다.
                        </span>
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                          <span className="text-[#E8AA9B] mr-3">⏱️</span>
                          <span className="text-[#5C6B73]">
                            각 질문별 답변 시간 기록
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                          <span className="text-[#E8AA9B] mr-3">📊</span>
                          <span className="text-[#5C6B73]">
                            카테고리별 연습 통계 확인
                          </span>
                        </div>
                        <div className="flex items-center p-3 bg-white rounded-lg border border-[#DED0C3] hover:border-[#E8AA9B] transition-colors duration-300">
                          <span className="text-[#E8AA9B] mr-3">📈</span>
                          <span className="text-[#5C6B73]">
                            연습 진행 상황 모니터링
                          </span>
                        </div>
                      </div>
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
        <div className="mt-25">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="text-center md:text-left w-full md:w-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C3639] mb-2">
                실전 면접 연습
              </h1>
              <p className="text-sm md:text-base text-[#5C6B73]">
                음성 인식을 활용한 실전 면접 연습을 시작하세요
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryModal(true)}
                  className="flex-1 md:flex-initial flex items-center justify-center space-x-2"
                >
                  <span>카테고리 설정</span>
                  <span className="text-sm text-[#5C6B73]">
                    ({selectedCategories.length}개 선택)
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRestartModal(true)}
                  className="flex-1 md:flex-initial flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>면접 재시작</span>
                </Button>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#2C3639] w-full md:w-auto text-center">
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
                      onClick={handleNextQuestion}
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
                      수고하셨습니다. 분석 페이지로 이동합니다...
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
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowCategoryModal(false)}
              >
                <div
                  className="bg-white rounded-lg p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
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
                        <span className="text-[#5C6B73]">{category}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCategoryConfirm}
                      className={`w-full ${
                        selectedCategories.length > 0
                          ? "bg-[#D67D6A] hover:bg-[#C46A57] text-white font-medium shadow-sm"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={selectedCategories.length === 0}
                    >
                      면접 시작하기
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Restart Interview Modal */}
            {showRestartModal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowRestartModal(false)}
              >
                <div
                  className="bg-white rounded-lg p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#2C3639]">
                      면접 재시작
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRestartModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <p className="text-[#5C6B73]">
                      현재 선택된 카테고리의 질문 세트로 면접을 재시작합니다.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#2C3639]">
                        질문 순서
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant={isRandomOrder ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsRandomOrder(true)}
                          className={`flex-1 ${
                            isRandomOrder
                              ? "bg-[#D67D6A] hover:bg-[#C46A57] text-white"
                              : ""
                          }`}
                        >
                          랜덤 순서
                        </Button>
                        <Button
                          variant={!isRandomOrder ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIsRandomOrder(false)}
                          className={`flex-1 ${
                            !isRandomOrder
                              ? "bg-[#D67D6A] hover:bg-[#C46A57] text-white"
                              : ""
                          }`}
                        >
                          정배열
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleRestartInterview}
                    className="w-full bg-[#D67D6A] hover:bg-[#C46A57] text-white font-medium shadow-sm"
                  >
                    재시작
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
