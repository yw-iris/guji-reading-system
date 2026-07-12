import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/layout/AppLayout';

// Landing Page（独立页面，不需要侧边栏）
import LandingPage from './pages/LandingPage';

// Demo 路演页（独立页面）
import DemoPage from './pages/demo/DemoPage';

// 学生端页面
import ExplorePage from './pages/student/ExplorePage';
import ReadingPage from './pages/student/ReadingPage';
import MyReadingPage from './pages/student/MyReadingPage';

// 教师端页面
import TeacherPlansPage from './pages/teacher/PlansPage';
import TeacherTextsPage from './pages/teacher/TextsPage';
import CreatePlanPage from './pages/teacher/CreatePlanPage';
import TeacherStatsPage from './pages/teacher/StatsPage';
import SharePage from './pages/teacher/SharePage';

// 馆员端页面
import DashboardPage from './pages/librarian/DashboardPage';
import TextsManagePage from './pages/librarian/TextsManagePage';
import TasksManagePage from './pages/librarian/TasksManagePage';
import StudentsPage from './pages/librarian/StudentsPage';

import { useAppStore } from './stores/appStore';
import { mockUser } from './utils/mockData';
import { useEffect } from 'react';

// 古籍风格主题配置
const gujiTheme = {
  token: {
    colorPrimary: '#c43a31',
    colorSuccess: '#5b8c5a',
    colorWarning: '#b8860b',
    colorInfo: '#2e5984',
    borderRadius: 6,
    fontFamily: `'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', 'KaiTi', serif`,
    colorBgContainer: '#fdfaf3',
    colorBgElevated: '#fdfaf3',
    colorBorderSecondary: '#d4c5b2',
    controlItemBgHover: '#f5e6d3',
  },
};

function App() {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    setUser(mockUser);
  }, [setUser]);

  return (
    <ConfigProvider theme={gujiTheme} locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* Landing Page - 独立页面 */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Demo 路演页 - 独立页面 */}
          <Route path="/demo" element={<DemoPage />} />

          {/* 三端系统 - 带侧边栏 */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/landing" replace />} />

            {/* 学生端 */}
            <Route path="student/explore" element={<ExplorePage />} />
            <Route path="student/reading/:textId" element={<ReadingPage />} />
            <Route path="student/reading" element={<MyReadingPage />} />
            <Route path="student/tasks" element={<MyReadingPage />} />

            {/* 教师端 */}
            <Route path="teacher/plans" element={<TeacherPlansPage />} />
            <Route path="teacher/texts" element={<TeacherTextsPage />} />
            <Route path="teacher/create-plan" element={<CreatePlanPage />} />
            <Route path="teacher/stats" element={<TeacherStatsPage />} />
            <Route path="teacher/share" element={<SharePage />} />

            {/* 馆员端 */}
            <Route path="librarian/dashboard" element={<DashboardPage />} />
            <Route path="librarian/texts" element={<TextsManagePage />} />
            <Route path="librarian/tasks" element={<TasksManagePage />} />
            <Route path="librarian/students" element={<StudentsPage />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
