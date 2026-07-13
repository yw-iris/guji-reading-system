import { Layout, Menu, Button, Space, Typography, Avatar, Dropdown } from 'antd';
import {
  ReadOutlined,
  BookOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SwapOutlined,
  UserOutlined,
  ExperimentOutlined,
  SnippetsOutlined,
  BarChartOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import type { MenuProps } from 'antd';
import { useState, useEffect } from 'react';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const studentMenus: MenuProps['items'] = [
  { key: '/student/explore', icon: <ReadOutlined />, label: '🔍 找古诗' },
  { key: '/student/reading', icon: <BookOutlined />, label: '📖 我读过的' },
  { key: '/student/tasks', icon: <FileTextOutlined />, label: '✏️ 我的作业' },
];

const teacherMenus: MenuProps['items'] = [
  { key: '/teacher/plans', icon: <SnippetsOutlined />, label: '备课教案' },
  { key: '/teacher/texts', icon: <ReadOutlined />, label: '古籍资源' },
  { key: '/teacher/create-plan', icon: <ExperimentOutlined />, label: 'AI 备课助手' },
  { key: '/teacher/stats', icon: <BarChartOutlined />, label: '教学统计' },
  { key: '/teacher/share', icon: <ShareAltOutlined />, label: '教案共享' },
];

const librarianMenus: MenuProps['items'] = [
  { key: '/librarian/dashboard', icon: <DashboardOutlined />, label: '数据看板' },
  { key: '/librarian/texts', icon: <BookOutlined />, label: '古籍管理' },
  { key: '/librarian/tasks', icon: <FileTextOutlined />, label: '研学管理' },
  { key: '/librarian/students', icon: <TeamOutlined />, label: '学生管理' },
];

const roleLabels: Record<string, { emoji: string; label: string; info: (user: { name?: string; grade?: number; subject?: string; school?: string }) => string }> = {
  student: {
    emoji: '🎒',
    label: '学生端',
    info: (u) => `${u.name || '小探宝'} · ${u.grade || 5}年级`,
  },
  teacher: {
    emoji: '📝',
    label: '教师端',
    info: (u) => `${u.name || '老师'} · ${u.subject || '语文'} · ${u.school || ''}`,
  },
  librarian: {
    emoji: '📋',
    label: '馆员端',
    info: () => '馆员工作台',
  },
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, sidebarCollapsed, toggleSidebar, switchRole, currentUser } = useAppStore();

  // 移动端检测：屏幕宽度 < 768px 时默认折叠侧边栏
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 移动端默认折叠侧边栏（仅首次检测时触发一次）
  useEffect(() => {
    if (isMobile && !sidebarCollapsed) {
      toggleSidebar();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const homeItem = { key: '/landing', icon: <HomeOutlined />, label: '首页' };
  const roleMenus: Record<string, MenuProps['items']> = {
    student: studentMenus,
    teacher: teacherMenus,
    librarian: librarianMenus,
  };
  const menus: MenuProps['items'] = [homeItem, ...(roleMenus[userRole] || [])];

  const roleInfo = roleLabels[userRole];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const roleSwitchItems: MenuProps['items'] = [
    { key: 'student', label: '🎒 学生端', icon: <UserOutlined /> },
    { key: 'teacher', label: '📝 教师端', icon: <ExperimentOutlined /> },
    { key: 'librarian', label: '📋 馆员端', icon: <TeamOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={220}
        style={{
          background: 'linear-gradient(180deg, #2c1810 0%, #3c2415 100%)',
          borderRight: '1px solid #5c4a3a',
        }}
      >
        {/* Logo - 点击返回首页 */}
        <div
          onClick={() => navigate('/landing')}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #5c4a3a',
            padding: '0 16px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.8'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
          title="返回首页"
        >
          {sidebarCollapsed ? (
            <span className="seal" style={{ width: 36, height: 36, fontSize: 11 }}>古籍</span>
          ) : (
            <Space>
              <span className="seal" style={{ width: 36, height: 36, fontSize: 11 }}>古籍</span>
              <Text strong style={{ color: '#f5e6d3', fontSize: 16 }}>
                古籍探宝
              </Text>
            </Space>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menus}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            borderRight: 'none',
            marginTop: 8,
          }}
        />

        {/* Demo 演示入口 */}
        <div style={{ position: 'absolute', bottom: 80, width: '100%', padding: '0 16px' }}>
          <Button
            block
            type="text"
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/demo')}
            style={{ color: '#c43a31' }}
          >
            {sidebarCollapsed ? '' : '⚡ 系统演示'}
          </Button>
        </div>

        {/* 底部角色切换 */}
        <div style={{ position: 'absolute', bottom: 16, width: '100%', padding: '0 16px' }}>
          <Dropdown
            menu={{
              items: roleSwitchItems,
              onClick: ({ key }) => switchRole(key as 'student' | 'teacher' | 'librarian'),
            }}
            trigger={['click']}
          >
            <Button
              block
              type="text"
              icon={<SwapOutlined />}
              style={{ color: '#b8860b' }}
            >
              {sidebarCollapsed ? '' : roleInfo.label}
            </Button>
          </Dropdown>
        </div>
      </Sider>

      <Layout>
        {/* 顶部栏 */}
        <Header
          className="app-header"
          style={{
            background: '#fdfaf3',
            borderBottom: '1px solid #d4c5b2',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: 16, width: 40, height: 40 }}
          />

          <Space className="app-header-info">
            <Text type="secondary" style={{ fontSize: 13 }}>
              {roleInfo.emoji} {roleInfo.info(currentUser || {})}
            </Text>
            <Avatar
              icon={<UserOutlined />}
              style={{ background: userRole === 'teacher' ? '#5b8c5a' : userRole === 'librarian' ? '#b8860b' : '#c43a31' }}
            />
          </Space>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: 0,
            padding: 0,
            minHeight: 280,
            background: '#fdfaf3',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* 移动端响应式样式 */}
      <style>{`
        @media (max-width: 768px) {
          .app-header {
            padding: 0 12px !important;
            height: 56px !important;
          }
          .app-header-info {
            gap: 4px !important;
          }
          .app-header-info .ant-typography {
            font-size: 11px !important;
          }
        }
      `}</style>
    </Layout>
  );
}
