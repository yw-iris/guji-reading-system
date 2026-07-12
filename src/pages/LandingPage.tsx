import { Typography, Button, Row, Col, Card, Space, Tag } from 'antd';
import {
  ThunderboltOutlined, ExperimentOutlined,
  TrophyOutlined, ReadOutlined, BulbOutlined,
  UserOutlined, RobotOutlined, BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';

const { Title, Text, Paragraph } = Typography;

export default function LandingPage() {
  const navigate = useNavigate();
  const switchRole = useAppStore(s => s.switchRole);

  const enterSystem = (role: 'student' | 'teacher' | 'librarian') => {
    switchRole(role);
    const routes: Record<string, string> = {
      student: '/student/explore',
      teacher: '/teacher/plans',
      librarian: '/librarian/dashboard',
    };
    navigate(routes[role]);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fdfaf3 0%, #f5e6d3 100%)' }}>
      {/* Hero 区域 */}
      <div style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        background: 'linear-gradient(135deg, #2c1810 0%, #3c2415 40%, #5c3a1e 100%)',
        color: '#f5e6d3',
      }}>
        <div style={{ marginBottom: 24 }}>
          <span className="seal" style={{
            width: 80, height: 80, fontSize: 22,
            borderColor: '#b8860b', color: '#b8860b',
            margin: '0 auto',
          }}>
            古籍探宝
          </span>
        </div>

        <Title style={{ color: '#f5e6d3', fontSize: 36, marginBottom: 8, fontWeight: 700 }}>
          基于CADAL古籍资源的
        </Title>
        <Title style={{ color: '#b8860b', fontSize: 32, marginTop: 0, marginBottom: 16 }}>
          义务教育课标智能适配与轻量化重构阅读系统
        </Title>

        <Paragraph style={{ color: '#d4c5b2', fontSize: 16, maxWidth: 700, margin: '0 auto 32px' }}>
          全场唯一对接义务教育课标 · AI三层分级重构 · 真实小学生视角定义需求
          <br />
          解决"CADAL 280万册古籍看不懂、不对应课本、无法服务教学"的世界级痛点
        </Paragraph>

        <Space size="large" wrap>
          <Button
            size="large"
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/demo')}
            style={{
              background: 'linear-gradient(135deg, #c43a31, #e8493a)',
              border: 'none',
              height: 52,
              padding: '0 36px',
              fontSize: 17,
              borderRadius: 8,
            }}
          >
            5 分钟路演 Demo
          </Button>
          <Button
            size="large"
            icon={<ReadOutlined />}
            onClick={() => enterSystem('student')}
            style={{
              height: 52,
              padding: '0 36px',
              fontSize: 17,
              borderRadius: 8,
              border: '1px solid #b8860b',
              color: '#b8860b',
            }}
          >
            进入系统
          </Button>
        </Space>
      </div>

      {/* 三大痛点 */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#2c1810', marginBottom: 32 }}>
          ⚡ CADAL 现存的世界级硬痛点（所有队伍都没解决）
        </Title>
        <Row gutter={[24, 24]}>
          {[
            {
              icon: '📚', title: '280万册古籍，无人能读',
              desc: 'CADAL 拥有海量古籍、蒙学、方志资源，但原文晦涩、无难度分级、不对应中小学课本。现有系统只能看原版，学生根本看不懂。',
            },
            {
              icon: '🏫', title: '图书馆系统与教学脱节',
              desc: '现有图书馆系统、CADAL 官网只能检索和查看原版古籍，不能自动适配小学生水平，无法服务于义务教育。',
            },
            {
              icon: '🎓', title: '大学生项目只做表面功夫',
              desc: '所有浙大参赛队只会做古籍校对、数字策展、学术检索——全部是老旧赛道，内卷严重，不能真正落地教学。',
            },
          ].map((item, i) => (
            <Col xs={24} sm={8} key={i}>
              <Card className="parchment-card" style={{ height: '100%', textAlign: 'center' }}>
                <Text style={{ fontSize: 40 }}>{item.icon}</Text>
                <Title level={5}>{item.title}</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>{item.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 四大核心功能 */}
      <div style={{ background: '#faf5eb', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Title level={3} style={{ textAlign: 'center', color: '#2c1810', marginBottom: 8 }}>
            🤖 四大核心技术功能（CADAL 官方完全没有）
          </Title>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
            所有功能现有图书馆、CADAL官方完全没有，属于原创创新系统
          </Text>
          <Row gutter={[16, 16]}>
            {[
              {
                icon: <RobotOutlined />, tag: '核心大招',
                title: 'CADAL古籍AI课标自动对标',
                desc: '系统自动扫描CADAL古籍，精准匹配1-12年级语文课本知识点。例如五年级学《杨氏之子》，自动从CADAL数万册古籍中筛选同源魏晋轶事古文，精准拓展课内知识。',
                highlight: '碾压点：全场唯一实现「课本+古籍精准联动」',
              },
              {
                icon: <ReadOutlined />, tag: '技术壁垒',
                title: '三层难度智能分级重构',
                desc: '对任意一篇CADAL繁体古籍，AI自动生成：A级（原版繁体·学术留存）、B级（简化适配·适合精读）、C级（白话通识·预习理解）。不是简单翻译，是语义重构、难度梯度化。',
                highlight: '技术含金量远超普通学生作品',
              },
              {
                icon: <BulbOutlined />, tag: '独创',
                title: '古籍生字考点自动拆解',
                desc: '读取CADAL古籍后，系统自动标注必考生字、多音字、古今异义，自动生成课内同步练习题、默写考点，配套CADAL原版古籍溯源截图。',
                highlight: '老师备课直接从2小时缩到5分钟',
              },
              {
                icon: <BarChartOutlined />, tag: '落地',
                title: '图书馆研学智能任务生成',
                desc: '馆员后台一键生成小学古籍研学任务单、阅读打卡清单、分层作业。完美满足赛事要求：可馆内试运行、可长期展陈、可落地教学。',
                highlight: '满足赛事3-5件展陈硬性要求',
              },
            ].map((item, i) => (
              <Col xs={24} sm={12} key={i}>
                <Card className="parchment-card" style={{ height: '100%' }}>
                  <Space>
                    <Tag color="#c43a31">{item.tag}</Tag>
                    <Text style={{ fontSize: 24, color: '#c43a31' }}>{item.icon}</Text>
                  </Space>
                  <Title level={5} style={{ marginTop: 8 }}>{item.title}</Title>
                  <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 8 }}>
                    {item.desc}
                  </Paragraph>
                  <Tag color="gold" icon={<TrophyOutlined />}>{item.highlight}</Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 双人分工 */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
        <Title level={3} style={{ textAlign: 'center', color: '#2c1810', marginBottom: 32 }}>
          👥 双人精准分工
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              className="parchment-card"
              style={{ borderTop: '4px solid #c43a31', height: '100%' }}
            >
              <Space align="start">
                <UserOutlined style={{ fontSize: 40, color: '#c43a31' }} />
                <div>
                  <Title level={4} style={{ margin: 0, color: '#c43a31' }}>五年级核心创始人</Title>
                  <Tag color="#c43a31" style={{ marginTop: 4 }}>全场最大加分项 · 不可替代</Tag>
                </div>
              </Space>
              <ul style={{ marginTop: 16, paddingLeft: 20 }}>
                <li style={{ marginBottom: 6 }}>制定小学生古文难度分级标准（浙大大学生根本不懂课标）</li>
                <li style={{ marginBottom: 6 }}>筛选五六年级真实课内重难点、易错点</li>
                <li style={{ marginBottom: 6 }}>设计软件界面的儿童友好逻辑、操作流程</li>
                <li style={{ marginBottom: 6 }}>路演主讲：用户痛点、教育价值、落地意义</li>
                <li>现场 Demo 体验示范，以真实学生身份背书作品</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              className="parchment-card"
              style={{ borderTop: '4px solid #2e5984', height: '100%' }}
            >
              <Space align="start">
                <ExperimentOutlined style={{ fontSize: 40, color: '#2e5984' }} />
                <div>
                  <Title level={4} style={{ margin: 0, color: '#2e5984' }}>浙大技术合伙人</Title>
                  <Tag color="#2e5984" style={{ marginTop: 4 }}>技术实现 · 拉高作品上限</Tag>
                </div>
              </Space>
              <ul style={{ marginTop: 16, paddingLeft: 20 }}>
                <li style={{ marginBottom: 6 }}>对接 CADAL 官方开放资源接口</li>
                <li style={{ marginBottom: 6 }}>搭建前端网页系统、AI语义处理模型</li>
                <li style={{ marginBottom: 6 }}>实现难度分级、文本重构、课标匹配算法</li>
                <li style={{ marginBottom: 6 }}>制作后台管理系统、数据看板、导出报表</li>
                <li>支撑现场流畅 Demo、无 Bug 运行</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 三端入口 */}
      <div style={{ background: '#faf5eb', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Title level={3} style={{ textAlign: 'center', color: '#2c1810', marginBottom: 32 }}>
            🚀 三端系统入口
          </Title>
          <Row gutter={[24, 24]}>
            {[
              {
                icon: <ReadOutlined />, color: '#c43a31', role: 'student' as const,
                title: '🎒 学生阅读端', desc: '古籍探索 · 三层阅读 · 考点练习 · 研学任务',
              },
              {
                icon: <RobotOutlined />, color: '#5b8c5a', role: 'teacher' as const,
                title: '📝 教师备课端', desc: 'AI智能备课 · 教案管理 · 资源共享 · 教学统计',
              },
              {
                icon: <BarChartOutlined />, color: '#b8860b', role: 'librarian' as const,
                title: '📋 馆员管理端', desc: '数据看板 · 古籍管理 · 研学分发 · 学情统计',
              },
            ].map((item, i) => (
              <Col xs={24} sm={8} key={i}>
                <Card
                  className="parchment-card"
                  hoverable
                  style={{ textAlign: 'center', borderTop: `4px solid ${item.color}` }}
                  onClick={() => enterSystem(item.role)}
                >
                  <Text style={{ fontSize: 40 }}>{item.icon}</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>{item.title}</Title>
                  <Text type="secondary">{item.desc}</Text>
                  <br />
                  <Button type="primary" style={{ marginTop: 16, background: item.color, borderColor: item.color }}>
                    进入
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 底部 */}
      <div style={{ textAlign: 'center', padding: '32px 24px', background: '#2c1810', color: '#d4c5b2' }}>
        <Text style={{ color: '#d4c5b2', fontSize: 13 }}>
          基于CADAL古籍资源的义务教育课标智能适配与轻量化重构阅读系统
        </Text>
        <br />
        <Text style={{ color: '#8b7355', fontSize: 12 }}>
          赛道独家 · 真实小学生视角 · AI语义分级 · 图书馆可落地
        </Text>
      </div>
    </div>
  );
}
