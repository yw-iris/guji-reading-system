// ===== 异体字/繁简字/通假字/OCR常见错误映射表 =====
// 用于修正 CADAL 古籍 OCR 识别中常见的错字

export interface VariantChar {
  original: string;    // 异体字/原字
  standard: string;    // 标准简体字
  pinyin: string;      // 拼音
  category: 'variant' | 'tongjia' | 'common_error'; // 异体字/通假字/常见OCR错误
  frequency: 'high' | 'medium' | 'low'; // 出现频率
}

export const variantCharMap: Record<string, VariantChar> = {
  // ===== 常见异体字 =====
  '羣': { original: '羣', standard: '群', pinyin: 'qún', category: 'variant', frequency: 'high' },
  '峯': { original: '峯', standard: '峰', pinyin: 'fēng', category: 'variant', frequency: 'high' },
  '爲': { original: '爲', standard: '为', pinyin: 'wéi', category: 'variant', frequency: 'high' },
  '衆': { original: '衆', standard: '众', pinyin: 'zhòng', category: 'variant', frequency: 'high' },
  '卽': { original: '卽', standard: '即', pinyin: 'jí', category: 'variant', frequency: 'high' },
  '旣': { original: '旣', standard: '既', pinyin: 'jì', category: 'variant', frequency: 'high' },
  '歎': { original: '歎', standard: '叹', pinyin: 'tàn', category: 'variant', frequency: 'medium' },
  '慙': { original: '慙', standard: '惭', pinyin: 'cán', category: 'variant', frequency: 'medium' },
  '牀': { original: '牀', standard: '床', pinyin: 'chuáng', category: 'variant', frequency: 'high' },
  '畝': { original: '畝', standard: '亩', pinyin: 'mǔ', category: 'variant', frequency: 'medium' },
  '體': { original: '體', standard: '体', pinyin: 'tǐ', category: 'variant', frequency: 'high' },
  '塵': { original: '塵', standard: '尘', pinyin: 'chén', category: 'variant', frequency: 'medium' },
  '衹': { original: '衹', standard: '只', pinyin: 'zhǐ', category: 'variant', frequency: 'high' },
  '卻': { original: '卻', standard: '却', pinyin: 'què', category: 'variant', frequency: 'high' },
  '閒': { original: '閒', standard: '间', pinyin: 'jiān', category: 'variant', frequency: 'medium' },
  '峽': { original: '峽', standard: '峡', pinyin: 'xiá', category: 'variant', frequency: 'medium' },
  '灋': { original: '灋', standard: '法', pinyin: 'fǎ', category: 'variant', frequency: 'low' },
  '逈': { original: '逈', standard: '迥', pinyin: 'jiǒng', category: 'variant', frequency: 'low' },
  '廻': { original: '廻', standard: '回', pinyin: 'huí', category: 'variant', frequency: 'low' },
  '蹤': { original: '蹤', standard: '踪', pinyin: 'zōng', category: 'variant', frequency: 'medium' },
  '恠': { original: '恠', standard: '怪', pinyin: 'guài', category: 'variant', frequency: 'low' },
  '甞': { original: '甞', standard: '尝', pinyin: 'cháng', category: 'variant', frequency: 'low' },

  // ===== 通假字 =====
  '説': { original: '説', standard: '悦', pinyin: 'yuè', category: 'tongjia', frequency: 'high' },
  '女': { original: '女', standard: '汝', pinyin: 'rǔ', category: 'tongjia', frequency: 'medium' },
  '見': { original: '見', standard: '现', pinyin: 'xiàn', category: 'tongjia', frequency: 'high' },
  '反': { original: '反', standard: '返', pinyin: 'fǎn', category: 'tongjia', frequency: 'high' },
  '知': { original: '知', standard: '智', pinyin: 'zhì', category: 'tongjia', frequency: 'medium' },
  '被': { original: '被', standard: '披', pinyin: 'pī', category: 'tongjia', frequency: 'medium' },
  '生': { original: '生', standard: '性', pinyin: 'xìng', category: 'tongjia', frequency: 'medium' },
  '屬': { original: '屬', standard: '嘱', pinyin: 'zhǔ', category: 'tongjia', frequency: 'high' },
  '坐': { original: '坐', standard: '座', pinyin: 'zuò', category: 'tongjia', frequency: 'medium' },
  '內': { original: '內', standard: '纳', pinyin: 'nà', category: 'tongjia', frequency: 'medium' },

  // ===== OCR 常见错误 =====
  '巳': { original: '巳', standard: '已', pinyin: 'yǐ', category: 'common_error', frequency: 'high' },
  '曰': { original: '曰', standard: '日', pinyin: 'rì', category: 'common_error', frequency: 'high' },
  '末': { original: '末', standard: '未', pinyin: 'wèi', category: 'common_error', frequency: 'high' },
  '土': { original: '土', standard: '士', pinyin: 'shì', category: 'common_error', frequency: 'medium' },
  '干': { original: '干', standard: '千', pinyin: 'qiān', category: 'common_error', frequency: 'medium' },
  '人': { original: '人', standard: '入', pinyin: 'rù', category: 'common_error', frequency: 'medium' },
  '大': { original: '大', standard: '太', pinyin: 'tài', category: 'common_error', frequency: 'low' },
  '夭': { original: '夭', standard: '天', pinyin: 'tiān', category: 'common_error', frequency: 'low' },
};

/**
 * 修正文本中的异体字、通假字和 OCR 常见错误
 * @param text 原始文本
 * @returns 修正后的文本
 */
export function correctVariantText(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [original, info] of Object.entries(variantCharMap)) {
    if (result.includes(original)) {
      result = result.split(original).join(info.standard);
    }
  }
  return result;
}

/**
 * 获取某个字符的异体字信息
 * @param char 要查询的字符
 * @returns 如果该字符在异体字表中，返回对应信息；否则返回 null
 */
export function getCharInfo(char: string): VariantChar | null {
  return variantCharMap[char] ?? null;
}
