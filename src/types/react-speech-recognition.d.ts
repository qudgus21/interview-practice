declare module "react-speech-recognition" {
  interface SpeechRecognitionOptions {
    continuous?: boolean;
    language?: string;
    interimResults?: boolean;
    maxAlternatives?: number;
  }

  interface SpeechRecognitionHook {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  }

  export function useSpeechRecognition(
    options?: SpeechRecognitionOptions
  ): SpeechRecognitionHook;
  export const SpeechRecognition: {
    startListening: (options?: SpeechRecognitionOptions) => void;
    stopListening: () => void;
    abortListening: () => void;
  };
}
