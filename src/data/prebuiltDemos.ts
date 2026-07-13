// ===== 预存演示案例 - 离线/弱网容灾 fallback 数据 =====
// 当网络请求失败时，DemoPage 和 ReadingPage 使用此数据作为 fallback
import type { AncientText, TieredContent, StudyPoint, Exercise } from '../types';

export interface PrebuiltDemo {
  title: string;
  author: string;
  dynasty: string;
  cadalId: string;
  tieredContent: TieredContent;
  studyPoints: StudyPoint[];
  exercises: Exercise[];
}

export const prebuiltDemos: PrebuiltDemo[] = [
  // ===== 案例1：静夜思 =====
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    cadalId: 'CADAL-2024001',
    tieredContent: {
      original: '牀前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。',
      adapted: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      vernacular: '【白话解读】皎洁的月光洒在床前，好像地上铺了一层白霜。抬头望着天上的明月，不禁低下头思念起远方的家乡。考点：比喻（月光比作霜）、对仗（举头-低头、望-思）。',
      stageLevel: 'primary',
    },
    studyPoints: [
      { char: '疑', pinyin: 'yí', explanation: '好像、仿佛', radical: '疋', strokes: 14 },
      { char: '霜', pinyin: 'shuāng', explanation: '水汽凝结的白色冰晶', radical: '雨', strokes: 17 },
      { char: '举', pinyin: 'jǔ', explanation: '抬起、向上', radical: '丶', strokes: 9 },
      { char: '思', pinyin: 'sī', explanation: '思念、想念', radical: '心', strokes: 9 },
    ],
    exercises: [
      {
        id: 'pre-ex-001-1',
        type: 'choice',
        question: '《静夜思》中"疑是地上霜"的"疑"是什么意思？',
        options: ['怀疑', '好像', '疑问', '奇怪'],
        answer: '好像',
        analysis: '"疑"在这里是"好像、仿佛"的意思。',
        difficulty: 1,
      },
      {
        id: 'pre-ex-001-2',
        type: 'short_answer',
        question: '请用自己的话说说《静夜思》表达了什么感情？',
        answer: '表达了诗人对家乡的思念之情。',
        analysis: '考查对古诗主旨的理解。',
        difficulty: 1,
      },
    ],
  },

  // ===== 案例2：守株待兔 =====
  {
    title: '守株待兔',
    author: '韩非',
    dynasty: '战国',
    cadalId: 'CADAL-2024003',
    tieredContent: {
      original: '宋人有耕者。田中有株，兔走觸株，折頸而死。因釋其耒而守株，冀復得兔。',
      adapted: '宋人有耕者。田中有株，兔走触株，折颈而死。因释其耒而守株，冀复得兔。',
      vernacular: '【白话解读】宋国农夫田里有个树桩，兔子撞上去死了。农夫放下农具守在树桩旁等下一只。考点："走"（跑，古今异义）、"释"（放下）、"冀"（希望）。寓意：不能死守经验、心存侥幸。',
      stageLevel: 'primary',
    },
    studyPoints: [
      { char: '株', pinyin: 'zhū', explanation: '树桩', radical: '木', strokes: 10 },
      { char: '释', pinyin: 'shì', explanation: '放下', radical: '釆', strokes: 12 },
      { char: '冀', pinyin: 'jì', explanation: '希望', radical: '八', strokes: 16 },
      { char: '走', pinyin: 'zǒu', explanation: '跑（古今异义）', radical: '走', strokes: 7 },
    ],
    exercises: [
      {
        id: 'pre-ex-003-1',
        type: 'choice',
        question: '"兔走触株"中"走"的意思是？',
        options: ['走路', '跑', '离开', '跳'],
        answer: '跑',
        analysis: '古文中"走"表示跑，现代汉语中"走"表示步行，属于古今异义。',
        difficulty: 2,
      },
      {
        id: 'pre-ex-003-2',
        type: 'short_answer',
        question: '"守株待兔"这个成语告诉了我们什么道理？',
        answer: '不能死守经验、心存侥幸，要主动努力才能成功。',
        analysis: '考查对寓言寓意的理解。',
        difficulty: 2,
      },
    ],
  },

  // ===== 案例3：观书有感 =====
  {
    title: '观书有感',
    author: '朱熹',
    dynasty: '宋',
    cadalId: 'CADAL-2024004',
    tieredContent: {
      original: '半畝方塘一鑑開，天光雲影共徘徊。問渠那得清如許，爲有源頭活水來。',
      adapted: '半亩方塘一鉴开，天光云影共徘徊。问渠那得清如许，为有源头活水来。',
      vernacular: '【白话解读】池塘像镜子，天光云影在水面移动。为什么这么清澈？因为有活水源源不断流来。比喻读书学习——不断学习新知识，思想才能保持清晰。考点：比喻（池塘喻心智、活水喻新知）、设问修辞。',
      stageLevel: 'primary',
    },
    studyPoints: [
      { char: '鉴', pinyin: 'jiàn', explanation: '镜子', radical: '金', strokes: 13 },
      { char: '渠', pinyin: 'qú', explanation: '它，指池塘', radical: '水', strokes: 12 },
      { char: '徘徊', pinyin: 'pái huái', explanation: '来回移动', radical: '彳', strokes: 12 },
    ],
    exercises: [
      {
        id: 'pre-ex-004-1',
        type: 'choice',
        question: '"问渠那得清如许"中的"渠"指什么？',
        options: ['水渠', '他', '池塘', '河流'],
        answer: '池塘',
        analysis: '"渠"在这里指代前面的"方塘"（池塘）。',
        difficulty: 2,
      },
      {
        id: 'pre-ex-004-2',
        type: 'short_answer',
        question: '这首诗告诉我们什么道理？',
        answer: '不断学习新知识，思想才能保持清晰活跃，就像池塘有活水注入才能清澈。',
        analysis: '考查对诗歌比喻寓意的理解。',
        difficulty: 2,
      },
    ],
  },

  // ===== 案例4：三字经（节选） =====
  {
    title: '三字经（节选）',
    author: '王应麟',
    dynasty: '宋',
    cadalId: 'CADAL-2024002',
    tieredContent: {
      original: '人之初，性本善。性相近，習相遠。苟不教，性乃遷。',
      adapted: '人之初，性本善。性相近，习相远。苟不教，性乃迁。',
      vernacular: '【白话解读】人刚出生时本性善良，天性都差不多，但后天环境不同习惯就会差很远。考点："初"（刚、开始）、"迁"（改变）、对比论证。',
      stageLevel: 'primary',
    },
    studyPoints: [
      { char: '善', pinyin: 'shàn', explanation: '善良、美好', radical: '口', strokes: 12 },
      { char: '苟', pinyin: 'gǒu', explanation: '如果、假如', radical: '艹', strokes: 8 },
      { char: '迁', pinyin: 'qiān', explanation: '改变、迁移', radical: '辶', strokes: 6 },
    ],
    exercises: [
      {
        id: 'pre-ex-002-1',
        type: 'choice',
        question: '"人之初，性本善"是谁说的？',
        options: ['孔子', '孟子', '荀子', '王应麟'],
        answer: '王应麟',
        analysis: '这句话出自宋代王应麟的《三字经》，继承了孟子的性善论思想。',
        difficulty: 1,
      },
      {
        id: 'pre-ex-002-2',
        type: 'short_answer',
        question: '"苟不教，性乃迁"是什么意思？',
        answer: '如果不好好教育，人的善良本性就会改变。',
        analysis: '考查对"苟"（如果）和"迁"（改变）的理解。',
        difficulty: 1,
      },
    ],
  },

  // ===== 案例5：望庐山瀑布 =====
  {
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    cadalId: 'CADAL-2024006',
    tieredContent: {
      original: '日照香爐生紫煙，遙看瀑布掛前川。飛流直下三千尺，疑是銀河落九天。',
      adapted: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
      vernacular: '【白话解读】阳光照香炉峰升起紫烟，瀑布像白练挂在山前。三千尺飞泻而下，怀疑是银河从天上落下来。考点：夸张（三千尺）、比喻（银河）、视觉描写。',
      stageLevel: 'primary',
    },
    studyPoints: [
      { char: '庐', pinyin: 'lú', explanation: '简陋的房屋', radical: '广', strokes: 7 },
      { char: '挂', pinyin: 'guà', explanation: '悬挂', radical: '扌', strokes: 9 },
      { char: '疑', pinyin: 'yí', explanation: '怀疑、好像', radical: '疋', strokes: 14 },
    ],
    exercises: [
      {
        id: 'pre-ex-006-1',
        type: 'choice',
        question: '"飞流直下三千尺"使用了什么修辞手法？',
        options: ['比喻', '拟人', '夸张', '排比'],
        answer: '夸张',
        analysis: '"三千尺"是夸张的写法，形容瀑布极高。',
        difficulty: 2,
      },
      {
        id: 'pre-ex-006-2',
        type: 'short_answer',
        question: '"疑是银河落九天"把瀑布比作什么？',
        answer: '把瀑布比作银河从天上落下来。',
        analysis: '考查比喻修辞的识别。',
        difficulty: 1,
      },
    ],
  },
];

// ===== 根据 cadalId 查找预存案例 =====
export function findPrebuiltDemo(cadalId: string): PrebuiltDemo | undefined {
  return prebuiltDemos.find((d) => d.cadalId === cadalId);
}

// ===== 获取所有预存案例的 cadalId 列表 =====
export function getPrebuiltCadalIds(): string[] {
  return prebuiltDemos.map((d) => d.cadalId);
}

// ===== 将预存案例转换为 AncientText 格式 =====
export function prebuiltDemoToAncientText(demo: PrebuiltDemo | undefined): AncientText | undefined {
  if (!demo) return undefined;
  return {
    id: `prebuilt-${demo.cadalId}`,
    title: demo.title,
    author: demo.author,
    dynasty: demo.dynasty,
    cadalId: demo.cadalId,
    cadalImageUrl: `https://placehold.co/400x600/f5e6d3/8b4513?text=${encodeURIComponent(demo.title)}·古籍原图`,
    gradeLevel: [5],
    schoolStage: ['primary'],
    tags: ['预存案例'],
    difficulty: 1 as const,
    textbookMatch: [
      {
        grade: 5 as const,
        semester: '上' as const,
        unit: '离线演示',
        lessonName: demo.title,
        knowledgePoints: ['预存案例·离线可用'],
      },
    ],
  };
}
