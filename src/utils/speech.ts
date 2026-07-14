// 浏览器原生语音合成（Web Speech API）封装 —— 中文朗读，零依赖、离线可用。
// 用于「小学生跟读」场景：每句点读 + 全文自动朗读。

let zhVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    // 优先选择中文（普通话）语音，其次任意中文语种，再次任意含 "Chinese" 的语音
    zhVoice =
      voices.find((v) => v.lang === 'zh-CN' && /Chinese|普通话|Mandarin/i.test(v.name)) ||
      voices.find((v) => v.lang === 'zh-CN') ||
      voices.find((v) => /^zh/i.test(v.lang)) ||
      null;
    voicesLoaded = true;
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// 在应用挂载时调用一次，预加载语音列表（部分浏览器异步返回 getVoices）
export function initSpeech() {
  if (!isSpeechSupported()) return;
  loadVoices();
  if (!voicesLoaded && typeof window.speechSynthesis.onvoiceschanged === 'undefined') {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (e?: Error) => void;
}

// 朗读一段文本（会自动停掉上一句）
export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!isSpeechSupported() || !text) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    if (zhVoice) u.voice = zhVoice;
    u.rate = opts.rate ?? 0.85; // 偏慢，适合小学生跟读
    u.pitch = opts.pitch ?? 1.12; // 略微上扬，更亲切
    u.volume = opts.volume ?? 1;
    if (opts.onStart) u.onstart = opts.onStart;
    if (opts.onEnd) u.onend = opts.onEnd;
    if (opts.onError) u.onerror = () => opts.onError?.();
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function cancelSpeech() {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
