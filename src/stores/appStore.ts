import { create } from 'zustand';
import type { User, UserRole, AncientText, ReadingRecord, StudyTask, LearningStats, TextTier, LessonPlan, TeachingStats, GradeLevel } from '../types';

// ===== 古籍列���筛选缓存 =====
const textCache: Record<string, AncientText[]> = {};
const cacheTimestamp: Record<string, number> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟过期

function buildCacheKey(filters: { grade?: number | null; dynasty?: string | null; keyword?: string }): string {
  return `${filters.grade ?? 'all'}|${filters.dynasty ?? 'all'}|${filters.keyword ?? ''}`;
}

function getFilteredTextsFromCache(
  allTexts: AncientText[],
  filters: { grade?: number | null; dynasty?: string | null; keyword?: string }
): AncientText[] {
  const key = buildCacheKey(filters);
  const now = Date.now();

  // 检查缓存是否有效
  if (textCache[key] && cacheTimestamp[key] && (now - cacheTimestamp[key] < CACHE_TTL)) {
    return textCache[key];
  }

  // 执行筛选
  let result = [...allTexts];
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.includes(kw) ||
        t.author.includes(kw) ||
        t.tags.some((tag) => tag.includes(kw))
    );
  }
  if (filters.grade) {
    result = result.filter((t) => t.gradeLevel.includes(filters.grade as GradeLevel));
  }
  if (filters.dynasty) {
    result = result.filter((t) => t.dynasty === filters.dynasty);
  }

  // 写入缓存
  textCache[key] = result;
  cacheTimestamp[key] = now;

  return result;
}

// ===== 全局状态管理 =====

interface AppState {
  // 用户
  currentUser: User | null;
  userRole: UserRole;
  setUser: (user: User) => void;
  switchRole: (role: UserRole) => void;

  // 古籍列表
  texts: AncientText[];
  setTexts: (texts: AncientText[]) => void;

  // 当前阅读的古籍
  currentText: AncientText | null;
  currentTier: TextTier;
  setCurrentText: (text: AncientText | null) => void;
  setCurrentTier: (tier: TextTier) => void;

  // 阅读记录
  readingRecords: ReadingRecord[];
  addReadingRecord: (record: ReadingRecord) => void;

  // 研学任务
  studyTasks: StudyTask[];
  setStudyTasks: (tasks: StudyTask[]) => void;
  addStudyTask: (task: StudyTask) => void;

  // 学情数据
  learningStats: LearningStats | null;
  setLearningStats: (stats: LearningStats) => void;

  // 备课教案
  lessonPlans: LessonPlan[];
  setLessonPlans: (plans: LessonPlan[]) => void;
  addLessonPlan: (plan: LessonPlan) => void;

  // 教师端统计
  teachingStats: TeachingStats | null;
  setTeachingStats: (stats: TeachingStats) => void;

  // 侧边栏
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // 搜索
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;

  // 年级筛选
  selectedGrade: number | null;
  setSelectedGrade: (grade: number | null) => void;

  // 学段筛选
  selectedSchoolStage: string | null;
  setSelectedSchoolStage: (stage: string | null) => void;

  // 缓存筛选
  getFilteredTexts: (filters: { grade?: number | null; dynasty?: string | null; keyword?: string }) => AncientText[];

  // 积分系统
  points: number;
  addPoints: (n: number) => void;

  // 隧道转场（跨页面）
  warp: { name: string; color: string } | null;
  startWarp: (w: { name: string; color: string }) => void;
  endWarp: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  userRole: 'student',
  setUser: (user) => set({ currentUser: user, userRole: user.role }),
  switchRole: (role) => set({ userRole: role }),

  texts: [],
  setTexts: (texts) => set({ texts }),

  currentText: null,
  currentTier: 'vernacular',
  setCurrentText: (text) => set({ currentText: text }),
  setCurrentTier: (tier) => set({ currentTier: tier }),

  readingRecords: [],
  addReadingRecord: (record) =>
    set((state) => ({ readingRecords: [...state.readingRecords, record] })),

  studyTasks: [],
  setStudyTasks: (tasks) => set({ studyTasks: tasks }),
  addStudyTask: (task) =>
    set((state) => ({ studyTasks: [...state.studyTasks, task] })),

  learningStats: null,
  setLearningStats: (stats) => set({ learningStats: stats }),

  lessonPlans: [],
  setLessonPlans: (plans) => set({ lessonPlans: plans }),
  addLessonPlan: (plan) =>
    set((state) => ({ lessonPlans: [...state.lessonPlans, plan] })),

  teachingStats: null,
  setTeachingStats: (stats) => set({ teachingStats: stats }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  selectedGrade: null,
  setSelectedGrade: (grade) => set({ selectedGrade: grade }),

  selectedSchoolStage: null,
  setSelectedSchoolStage: (stage) => set({ selectedSchoolStage: stage }),

  getFilteredTexts: (filters) => getFilteredTextsFromCache(get().texts, filters),

  points: 0,
  addPoints: (n) => set((state) => ({ points: state.points + n })),

  warp: null,
  startWarp: (w) => set({ warp: w }),
  endWarp: () => set({ warp: null }),
}));

// 将 getFilteredTextsFromCache 也导出供外部使用
export { getFilteredTextsFromCache };
