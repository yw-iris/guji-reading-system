// ===== Mock 数据 - MVP 演示用（覆盖小学→初中→高中） =====
import type { AncientText, StudyTask, LearningStats, ReadingRecord, User, LessonPlan, TeachingStats } from '../types';

// ---- 用户 ----
export const mockUsers: Record<string, User> = {
  student: {
    id: 'student-001',
    name: '小探宝',
    role: 'student',
    grade: 5,
    schoolStage: 'primary',
  },
  teacher: {
    id: 'teacher-001',
    name: '张老师',
    role: 'teacher',
    subject: '语文',
    school: '杭州市实验小学',
  },
  independentTeacher: {
    id: 'teacher-002',
    name: '李老师',
    role: 'teacher',
    subject: '语文/国学',
    school: '独立教师',
  },
  librarian: {
    id: 'lib-001',
    name: '王馆长',
    role: 'librarian',
  },
};

export const mockUser: User = mockUsers.student;

// ---- 古籍列表（扩展至初高中） ----
export const mockTexts: AncientText[] = [
  // === 小学段 ===
  {
    id: 'text-001',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    cadalId: 'CADAL-2024001',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=静夜思·古籍原图',
    gradeLevel: [1, 2],
    schoolStage: ['primary'],
    tags: ['唐诗', '思乡', '李白'],
    difficulty: 1,
    textbookMatch: [
      { grade: 1, semester: '下', unit: '第四单元', lessonName: '古诗二首', knowledgePoints: ['五言绝句', '思乡之情', '比喻手法'] },
    ],
  },
  {
    id: 'text-002',
    title: '三字经（节选）',
    author: '王应麟',
    dynasty: '宋',
    cadalId: 'CADAL-2024002',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=三字经·古籍原图',
    gradeLevel: [1, 2, 3],
    schoolStage: ['primary'],
    tags: ['蒙学', '三字经', '启蒙'],
    difficulty: 1,
    textbookMatch: [
      { grade: 1, semester: '上', unit: '识字单元', lessonName: '人之初', knowledgePoints: ['三字韵文', '传统美德', '勤学故事'] },
    ],
  },
  {
    id: 'text-003',
    title: '守株待兔',
    author: '韩非',
    dynasty: '战国',
    cadalId: 'CADAL-2024003',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=韩非子·古籍原图',
    gradeLevel: [3, 4],
    schoolStage: ['primary'],
    tags: ['文言文', '寓言', '成语'],
    difficulty: 2,
    textbookMatch: [
      { grade: 3, semester: '下', unit: '第二单元', lessonName: '寓言二则', knowledgePoints: ['文言虚词', '寓言寓意', '成语来源'] },
    ],
  },
  {
    id: 'text-004',
    title: '观书有感',
    author: '朱熹',
    dynasty: '宋',
    cadalId: 'CADAL-2024004',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=观书有感·古籍原图',
    gradeLevel: [5, 6],
    schoolStage: ['primary'],
    tags: ['宋诗', '哲理', '读书'],
    difficulty: 2,
    textbookMatch: [
      { grade: 5, semester: '上', unit: '第八单元', lessonName: '古诗三首', knowledgePoints: ['七言绝句', '比喻说理', '借景喻理'] },
    ],
  },
  {
    id: 'text-006',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    cadalId: 'CADAL-2024006',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=望庐山瀑布·古籍原图',
    gradeLevel: [2, 3],
    schoolStage: ['primary'],
    tags: ['唐诗', '山水', '李白'],
    difficulty: 1,
    textbookMatch: [
      { grade: 2, semester: '上', unit: '第四单元', lessonName: '古诗二首', knowledgePoints: ['七言绝句', '夸张手法', '景物描写'] },
    ],
  },

  // === 初中段 ===
  {
    id: 'text-007',
    title: '岳阳楼记',
    author: '范仲淹',
    dynasty: '宋',
    cadalId: 'CADAL-2024007',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=岳阳楼记·古籍原图',
    gradeLevel: [8, 9],
    schoolStage: ['junior'],
    tags: ['文言文', '游记', '名篇'],
    difficulty: 3,
    textbookMatch: [
      { grade: 8, semester: '下', unit: '第六单元', lessonName: '岳阳楼记', knowledgePoints: ['文言虚词', '景物描写', '先忧后乐思想', '骈散结合'] },
    ],
  },
  {
    id: 'text-008',
    title: '出师表',
    author: '诸葛亮',
    dynasty: '三国',
    cadalId: 'CADAL-2024008',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=出师表·古籍原图',
    gradeLevel: [9],
    schoolStage: ['junior'],
    tags: ['文言文', '奏表', '名篇'],
    difficulty: 4,
    textbookMatch: [
      { grade: 9, semester: '下', unit: '第五单元', lessonName: '出师表', knowledgePoints: ['文言实词', '议论抒情', '忠君爱国', '古今异义'] },
    ],
  },
  {
    id: 'text-009',
    title: '桃花源记',
    author: '陶渊明',
    dynasty: '东晋',
    cadalId: 'CADAL-2024009',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=桃花源记·古籍原图',
    gradeLevel: [8],
    schoolStage: ['junior'],
    tags: ['文言文', '游记', '理想社会'],
    difficulty: 3,
    textbookMatch: [
      { grade: 8, semester: '上', unit: '第三单元', lessonName: '桃花源记', knowledgePoints: ['叙事结构', '环境描写', '社会理想'] },
    ],
  },

  // === 高中段 ===
  {
    id: 'text-010',
    title: '赤壁赋',
    author: '苏轼',
    dynasty: '宋',
    cadalId: 'CADAL-2024010',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=赤壁赋·古籍原图',
    gradeLevel: [10],
    schoolStage: ['senior'],
    tags: ['文言文', '赋', '哲理', '苏轼'],
    difficulty: 5,
    textbookMatch: [
      { grade: 10, semester: '上', unit: '第三单元', lessonName: '赤壁赋', knowledgePoints: ['赋体特点', '主客问答', '变与不变的哲理', '景情理融合'] },
    ],
  },
  {
    id: 'text-011',
    title: '劝学',
    author: '荀子',
    dynasty: '战国',
    cadalId: 'CADAL-2024011',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=劝学·古籍原图',
    gradeLevel: [10],
    schoolStage: ['senior'],
    tags: ['文言文', '议论', '学习'],
    difficulty: 4,
    textbookMatch: [
      { grade: 10, semester: '上', unit: '第二单元', lessonName: '劝学', knowledgePoints: ['比喻论证', '对比论证', '文言虚词"而"的用法'] },
    ],
  },
  {
    id: 'text-012',
    title: '师说',
    author: '韩愈',
    dynasty: '唐',
    cadalId: 'CADAL-2024012',
    cadalImageUrl: 'https://placehold.co/400x600/f5e6d3/8b4513?text=师说·古籍原图',
    gradeLevel: [10, 11],
    schoolStage: ['senior'],
    tags: ['文言文', '议论', '教育'],
    difficulty: 4,
    textbookMatch: [
      { grade: 10, semester: '上', unit: '第二单元', lessonName: '师说', knowledgePoints: ['论证方法', '"师道"内涵', '对比结构'] },
    ],
  },
];

// ---- 三层文本内容 ----
export const mockTieredContent: Record<string, { original: string; adapted: string; vernacular: string }> = {
  'text-001': {
    original: '牀前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。',
    adapted: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    vernacular: '【白话解读】皎洁的月光洒在床前，好像地上铺了一层白霜。抬头望着天上的明月，不禁低下头思念起远方的家乡。考点：比喻（月光比作霜）、对仗（举头-低头、望-思）。',
  },
  'text-002': {
    original: '人之初，性本善。性相近，習相遠。苟不教，性乃遷。',
    adapted: '人之初，性本善。性相近，习相远。苟不教，性乃迁。',
    vernacular: '【白话解读】人刚出生时本性善良，天性都差不多，但后天环境不同习惯就会差很远。考点："初"（刚、开始）、"迁"（改变）、对比论证。',
  },
  'text-003': {
    original: '宋人有耕者。田中有株，兔走觸株，折頸而死。因釋其耒而守株，冀復得兔。',
    adapted: '宋人有耕者。田中有株，兔走触株，折颈而死。因释其耒而守株，冀复得兔。',
    vernacular: '【白话解读】宋国农夫田里有个树桩，兔子撞上去死了。农夫放下农具守在树桩旁等下一只。考点："走"（跑，古今异义）、"释"（放下）、"冀"（希望）。寓意：不能死守经验、心存侥幸。',
  },
  'text-004': {
    original: '半畝方塘一鑑開，天光雲影共徘徊。問渠那得清如許，爲有源頭活水來。',
    adapted: '半亩方塘一鉴开，天光云影共徘徊。问渠那得清如许，为有源头活水来。',
    vernacular: '【白话解读】池塘像镜子，天光云影在水面移动。为什么这么清澈？因为有活水源源不断流来。比喻读书学习——不断学习新知识，思想才能保持清晰。考点：比喻（池塘喻心智、活水喻新知）、设问修辞。',
  },
  'text-006': {
    original: '日照香爐生紫煙，遙看瀑布掛前川。飛流直下三千尺，疑是銀河落九天。',
    adapted: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
    vernacular: '【白话解读】阳光照香炉峰升起紫烟，瀑布像白练挂在山前。三千尺飞泻而下，怀疑是银河从天上落下来。考点：夸张（三千尺）、比喻（银河）、视觉描写。',
  },
  'text-007': {
    original: '慶曆四年春，滕子京謫守巴陵郡。越明年，政通人和，百廢具興，乃重修岳陽樓……',
    adapted: '庆历四年春，滕子京谪守巴陵郡。越明年，政通人和，百废具兴，乃重修岳阳楼……',
    vernacular: '【白话解读】庆历四年春天，滕子京被贬到巴陵郡做太守。过了一年，政事顺利，百姓和乐，各种荒废的事业都兴办起来，于是重新修建岳阳楼。考点："谪"（贬官）、"具"通"俱"（通假字）、叙事背景。',
  },
  'text-008': {
    original: '臣亮言：先帝創業未半而中道崩殂，今天下三分，益州疲弊，此誠危急存亡之秋也。',
    adapted: '臣亮言：先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。',
    vernacular: '【白话解读】诸葛亮上表说：先帝创立大业还没完成一半就中途去世了，现在天下分三国，益州困乏，这真是危急存亡的关键时刻。考点："崩殂"（帝王去世）、"秋"（时候，古今异义）、"诚"（确实）。',
  },
  'text-009': {
    original: '晉太元中，武陵人捕魚爲業。緣溪行，忘路之遠近。忽逢桃花林，夾岸數百步……',
    adapted: '晋太元中，武陵人捕鱼为业。缘溪行，忘路之远近。忽逢桃花林，夹岸数百步……',
    vernacular: '【白话解读】东晋太元年间，武陵有个以捕鱼为生的人。沿着溪水行船，忘了路程的远近。忽然遇到一片桃花林，两岸几百步……考点："缘"（沿着）、"远近"（偏义复词）、悬念式开篇。',
  },
  'text-010': {
    original: '壬戌之秋，七月既望，蘇子與客泛舟遊於赤壁之下。清風徐來，水波不興。',
    adapted: '壬戌之秋，七月既望，苏子与客泛舟游于赤壁之下。清风徐来，水波不兴。',
    vernacular: '【白话解读】壬戌年秋天，七月十六日，苏轼和客人划着小船在赤壁下游玩。清风缓缓吹来，水面波澜不惊。考点："既望"（农历十六）、"于"（在，介词结构后置）、赋体开篇意境。',
  },
  'text-011': {
    original: '君子曰：學不可以已。青，取之於藍而青於藍；冰，水爲之而寒於水。',
    adapted: '君子曰：学不可以已。青，取之于蓝而青于蓝；冰，水为之而寒于水。',
    vernacular: '【白话解读】君子说：学习不可以停止。靛青是从蓝草里提取的，却比蓝草更青；冰是水凝结的，却比水更寒冷。用比喻论证"学习可以使人超越原本的水平"。考点："已"（停止）、"于"（比，介词结构）、比喻论证方法。',
  },
  'text-012': {
    original: '古之學者必有師。師者，所以傳道受業解惑也。人非生而知之者，孰能無惑？',
    adapted: '古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？',
    vernacular: '【白话解读】古代求学的人一定有老师。老师是传授道理、教授学业、解答疑惑的人。人不是生来就懂道理的，谁能没有疑惑呢？考点："受"通"授"（通假字）、"所以"（用来……的，古今异义）、"孰"（谁）。',
  },
};

// ---- 备课教案 ----
export const mockLessonPlans: LessonPlan[] = [
  {
    id: 'plan-001',
    title: '《静夜思》古诗教学教案',
    targetGrade: 1,
    subject: '语文',
    textIds: ['text-001'],
    objectives: ['正确流利朗读古诗', '理解诗意，体会思乡之情', '认识"疑""霜""举"等生字'],
    teachingProcess: [
      { order: 1, title: '情境导入', duration: 5, content: '播放月亮图片，提问：看到月亮你会想到什么？引导学生自由发言', activities: ['图片展示', '自由讨论'] },
      { order: 2, title: '初读感知', duration: 8, content: '教师范读→学生跟读→指名读。使用简化适配版文本。', ancientTextRef: 'text-001', tier: 'adapted', activities: ['范读', '跟读', '指名读'] },
      { order: 3, title: '精读理解', duration: 12, content: '逐句讲解，结合白话解读版帮助理解。"疑是地上霜"——比喻手法。', ancientTextRef: 'text-001', tier: 'vernacular', activities: ['逐句讲解', '小组讨论', '比喻分析'] },
      { order: 4, title: '拓展延伸', duration: 8, content: '展示CADAL古籍原图，让学生感受古人书迹。提问：你还知道哪些写月亮的诗？', ancientTextRef: 'text-001', activities: ['原图欣赏', '知识迁移'] },
      { order: 5, title: '课堂总结', duration: 5, content: '回顾诗意和考点，布置课后练习', activities: ['总结', '布置作业'] },
    ],
    createdAt: '2025-03-10',
    authorId: 'teacher-001',
    isPublic: true,
    downloads: 156,
    tags: ['古诗教学', '一年级', '李白'],
  },
  {
    id: 'plan-002',
    title: '《岳阳楼记》精读教案——"先忧后乐"思想探究',
    targetGrade: 8,
    subject: '语文',
    textIds: ['text-007'],
    objectives: ['掌握文言虚词和重点实词', '分析景物描写与情感关系', '理解"先天下之忧而忧"的思想内涵'],
    teachingProcess: [
      { order: 1, title: '背景导入', duration: 8, content: '介绍范仲淹生平及"庆历新政"背景，播放岳阳楼图片', activities: ['背景介绍', '图片展示'] },
      { order: 2, title: '初读疏通', duration: 10, content: '学生借助简化版自读，标记疑难字词。教师讲解重点字词。', ancientTextRef: 'text-007', tier: 'adapted', activities: ['自主阅读', '字词讲解'] },
      { order: 3, title: '分段研读', duration: 15, content: '分组研读"迁客骚人"的两种览物之情，对比分析。使用原版文本体会骈散结合之美。', ancientTextRef: 'text-007', tier: 'original', activities: ['分组研读', '对比分析', '朗读体会'] },
      { order: 4, title: '主旨探究', duration: 10, content: '讨论"先天下之忧而忧，后天下之乐而乐"的现实意义。结合白话解读深化理解。', ancientTextRef: 'text-007', tier: 'vernacular', activities: ['小组讨论', '观点分享'] },
      { order: 5, title: '总结与练习', duration: 5, content: '课堂小测 + 布置背诵任务', activities: ['小测', '背诵'] },
    ],
    createdAt: '2025-03-12',
    authorId: 'teacher-001',
    isPublic: true,
    downloads: 89,
    tags: ['文言文教学', '八年级', '岳阳楼记'],
  },
  {
    id: 'plan-003',
    title: '《劝学》论证方法分析——高考文言文备考',
    targetGrade: 10,
    subject: '语文',
    textIds: ['text-011'],
    objectives: ['掌握比喻论证和对比论证', '积累高考高频文言虚词', '理解荀子学习观'],
    teachingProcess: [
      { order: 1, title: '导入', duration: 5, content: '提问："你为什么要学习？"引出荀子的学习观', activities: ['互动提问'] },
      { order: 2, title: '文本研读', duration: 15, content: '逐段分析论证结构，标注比喻论证和对比论证。使用原版体会荀子文风。', ancientTextRef: 'text-011', tier: 'original', activities: ['逐段分析', '标注论证方法'] },
      { order: 3, title: '考点归纳', duration: 10, content: '归纳"而""于""之"等虚词用法，结合白话解读版对照理解', ancientTextRef: 'text-011', tier: 'vernacular', activities: ['归纳总结', '真题链接'] },
      { order: 4, title: '拓展应用', duration: 8, content: '仿写一段比喻论证，话题"读书"', activities: ['写作练习', '互评'] },
    ],
    createdAt: '2025-03-14',
    authorId: 'teacher-002',
    isPublic: true,
    downloads: 234,
    tags: ['高考备考', '文言文', '论证方法', '荀子'],
  },
];

// ---- 教师端统计 ----
export const mockTeachingStats: TeachingStats = {
  totalLessonPlans: 48,
  publicLessonPlans: 32,
  totalDownloads: 1286,
  popularPlans: [
    { id: 'plan-003', title: '《劝学》论证方法分析——高考文言文备考', downloads: 234 },
    { id: 'plan-001', title: '《静夜思》古诗教学教案', downloads: 156 },
    { id: 'plan-002', title: '《岳阳楼记》精读教案', downloads: 89 },
  ],
  recentPlans: [],
};

// ---- 研学任务 ----
export const mockStudyTasks: StudyTask[] = [
  {
    id: 'task-001', title: '唐诗中的月亮意象研学',
    description: '通过阅读《静夜思》等唐诗，探索古人如何用月亮表达情感',
    targetGrade: [3, 4], textIds: ['text-001'],
    exercises: [
      { id: 'ex-001', type: 'choice', question: '《静夜思》中"疑是地上霜"的"疑"是什么意思？', options: ['怀疑', '好像', '疑问', '奇怪'], answer: '好像', analysis: '"疑"在这里是"好像、仿佛"的意思。', difficulty: 1 },
    ],
    createdAt: '2025-01-15', assignedCount: 45, completedCount: 38,
  },
  {
    id: 'task-002', title: '寓言故事中的智慧',
    description: '阅读《守株待兔》等寓言，理解古人的处世智慧',
    targetGrade: [3, 4, 5], textIds: ['text-003'],
    exercises: [
      { id: 'ex-002', type: 'short_answer', question: '请用自己的话说说"守株待兔"告诉我们什么道理？', answer: '不能死守经验，要主动努力。', analysis: '考查对寓言寓意的理解。', difficulty: 2 },
    ],
    createdAt: '2025-02-10', assignedCount: 60, completedCount: 42,
  },
  {
    id: 'task-003', title: '《岳阳楼记》深度研学——家国情怀',
    description: '精读《岳阳楼记》，探究范仲淹的政治理想与文学成就',
    targetGrade: [8, 9], textIds: ['text-007'],
    exercises: [
      { id: 'ex-003', type: 'essay', question: '结合课文，谈谈你对"先天下之忧而忧，后天下之乐而乐"的理解（200字）', answer: '围绕家国情怀、责任担当展开。', analysis: '考查文言文理解深度和论述能力。', difficulty: 3 },
    ],
    createdAt: '2025-03-01', assignedCount: 35, completedCount: 28,
  },
];

// ---- 学情统计 ----
export const mockLearningStats: LearningStats = {
  totalStudents: 328,
  activeStudents: 256,
  totalReadingTime: 86400,
  avgAccuracy: 76.8,
  popularTexts: [
    { textId: 'text-001', title: '静夜思', readCount: 212 },
    { textId: 'text-007', title: '岳阳楼记', readCount: 178 },
    { textId: 'text-011', title: '劝学', readCount: 145 },
  ],
  gradeDistribution: [
    { grade: 1, count: 28 }, { grade: 2, count: 32 }, { grade: 3, count: 35 },
    { grade: 4, count: 34 }, { grade: 5, count: 31 }, { grade: 6, count: 28 },
    { grade: 7, count: 30 }, { grade: 8, count: 35 }, { grade: 9, count: 25 },
    { grade: 10, count: 22 }, { grade: 11, count: 18 }, { grade: 12, count: 10 },
  ],
  weeklyTrend: [
    { date: '03-10', readingCount: 85 }, { date: '03-11', readingCount: 102 },
    { date: '03-12', readingCount: 78 }, { date: '03-13', readingCount: 121 },
    { date: '03-14', readingCount: 95 }, { date: '03-15', readingCount: 72 },
    { date: '03-16', readingCount: 108 },
  ],
};

// ---- 阅读记录 ----
export const mockReadingRecords: ReadingRecord[] = [
  { id: 'rec-001', studentId: 'student-001', textId: 'text-001', tier: 'adapted', progress: 100, timeSpent: 180, exercisesCompleted: 3, exercisesCorrect: 3, lastReadAt: '2025-03-16T14:30:00' },
  { id: 'rec-002', studentId: 'student-001', textId: 'text-003', tier: 'vernacular', progress: 100, timeSpent: 420, exercisesCompleted: 5, exercisesCorrect: 4, lastReadAt: '2025-03-15T10:00:00' },
  { id: 'rec-003', studentId: 'student-001', textId: 'text-007', tier: 'adapted', progress: 60, timeSpent: 540, exercisesCompleted: 2, exercisesCorrect: 2, lastReadAt: '2025-03-14T16:00:00' },
];
