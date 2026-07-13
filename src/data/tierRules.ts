// ===== 三层文本难度划分规则 =====
// 系统核心算法标准，不可复制的竞争力
// 基于2022版义务教育语文课程标准 + 皮亚杰认知发展理论
// 用途：AI重构古诗文时按学段自动适配文本难度

// ---- 三层难度规则定义 ----
export interface TierRule {
  tier: 'C' | 'B' | 'A';
  tierName: string;           // 层级名称
  stageTarget: string;        // 目标学段
  description: string;        // 处理规则描述
  rules: string[];            // 具体规则列表
  examples: { title: string; before: string; after: string }[]; // 示例
}

// ---- C 通识层（1-2年级） ----
const tierC: TierRule = {
  tier: 'C',
  tierName: '通识层',
  stageTarget: '第一学段（1-2年级）',
  description:
    '纯大白话，去掉生僻字、复杂句式，只讲画面故事。保留画面感和故事性，让低年级学生能通过诵读感受韵律、展开想象。',
  rules: [
    '去掉所有生僻字（笔画 > 15 的替换为常用字）',
    '复杂句式改为简单短句，每句不超过 10 字',
    '去掉典故和修辞（比喻除外，保留明喻和浅近比喻）',
    '保留画面感和故事性，用白话描绘意象',
    '保持押韵和节奏感，便于诵读',
  ],
  examples: [
    {
      title: '静夜思',
      before: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
      after: '床前洒满月光，好像地上的霜。抬头看天上的月亮，低头想起家乡。',
    },
  ],
};

// ---- B 适配层（3-4年级） ----
const tierB: TierRule = {
  tier: 'B',
  tierName: '适配层',
  stageTarget: '第二学段（3-4年级）',
  description:
    '保留原文短句，生僻字注音、简单注释，简化复杂典故。让学生在保留原文韵味的基础上读懂诗意、识别基础意象。',
  rules: [
    '保留原文句式结构，不做大幅改写',
    '生僻字加拼音注释（格式：生字（注音））',
    '简单解释典故，一句话概括背景',
    '复杂长句按意群拆分，每分句 8-15 字',
    '保留基本意象和修辞手法（比喻、拟人、对偶）',
  ],
  examples: [
    {
      title: '杨氏之子',
      before: '梁国杨氏子九岁，甚聪惠。孔君平诣其父，父不在，乃呼儿出。',
      after:
        '梁国杨氏子九岁，甚聪惠（huì，聪慧）。\n孔君平诣（yì，拜访）其父，父不在，乃呼儿出。\n[注：孔君平是父亲的朋友]',
    },
  ],
};

// ---- A 原版层（5-6年级） ----
const tierA: TierRule = {
  tier: 'A',
  tierName: '原版层',
  stageTarget: '第三学段（5-6年级）',
  description:
    'CADAL 繁体古籍原文，标注考试生字、古今异义、课内考点。让高年级学生接触真实古籍，培养文言文阅读能力，对标小升初考试。',
  rules: [
    '保留 CADAL 繁体原文，不做简化',
    '标注考试高频生字（笔画 > 12 或教材要求会写的字）',
    '标注古今异义字词（附古今释义对照）',
    '关联课内考点标签（如"对偶""托物言志""情景交融"）',
    '添加文言文语法注释（之/其/而/以/于 等虚词用法）',
  ],
  examples: [
    {
      title: '楊氏之子',
      before: '梁國楊氏子九歲，甚聰惠。孔君平詣其父，父不在，乃呼兒出。',
      after:
        '梁國楊氏子九歲，甚聰惠【考：惠→慧，通假字】。\n孔君平詣【考：詣，拜訪，古今異義】其父，父不在，乃【考：乃，於是，虛詞】呼兒出。\n[考點：通假字 | 古今異義 | 虛詞"乃" | 文言短篇閱讀]',
    },
  ],
};

// ---- 工具函数 ----

/**
 * 根据层级标识获取对应的难度规则
 */
export function getTierRule(tier: 'C' | 'B' | 'A'): TierRule {
  const rules: Record<'C' | 'B' | 'A', TierRule> = {
    C: tierC,
    B: tierB,
    A: tierA,
  };
  return rules[tier];
}

/**
 * 根据学段编号获取对应的难度层级
 * stage 1 → C, stage 2 → B, stage 3 → A
 */
export function getTierByStage(stage: 1 | 2 | 3): 'C' | 'B' | 'A' {
  const mapping: Record<1 | 2 | 3, 'C' | 'B' | 'A'> = {
    1: 'C',
    2: 'B',
    3: 'A',
  };
  return mapping[stage];
}

/**
 * 获取学段对应的目标受众描述
 */
export function getStageTargetAudience(stage: 1 | 2 | 3): string {
  const audiences: Record<1 | 2 | 3, string> = {
    1: '1-2年级学生，具备基础识字能力，以诵读和画面想象为主要学习方式',
    2: '3-4年级学生，能读懂浅近古诗大意，需要简单注释辅助理解',
    3: '5-6年级学生，能阅读浅易文言文，需接触古籍原文并掌握考点',
  };
  return audiences[stage];
}

// ---- 全部规则导出 ----
export const allTierRules: TierRule[] = [tierC, tierB, tierA];
