// ===== 古籍阅读系统 - 核心类型定义 =====

// 学段：小学 / 初中 / 高中
export type SchoolStage = 'primary' | 'junior' | 'senior';

// 年级（1-12，覆盖小学到高中）
export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// 文本层级：原版繁体 / 简化适配版 / 白话解读
export type TextTier = 'original' | 'adapted' | 'vernacular';

// 古籍内容条目
export interface AncientText {
  id: string;
  title: string;                    // 古籍标题
  author: string;                   // 作者
  dynasty: string;                  // 朝代
  cadalId: string;                  // CADAL 资源ID
  cadalImageUrl: string;            // CADAL 原图URL
  gradeLevel: GradeLevel[];         // 适配年级（1-12）
  schoolStage: SchoolStage[];       // 所属学段
  tags: string[];                   // 标签（古诗、蒙学、文言文等）
  difficulty: 1 | 2 | 3 | 4 | 5;   // 难度等级 1-5
  textbookMatch: TextbookRef[];     // 课标匹配
}

// 课标/课本引用
export interface TextbookRef {
  grade: GradeLevel;
  semester: '上' | '下';
  unit: string;                     // 单元
  lessonName: string;               // 课文名称
  knowledgePoints: string[];        // 关联知识点
}

// 三层文本
export interface TieredContent {
  original: string;                 // 原版繁体
  adapted: string;                  // 简化适配版（按学段调整难度）
  vernacular: string;               // 考点白话解读
}

// 生字/考点
export interface StudyPoint {
  char: string;                     // 生字
  pinyin: string;                   // 拼音
  explanation: string;              // 释义
  radical: string;                  // 部首
  strokes: number;                  // 笔画数
}

// 练习题
export interface Exercise {
  id: string;
  type: 'choice' | 'fill' | 'short_answer' | 'translation' | 'essay';
  question: string;
  options?: string[];               // 选择题选项
  answer: string;
  analysis: string;                 // 解析
  difficulty: 1 | 2 | 3;           // 题目难度
}

// 备课教案
export interface LessonPlan {
  id: string;
  title: string;
  targetGrade: GradeLevel;
  subject: string;                  // 学科（语文/历史等）
  textIds: string[];                // 关联古籍
  objectives: string[];             // 教学目标
  teachingProcess: TeachingStep[];  // 教学流程
  createdAt: string;
  authorId: string;
  isPublic: boolean;                // 是否公开分享
  downloads: number;
  tags: string[];
}

// 教学步骤
export interface TeachingStep {
  order: number;
  title: string;                    // 步骤标题（导入/精读/讨论/总结）
  duration: number;                 // 时长（分钟）
  content: string;                  // 教学内容
  ancientTextRef?: string;          // 引用的古籍文本
  tier?: TextTier;                  // 推荐使用的文本层级
  activities: string[];             // 课堂活动
}

// 阅读记录
export interface ReadingRecord {
  id: string;
  studentId: string;
  textId: string;
  tier: TextTier;
  progress: number;                 // 0-100
  timeSpent: number;                // 阅读时长（秒）
  exercisesCompleted: number;
  exercisesCorrect: number;
  lastReadAt: string;
}

// 研学任务单
export interface StudyTask {
  id: string;
  title: string;
  description: string;
  targetGrade: GradeLevel[];
  textIds: string[];
  exercises: Exercise[];
  createdAt: string;
  assignedCount: number;
  completedCount: number;
}

// 学情统计数据
export interface LearningStats {
  totalStudents: number;
  activeStudents: number;
  totalReadingTime: number;
  avgAccuracy: number;
  popularTexts: { textId: string; title: string; readCount: number }[];
  gradeDistribution: { grade: number; count: number }[];
  weeklyTrend: { date: string; readingCount: number }[];
}

// 教师备课统计
export interface TeachingStats {
  totalLessonPlans: number;
  publicLessonPlans: number;
  totalDownloads: number;
  popularPlans: { id: string; title: string; downloads: number }[];
  recentPlans: LessonPlan[];
}

// 用户角色
export type UserRole = 'student' | 'teacher' | 'librarian';

// 用户信息
export interface User {
  id: string;
  name: string;
  role: UserRole;
  grade?: GradeLevel;
  schoolStage?: SchoolStage;
  subject?: string;                 // 教师：所教学科
  school?: string;                  // 教师：学校名称（课外独立教师可填"独立教师"）
  avatar?: string;
}
