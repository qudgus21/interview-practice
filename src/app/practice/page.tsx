"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InterviewQuestion } from "@/types/interview";
import { Mic, MicOff, Play, Pause, SkipForward } from "lucide-react";
import { Navigation } from "@/components/navigation";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function PracticePage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<InterviewQuestion | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(
    null
  );
  const timerRef = useRef<NodeJS.Timeout>();
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    clearTranscriptOnListen: false,
  });

  useEffect(() => {
    const savedQuestions = localStorage.getItem("interviewQuestions");
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    speechSynthesisRef.current = window.speechSynthesis;

    // 브라우저 지원 여부 확인
    if (!browserSupportsSpeechRecognition) {
      setMicPermissionError(
        "이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 브라우저를 사용해주세요."
      );
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const speakQuestion = (text: string) => {
    if (speechSynthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const getRandomQuestion = () => {
    const weights = {
      high: 0.6,
      medium: 0.3,
      low: 0.1,
    };

    const totalWeight = questions.reduce(
      (sum, q) => sum + weights[q.priority],
      0
    );
    let random = Math.random() * totalWeight;

    for (const question of questions) {
      random -= weights[question.priority];
      if (random <= 0) {
        return question;
      }
    }

    return questions[0];
  };

  const startPractice = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setTimer(0);
    setIsTimerRunning(true);
    speakQuestion(question.question);
  };

  const stopPractice = () => {
    setIsTimerRunning(false);
    setTimer(0);
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
  };

  const nextQuestion = () => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setTimer(0);
    resetTranscript();
    speakQuestion(question.question);
  };

  const startRecording = async () => {
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // 권한 확인 후 스트림 종료

      setMicPermissionError(null);
      if (typeof SpeechRecognition.startListening === "function") {
        await SpeechRecognition.startListening({
          continuous: true,
          language: "ko-KR",
        });
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicPermissionError(
        "마이크 사용 권한이 필요합니다. 브라우저의 권한 설정을 확인해주세요."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (typeof SpeechRecognition.stopListening === "function") {
      SpeechRecognition.stopListening();
    }
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto p-4">
      <Navigation />
      <div className="mt-16">
        <h1 className="text-2xl font-bold mb-4">면접 연습</h1>

        {micPermissionError && (
          <div className="mb-4 p-4 border rounded-md bg-red-50 text-red-700">
            {micPermissionError}
          </div>
        )}

        {!currentQuestion ? (
          <Button onClick={startPractice} className="w-full">
            연습 시작
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-2">
                {currentQuestion.question}
              </h2>
              <p className="text-gray-600">{currentQuestion.answer}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-mono">{formatTime(timer)}</div>
              <div className="flex gap-2">
                {isTimerRunning ? (
                  <Button variant="outline" onClick={stopPractice}>
                    <Pause className="mr-2 h-4 w-4" />
                    일시정지
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsTimerRunning(true)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    재개
                  </Button>
                )}
                <Button onClick={nextQuestion}>
                  <SkipForward className="mr-2 h-4 w-4" />
                  다음 질문
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              {isRecording ? (
                <Button variant="destructive" onClick={stopRecording}>
                  <MicOff className="mr-2 h-4 w-4" />
                  녹음 중지
                </Button>
              ) : (
                <Button onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  답변하기
                </Button>
              )}

              <div className="w-full p-4 border rounded-md bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">내 답변:</h3>
                  {listening && (
                    <span className="text-sm text-green-600">
                      음성 인식 중...
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap min-h-[100px]">
                  {transcript || "여기에 답변이 표시됩니다."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
