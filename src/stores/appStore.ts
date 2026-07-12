import { create } from 'zustand';
import type { User, UserRole, AncientText, ReadingRecord, StudyTask, LearningStats, TextTier, LessonPlan, TeachingStats } from '../types';

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
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  userRole: 'student',
  setUser: (user) => set({ currentUser: user, userRole: user.role }),
  switchRole: (role) => set({ userRole: role }),

  texts: [],
  setTexts: (texts) => set({ texts }),

  currentText: null,
  currentTier: 'adapted',
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
}));
