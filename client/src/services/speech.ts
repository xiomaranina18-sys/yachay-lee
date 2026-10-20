// Web Speech API Service for Yachay Lee

export const speechService = {
  isSynthesisSupported: (): boolean => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  isRecognitionSupported: (): boolean => {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  },

  speak: (text: string, options: { rate?: number; pitch?: number; onEnd?: () => void } = {}): void => {
    if (!speechService.isSynthesisSupported()) {
      console.warn('Speech synthesis no soportado en este navegador.');
      return;
    }

    window.speechSynthesis.cancel(); // Detener cualquier reproducción previa

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-PE'; // Español Perú / Neutro
    utterance.rate = options.rate || 0.85; // Velocidad ligeramente pausada para aprendizaje infantil
    utterance.pitch = options.pitch || 1.1; // Tono amigable y claro

    // Intentar buscar una voz en español
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') || v.name.includes('Spanish'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stop: (): void => {
    if (speechService.isSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  },

  listen: (callbacks: {
    onResult: (transcript: string) => void;
    onError?: (error: any) => void;
    onEnd?: () => void;
  }): { stop: () => void } | null => {
    if (!speechService.isRecognitionSupported()) {
      if (callbacks.onError) callbacks.onError('Speech recognition no soportado.');
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      callbacks.onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      if (callbacks.onError) callbacks.onError(event.error);
    };

    recognition.onend = () => {
      if (callbacks.onEnd) callbacks.onEnd();
    };

    recognition.start();

    return {
      stop: () => recognition.stop()
    };
  }
};
