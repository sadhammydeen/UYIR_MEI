import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from './SessionContext';

// Add type declarations for the Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

type VoiceContextType = {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  cancelSpeech: () => void;
  isSpeaking: boolean;
  isVoiceSupported: boolean;
  error: string | null;
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const { logActivity } = useSession();

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        logActivity('voice_recognition_started');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        logActivity('voice_recognition_ended');
      };
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcriptArr: string[] = [];
        for (let i = 0; i < event.results.length; i++) {
          transcriptArr.push(event.results[i][0].transcript);
        }
        const currentTranscript = transcriptArr.join('');
        setTranscript(currentTranscript);
        
        if (event.results[0].isFinal) {
          logActivity('voice_input_processed', { transcript: currentTranscript });
        }
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        logActivity('voice_recognition_error', { error: event.error });
      };
      
      setRecognition(recognitionInstance);
      setIsVoiceSupported(true);
    } else {
      setError('Speech recognition is not supported in this browser.');
      setIsVoiceSupported(false);
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [logActivity]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setTranscript('');
        recognition.start();
      } catch (err) {
        setError('Error starting speech recognition');
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        logActivity('text_to_speech_started', { text });
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        logActivity('text_to_speech_ended');
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
        logActivity('text_to_speech_error', { error: event.error });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      setError('Speech synthesis is not supported in this browser.');
    }
  }, [logActivity]);

  const cancelSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      logActivity('text_to_speech_cancelled');
    }
  }, [logActivity]);

  return (
    <VoiceContext.Provider value={{
      isListening,
      transcript,
      startListening,
      stopListening,
      speak,
      cancelSpeech,
      isSpeaking,
      isVoiceSupported,
      error
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export default VoiceProvider; 