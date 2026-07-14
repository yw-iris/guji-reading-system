import { useCallback, useEffect, useState } from 'react';
import {
  cancelSpeech, initSpeech, isSpeechSupported, speak, type SpeakOptions,
} from '../utils/speech';

export interface UseSpeechResult {
  supported: boolean;
  speakingKey: string | null;
  /** 朗读某句；用 key 标识当前正在读的内容，再次传同一 key 即停止（点读切换） */
  say: (key: string, text: string, opts?: SpeakOptions) => void;
  stop: () => void;
  isSpeaking: (key: string) => boolean;
}

export function useSpeech(): UseSpeechResult {
  const [supported] = useState(() => {
    initSpeech();
    return isSpeechSupported();
  });
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const say = useCallback(
    (key: string, text: string, opts?: SpeakOptions) => {
      if (!supported) return;
      if (speakingKey === key) {
        cancelSpeech();
        setSpeakingKey(null);
        return;
      }
      speak(text, {
        ...opts,
        onStart: () => { setSpeakingKey(key); opts?.onStart?.(); },
        onEnd: () => { setSpeakingKey(null); opts?.onEnd?.(); },
        onError: (e) => { setSpeakingKey(null); opts?.onError?.(e); },
      });
    },
    [supported, speakingKey],
  );

  const stop = useCallback(() => {
    cancelSpeech();
    setSpeakingKey(null);
  }, []);

  // 卸载时停掉朗读，避免离开页面后仍在后台发声
  useEffect(() => () => cancelSpeech(), []);

  const isSpeaking = useCallback((key: string) => speakingKey === key, [speakingKey]);

  return { supported, speakingKey, say, stop, isSpeaking };
}
