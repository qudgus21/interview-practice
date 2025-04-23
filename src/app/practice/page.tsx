"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { Mic, MicOff, RotateCcw, Pause, Play, BookOpen } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

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

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      const shuffledQuestions = [...parsedQuestions].sort(
        () => Math.random() - 0.5
      );
      setQuestions(shuffledQuestions);
    }
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
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentIndex].question);
    }
  }, [questions, currentIndex]);

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
            <div className="text-3xl font-bold text-[#2C3639]">
              {formatTime(timer)}
            </div>
          </div>

          <div className="flex gap-6">
            <div
              className={`transition-all duration-300 ${
                showAnswer ? "w-2/3" : "w-full"
              }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#2C3639] mb-4">
                  현재 질문
                </h2>
                <p className="text-lg text-[#5C6B73] mb-6">{currentQuestion}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-[#5C6B73]">
                    {currentIndex + 1} / {questions.length}
                  </div>
                  <Button
                    onClick={nextQuestion}
                    className="bg-[#E8AA9B] hover:bg-[#E09686] text-white"
                    disabled={currentIndex >= questions.length - 1}
                  >
                    다음 질문
                  </Button>
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

            <div
              className={`transition-all duration-300 ${
                showAnswer
                  ? "w-1/3 opacity-100 translate-x-0"
                  : "w-0 opacity-0 translate-x-full"
              } overflow-hidden`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-[#DED0C3] p-6 h-fit">
                <h2 className="text-xl font-semibold text-[#2C3639] mb-4">
                  모범답안
                </h2>
                <div className="bg-[#FDF8F3] p-4 rounded-lg">
                  <p className="text-[#5C6B73] whitespace-pre-wrap">
                    {questions[currentIndex]?.answer || "모범답안이 없습니다."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
