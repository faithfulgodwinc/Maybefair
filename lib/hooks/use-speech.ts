'use client'

import { useState, useEffect, useRef } from 'react';

interface UseSpeechOptions {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
}

export function useSpeech(options?: UseSpeechOptions) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Check if Web Speech API is supported
        setIsSupported('speechSynthesis' in window);

        return () => {
            // Cleanup: stop speaking when component unmounts
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = (text: string) => {
        if (!isSupported) {
            options?.onError?.(new Error('Speech synthesis not supported'));
            return;
        }

        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.onstart = () => {
            setIsSpeaking(true);
            options?.onStart?.();
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            options?.onEnd?.();
        };

        utterance.onerror = (event) => {
            setIsSpeaking(false);
            options?.onError?.(new Error(event.error));
        };

        // Configure voice settings
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume

        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const pause = () => {
        if (window.speechSynthesis && isSpeaking) {
            window.speechSynthesis.pause();
        }
    };

    const resume = () => {
        if (window.speechSynthesis && isSpeaking) {
            window.speechSynthesis.resume();
        }
    };

    return {
        speak,
        stop,
        pause,
        resume,
        isSpeaking,
        isSupported,
    };
}
