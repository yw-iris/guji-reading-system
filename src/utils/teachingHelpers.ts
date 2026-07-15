// ===== 备课 / 闯关 共享生成逻辑 =====
// 从古籍 mock 数据出发，确定性地生成结构化教案与闯关内容。
// 供教师端「一键生成备课方案」与学生端「闯关式阅读」复用，避免重复逻辑。

import type { AncientText, GradeLevel, LessonPlan, TeachingStep } from '../types';
import { mockStudyPoints } from './mockData';

// 三种教法变体
export type TeachVariant = '诵读' | '情境' | '思辨';

export const TEACH_VARIANTS: TeachVariant[] = ['诵读', '情境', '思辨'];

/** 是否诗词（用于文体分支） */
export function isPoem(text: AncientText): boolean {
  return text.tags.includes('唐诗') || text.tags.includes('宋诗') || text.tags.includes('词');
}

/** 学段中文名 */
export function stageName(text: AncientText): string {
  if (text.schoolStage.includes('primary')) return '小学';
  if (text.schoolStage.includes('junior')) return '初中';
  return '高中';
}

/** 取首个重点字词，用于目标/活动示例 */
function leadWord(text: AncientText): string {
  const sp = mockStudyPoints[text.id];
  return sp && sp.length ? sp[0].char : (text.title[0] ?? '之');
}

/** 课标核心知识点 */
function kps(text: AncientText): string[] {
  return text.textbookMatch[0]?.knowledgePoints ?? [];
}

// ===== 语言 / 文学 / 文化 三维目标 =====
export function buildTripleObjectives(text: AncientText, variant: TeachVariant): string[] {
  const w = leadWord(text);
  const kp = kps(text);
  const lang = `【语言】正确、流利、有韵味地朗读《${text.title}》，掌握重点字词（如「${w}」）的音形义。`;
  const lit = isPoem(text)
    ? `【文学】体会《${text.title}》的意象营造、情景交融与${kp[0] ?? '抒情'}手法。`
    : `【文学】分析《${text.title}》的叙事层次与${kp[0] ?? '写法'}，理解其表达技巧。`;
  const cul = `【文化】感受${text.dynasty}文风与「${kp.slice(-1)[0] ?? text.title}」背后的文化意蕴，增强文化自信。`;
  const method =
    variant === '诵读'
      ? '【学法】以诵读为主轴，在吟咏涵泳中整体感知文意。'
      : variant === '情境'
        ? '【学法】创设真实情境，在体验与演绎中内化文本。'
        : '【学法】以思辨探究驱动，在追问与争鸣中深化理解。';
  return [lang, lit, cul, method];
}

// ===== 教学流程（随教法变体调整活动） =====
export function buildProcess(text: AncientText, variant: TeachVariant): TeachingStep[] {
  const base: TeachingStep[] = [
    {
      order: 1,
      title: '情境导入',
      duration: 5,
      content:
        variant === '思辨'
          ? `抛出一个核心问题引入：「读《${text.title}》，你最想问什么？」激发学生探究欲。`
          : `展示《${text.title}》相关图片或${isPoem(text) ? '配乐意境' : '古籍原图'}，创设情境，激发兴趣。`,
      activities: variant === '思辨' ? ['核心提问', '自由猜想'] : ['图片/音视频', '自由讨论'],
    },
    {
      order: 2,
      title: '初读感知',
      duration: 10,
      content: '教师范读 → 学生跟读 → 借助简化版文本自主阅读，圈画疑难字词。',
      tier: 'adapted',
      activities: ['范读', '跟读', '自主阅读'],
    },
  ];

  let mid: TeachingStep;
  if (variant === '诵读') {
    mid = {
      order: 3,
      title: '吟咏体会',
      duration: 12,
      content: '配乐朗读，划分节奏，小组赛读，在反复吟咏中读出韵味与情感。',
      tier: 'adapted',
      activities: ['配乐朗读', '节奏划分', '小组赛读'],
    };
  } else if (variant === '情境') {
    mid = {
      order: 3,
      title: '情境演绎',
      duration: 12,
      content: `分组进行角色扮演 / 画面再现，把《${text.title}》的情境「演」出来，在体验中理解文意。`,
      tier: 'adapted',
      activities: ['角色扮演', '情境再现', '即兴对话'],
    };
  } else {
    mid = {
      order: 3,
      title: '思辨探究',
      duration: 12,
      content: '围绕「三个假设」展开小组辩论与追问，在观点碰撞中深化对文本的理解。',
      tier: 'adapted',
      activities: ['三个假设', '小组辩论', '观点争鸣'],
    };
  }

  const latter: TeachingStep[] = [
    {
      order: 4,
      title: '译讲点拨',
      duration: 10,
      content: `结合白话解读版疏通文意，点拨重点字词与${kps(text).slice(0, 2).join('、') || '核心知识点'}。`,
      tier: 'vernacular',
      activities: ['逐句讲解', '白话对照'],
    },
    {
      order: 5,
      title: '拓展总结',
      duration: 8,
      content:
        variant === '情境'
          ? '回到「三个假设」分享演绎感悟，联系现实生活，布置分层作业。'
          : '回顾本课重点，结合现实展开迁移，布置分层作业。',
      activities:
        variant === '情境'
          ? ['三个假设分享', '现实迁移', '布置作业']
          : ['总结', '知识迁移', '布置作业'],
    },
  ];

  return [...base, mid, ...latter];
}

// ===== 三个假设（思辨/情境核心活动） =====
export function buildThreeAssumptions(text: AncientText): string[] {
  const title = text.title;
  if (text.tags.includes('寓言') || text.tags.includes('成语') || text.tags.includes('成语')) {
    return [
      `假设《${title}》的主角没有按原文那样做，而是换了一种选择，故事的结局会如何？`,
      `假设故事中那个关键的「偶然」（如兔子撞树）从未发生，主角会怎样度过此后的一生？`,
      `假设你是路过的旁观者，你会如何用一句话劝告主角？`,
    ];
  }
  if (isPoem(text)) {
    return [
      `假设诗人写下《${title}》时不在原文的场景，而是在另一个时空，诗境会有什么变化？`,
      `假设把诗中的核心意象（如月、柳、山水）换成另一种事物，情感还会一样吗？`,
      `假设你是诗人的知己，收到此诗后会如何回应？`,
    ];
  }
  if (text.tags.includes('议论') || text.title.includes('说') || text.title.includes('学')) {
    return [
      `假设作者用今天的一个生活事例来论证同样的观点，他会举什么例子？`,
      `假设你是文中的「反方」，可以怎样有理有据地反驳作者的看法？`,
      `假设去掉所有的比喻论证，这篇文章的说服力会减弱多少？`,
    ];
  }
  if (text.tags.includes('游记') || text.tags.includes('赋')) {
    return [
      `假设作者没有经历原文中的那次境遇（如被贬、泛舟），还能写出这样的文字吗？`,
      `假设文中的「你」做出了不同的选择（如渔人带人找到了入口），故事会如何续写？`,
      `假设你是文中的对话对象（如滕子京、客），读后会怎样回应作者？`,
    ];
  }
  return [
    `假设《${title}》发生在今天的生活场景里，它会被怎样改写？`,
    `假设文中的关键人物做了一个相反的决定，后续会如何发展？`,
    `假设你是文中的人物，最想对读者说的一句话是什么？`,
  ];
}

// ===== 分层作业（基础 / 提升 / 拓展） =====
export function buildHomework(text: AncientText): { base: string[]; lift: string[]; expand: string[] } {
  const w = leadWord(text);
  return {
    base: [
      `朗读并背诵《${text.title}》，圈出本课生字（如「${w}」）并注音。`,
      `写出《${text.title}》的作者、朝代，以及它所在的年级与单元。`,
    ],
    lift: [
      `借助注释翻译${isPoem(text) ? '全诗/全词' : '重点句段'}，说说你对「${kps(text)[0] ?? text.title}」的理解。`,
      `为《${text.title}》画一张思维导图，梳理${isPoem(text) ? '意象与情感' : '情节与主旨'}。`,
    ],
    expand: [
      `以《${text.title}》为题，写一段 100 字左右的赏析，品析其${
        isPoem(text) ? '意象与意境' : '写法与主旨'
      }。`,
      `联系现实生活，谈谈这篇古文对你今天的学习或为人有什么启发。`,
    ],
  };
}

// ===== 组装完整教案（供「一键生成备课方案」保存） =====
export function buildLessonPlan(
  text: AncientText,
  grade: GradeLevel,
  variant: TeachVariant,
): LessonPlan {
  const title = `《${text.title}》${variant === '诵读' ? '诵读型' : variant === '情境' ? '情境型' : '思辨型'}教学设计`;
  return {
    id: `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    targetGrade: grade,
    subject: '语文',
    textIds: [text.id],
    objectives: buildTripleObjectives(text, variant),
    teachingProcess: buildProcess(text, variant),
    createdAt: new Date().toISOString().slice(0, 10),
    authorId: 'teacher-001',
    isPublic: false,
    downloads: 0,
    tags: [
      variant === '诵读' ? '诵读教学' : variant === '情境' ? '情境教学' : '思辨教学',
      `${grade}年级`,
      text.title,
    ],
  };
}

// ===== 导出教案纯文本 =====
export function planToText(plan: LessonPlan, text: AncientText): string {
  const lines: string[] = [];
  lines.push(`${plan.title}`);
  lines.push(`年级：${plan.targetGrade}年级    学科：${plan.subject}`);
  lines.push(`篇目：${text.title}（${text.author} · ${text.dynasty}）    CADAL：${text.cadalId}`);
  lines.push(`创建日期：${plan.createdAt}`);
  lines.push('');
  lines.push('一、三维目标（语言 / 文学 / 文化）');
  plan.objectives.forEach((o, i) => lines.push(`  ${i + 1}. ${o}`));
  lines.push('');
  lines.push('二、教学流程');
  plan.teachingProcess.forEach((s) => {
    lines.push(`  ${s.order}. ${s.title}（${s.duration}分钟）`);
    lines.push(`     ${s.content}`);
    if (s.activities?.length) lines.push(`     课堂活动：${s.activities.join('、')}`);
  });
  lines.push('');
  lines.push('三、课堂活动 · 三个假设（思辨 / 情境核心）');
  buildThreeAssumptions(text).forEach((a, i) => lines.push(`  ${i + 1}. ${a}`));
  lines.push('');
  lines.push('四、分层作业');
  const hw = buildHomework(text);
  lines.push('  【基础】');
  hw.base.forEach((q) => lines.push(`    · ${q}`));
  lines.push('  【提升】');
  hw.lift.forEach((q) => lines.push(`    · ${q}`));
  lines.push('  【拓展】');
  hw.expand.forEach((q) => lines.push(`    · ${q}`));
  lines.push('');
  lines.push('五、标签');
  lines.push(`  ${plan.tags.join('、')}`);
  return lines.join('\n');
}

// 将教案文本下载为 .txt（浏览器端，无第三方依赖）
export function downloadPlanText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
