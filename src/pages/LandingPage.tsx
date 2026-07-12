import { Typography, Button, Row, Col, Card, Space, Tag, Divider } from 'antd';
import {
  ThunderboltOutlined, ReadOutlined, BulbOutlined,
  UserOutlined, RobotOutlined, BarChartOutlined, DatabaseOutlined,
  ArrowRightOutlined, ScanOutlined, AimOutlined, ExperimentOutlined,
  FileTextOutlined,
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
    <div style={{ background: '#fdfaf3' }}>
      {/* ===== Hero 区域 ===== */}
      <div style={{
        textAlign: 'center',
        padding: '100px 24px 80px',
        background: 'linear-gradient(160deg, #1a0f0a 0%, #2c1810 35%, #3c2415 70%, #1a0f0a 100%)',
        color: '#f5e6d3',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute', top: -60, right: -40,
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,134,11,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -60,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,58,49,0.08) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <span className="seal" style={{
              width: 64, height: 64, fontSize: 17,
              borderColor: '#b8860b', color: '#b8860b',
              margin: '0 auto', display: 'inline-flex',
              borderWidth: 2,
            }}>
              古籍探宝
            </span>
          </div>

          <Title style={{
            color: '#f5e6d3', fontSize: 44, marginBottom: 4, fontWeight: 800,
            letterSpacing: '0.02em',
          }}>
            基于 CADAL 古籍资源 的
          </Title>
          <Title style={{
            color: '#b8860b', fontSize: 36, marginTop: 0, marginBottom: 20,
            fontWeight: 700, letterSpacing: '0.03em',
          }}>
            义务教育课标智能适配与轻量化重构阅读系统
          </Title>

          <Paragraph style={{
            color: '#a89880', fontSize: 16, maxWidth: 680, margin: '0 auto 40px',
            lineHeight: 1.8,
          }}>
            对接义务教育语文课标 · AI 三层分级重构 · 真实用户视角定义需求
            <br />
            致力于解决"CADAL 280 万册古籍看不懂、不对应课本、无法服务教学"的现实难题
          </Paragraph>

          <Space size="middle" wrap>
            <Button
              size="large"
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => navigate('/demo')}
              style={{
                background: 'linear-gradient(135deg, #c43a31, #d4544a)',
                border: 'none',
                height: 48,
                padding: '0 32px',
                fontSize: 16,
                borderRadius: 8,
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(196,58,49,0.3)',
              }}
            >
              5 分钟系统演示
            </Button>
            <Button
              size="large"
              icon={<DatabaseOutlined />}
              onClick={() => navigate('/engine')}
              style={{
                height: 48, padding: '0 32px', fontSize: 16, borderRadius: 8,
                border: '1px solid rgba(184,134,11,0.4)', color: '#b8860b',
                background: 'rgba(184,134,11,0.06)',
              }}
            >
              课标匹配引擎
            </Button>
            <Button
              size="large"
              icon={<ReadOutlined />}
              onClick={() => enterSystem('student')}
              style={{
                height: 48, padding: '0 32px', fontSize: 16, borderRadius: 8,
                border: '1px solid rgba(245,230,211,0.3)', color: '#f5e6d3',
                background: 'rgba(245,230,211,0.06)',
              }}
            >
              进入系统
            </Button>
          </Space>
        </div>
      </div>

      {/* ===== 数字统计条 ===== */}
      <div style={{
        maxWidth: 1000, margin: '-40px auto 0', position: 'relative', zIndex: 2,
        padding: '0 24px',
      }}>
        <Row gutter={[16, 16]}>
          {[
            { value: '2.8M+', label: 'CADAL 古籍资源', color: '#c43a31' },
            { value: '1-12', label: '年级课标覆盖', color: '#b8860b' },
            { value: '3 层', label: 'AI 分级重构', color: '#5b8c5a' },
            { value: '5 min', label: '备课提效', color: '#2e5984' },
          ].map((item, i) => (
            <Col xs={12} sm={6} key={i}>
              <Card
                style={{
                  textAlign: 'center', borderRadius: 12,
                  border: '1px solid #e8d5b8',
                  boxShadow: '0 2px 12px rgba(44,24,16,0.06)',
                  background: '#fffef9',
                }}
                bodyStyle={{ padding: '20px 16px' }}
              >
                <Text style={{
                  fontSize: 28, fontWeight: 800, color: item.color,
                  display: 'block', lineHeight: 1.2,
                }}>
                  {item.value}
                </Text>
                <Text type="secondary" style={{ fontSize: 13, marginTop: 4, display: 'block' }}>
                  {item.label}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== 痛点区域 ===== */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Text type="secondary" style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Problem · 现实难题
          </Text>
          <Title level={2} style={{ color: '#2c1810', marginTop: 8, marginBottom: 12, fontWeight: 700 }}>
            CADAL 古籍资源服务教学的现实难题
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            海量古籍与课堂之间，隔着难度、隔着课标、隔着一整套面向真实学生的阅读工具。
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {[
            {
              num: '01', title: '280万册古籍，难以直接用于教学',
              desc: 'CADAL 拥有海量古籍、蒙学、方志资源，但原文晦涩、缺乏难度分级、未对标中小学课本。现有系统仅提供原版查看，学生难以自主阅读。',
            },
            {
              num: '02', title: '图书馆系统与义务教育衔接不足',
              desc: '现有图书馆系统和 CADAL 官网主要面向学术检索，缺乏面向小学生的内容适配和阅读引导功能，无法有效服务于义务教育阶段。',
            },
            {
              num: '03', title: '古籍教学工具市场存在空白',
              desc: '当前古籍数字化项目多聚焦学术校对、策展与检索，尚缺乏直接面向课堂教学、对接课标要求的古籍阅读工具，老师备课和学生拓展均缺乏抓手。',
            },
          ].map((item, i) => (
            <Col xs={24} sm={8} key={i}>
              <div>
                <Text style={{
                  fontSize: 48, fontWeight: 800, color: '#e8d5b8',
                  display: 'block', lineHeight: 1, marginBottom: 8,
                }}>
                  {item.num}
                </Text>
                <Title level={5} style={{ color: '#2c1810', marginBottom: 8, fontWeight: 600 }}>
                  {item.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.8 }}>
                  {item.desc}
                </Text>
                {i < 2 && <Divider style={{ margin: '24px 0 0', borderColor: '#f0e6d3' }} />}
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== 核心功能 ===== */}
      <div style={{ background: '#faf5eb', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Text type="secondary" style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Core Features · 原创功能体系
            </Text>
            <Title level={2} style={{ color: '#2c1810', marginTop: 8, marginBottom: 12, fontWeight: 700 }}>
              四大核心功能
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
              基于 CADAL 古籍资源库构建的原创功能体系，现有图书馆系统尚未覆盖。
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {[
              {
                num: '01 / 04', tag: '核心功能', tagColor: '#c43a31',
                icon: <RobotOutlined />,
                title: 'CADAL 古籍 AI 课标自动对标',
                desc: '系统自动扫描 CADAL 古籍，精准匹配 1-12 年级语文课本知识点。例如五年级学《杨氏之子》，自动从 CADAL 数万册古籍中筛选同源魏晋轶事古文，精准拓展课内知识。',
                highlight: '实现「课本知识点 ↔ CADAL 古籍」精准联动',
              },
              {
                num: '02 / 04', tag: '技术亮点', tagColor: '#5b8c5a',
                icon: <ReadOutlined />,
                title: '三层难度智能分级重构',
                desc: '对任意一篇 CADAL 繁体古籍，AI 自动生成：A级（原版繁体·学术留存）、B级（简化适配·适合精读）、C级（白话通识·预习理解）。基于语义重构实现难度梯度化，非简单翻译。',
                highlight: 'AI 语义重构，难度梯度化处理',
              },
              {
                num: '03 / 04', tag: '教学工具', tagColor: '#b8860b',
                icon: <BulbOutlined />,
                title: '古籍生字考点自动拆解',
                desc: '读取 CADAL 古籍后，系统自动标注必考生字、多音字、古今异义，自动生成课内同步练习题和默写考点，配套 CADAL 原版古籍溯源截图。',
                highlight: '备课效率从 2 小时缩短至 5 分钟',
              },
              {
                num: '04 / 04', tag: '落地应用', tagColor: '#2e5984',
                icon: <BarChartOutlined />,
                title: '图书馆研学智能任务生成',
                desc: '馆员后台一键生成古籍研学任务单、阅读打卡清单、分层作业。支持馆内试运行和长期展陈，满足赛事落地性要求。',
                highlight: '支持馆内试运行与长期展陈',
              },
            ].map((item, i) => (
              <Col xs={24} sm={12} key={i}>
                <Card
                  style={{
                    borderRadius: 12, border: '1px solid #e8d5b8',
                    boxShadow: '0 2px 16px rgba(44,24,16,0.04)',
                    height: '100%', background: '#fffef9',
                  }}
                  bodyStyle={{ padding: '28px 24px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Tag color={item.tagColor} style={{ borderRadius: 6, padding: '2px 12px', fontSize: 12 }}>
                      {item.tag}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 11, letterSpacing: '0.05em' }}>
                      {item.num}
                    </Text>
                  </div>

                  <Space align="start" style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 28, color: item.tagColor }}>{item.icon}</Text>
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{item.title}</Title>
                  </Space>

                  <Paragraph type="secondary" style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
                    {item.desc}
                  </Paragraph>

                  <div style={{
                    background: '#faf5eb', borderRadius: 8, padding: '10px 16px',
                    borderLeft: `3px solid ${item.tagColor}`,
                  }}>
                    <Text style={{ fontSize: 13, color: '#5c4a3a' }}>{item.highlight}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* ===== 工作流程 ===== */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Text type="secondary" style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Workflow · 工作流程
          </Text>
          <Title level={2} style={{ color: '#2c1810', marginTop: 8, marginBottom: 12, fontWeight: 700 }}>
            从古籍到课堂的四步旅程
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            一条清晰的智能流水线，让 CADAL 古籍从"藏在深处"走到"用在课上"。
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {[
            { step: '01', icon: <ScanOutlined />, title: 'AI 扫描 CADAL 古籍', desc: '系统自动读取 CADAL 开放接口，识别古籍朝代、体裁与语义结构。' },
            { step: '02', icon: <AimOutlined />, title: '对标义务教育课标', desc: '按 2022 版语文课标，自动匹配 1-12 年级课本知识点与考点分布。' },
            { step: '03', icon: <ExperimentOutlined />, title: '三层难度智能重构', desc: '生成 A 级原版留存 / B 级简化精读 / C 级白话通识，语义完整不失真。' },
            { step: '04', icon: <FileTextOutlined />, title: '教学与研学一键落地', desc: '教案、练习、打卡、展陈任务一次生成，老师、学生、馆员即取即用。' },
          ].map((item, i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: '#faf5eb', border: '1px solid #e8d5b8',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, fontSize: 22, color: '#c43a31',
                }}>
                  {item.icon}
                </div>
                <Text style={{
                  fontSize: 11, color: '#b8860b', fontWeight: 600,
                  display: 'block', marginBottom: 8, letterSpacing: '0.1em',
                }}>
                  {item.step}
                </Text>
                <Title level={5} style={{ marginBottom: 8, fontWeight: 600 }}>{item.title}</Title>
                <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.7 }}>{item.desc}</Text>
              </div>
            </Col>
          ))}
        </Row>

        {/* 底部引用 */}
        <div style={{
          textAlign: 'center', marginTop: 48,
          padding: '24px', background: '#faf5eb', borderRadius: 12,
        }}>
          <Text style={{ fontSize: 15, color: '#5c4a3a', lineHeight: 2, fontStyle: 'italic' }}>
            "让 280 万册古籍，真正走进小学、走进课堂、走进每一个孩子的语文课本。"
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            — 古籍探宝团队 · 基于 2022 版义务教育语文课程标准
          </Text>
        </div>
      </div>

      {/* ===== 团队分工 ===== */}
      <div style={{ background: '#faf5eb', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Text type="secondary" style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Team · 团队分工
            </Text>
            <Title level={2} style={{ color: '#2c1810', marginTop: 8, marginBottom: 12, fontWeight: 700 }}>
              团队分工
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
              用户视角 × AI 工程，双线并行，让"能用"与"好用"同时到位。
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 12, border: '1px solid #e8d5b8',
                  borderTop: '4px solid #c43a31',
                  boxShadow: '0 2px 16px rgba(44,24,16,0.04)',
                  height: '100%', background: '#fffef9',
                }}
                bodyStyle={{ padding: '32px 28px' }}
              >
                <Space align="start" size="middle">
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: '#fef5f4', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <UserOutlined style={{ fontSize: 22, color: '#c43a31' }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0, color: '#c43a31', fontWeight: 600 }}>
                      需求与产品设计
                    </Title>
                    <Tag color="#c43a31" style={{ marginTop: 6, borderRadius: 6 }}>用户视角 · 课标专业</Tag>
                  </div>
                </Space>
                <ul style={{ marginTop: 20, paddingLeft: 20, lineHeight: 2.2 }}>
                  <li>制定小学生古文难度分级标准（基于 2022 版语文课标）</li>
                  <li>梳理五六年级课内重难点、易错点和考点分布</li>
                  <li>设计面向儿童的界面交互逻辑与操作流程</li>
                  <li>演示讲解：用户需求分析、教育应用价值、落地场景</li>
                  <li>现场 Demo 示范，以真实用户身份验证产品价值</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 12, border: '1px solid #e8d5b8',
                  borderTop: '4px solid #2e5984',
                  boxShadow: '0 2px 16px rgba(44,24,16,0.04)',
                  height: '100%', background: '#fffef9',
                }}
                bodyStyle={{ padding: '32px 28px' }}
              >
                <Space align="start" size="middle">
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: '#f0f5f0', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ExperimentOutlined style={{ fontSize: 22, color: '#2e5984' }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0, color: '#2e5984', fontWeight: 600 }}>
                      技术开发与系统实现
                    </Title>
                    <Tag color="#2e5984" style={{ marginTop: 6, borderRadius: 6 }}>全栈开发 · AI 工程</Tag>
                  </div>
                </Space>
                <ul style={{ marginTop: 20, paddingLeft: 20, lineHeight: 2.2 }}>
                  <li>对接 CADAL 官方开放资源接口</li>
                  <li>搭建前端网页系统与 AI 语义处理模型</li>
                  <li>实现难度分级、文本重构、课标匹配算法</li>
                  <li>制作后台管理系统、数据看板与报表导出</li>
                  <li>保障现场 Demo 流畅稳定运行</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* ===== 三端入口 ===== */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Text type="secondary" style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            System · 三端系统入口
          </Text>
          <Title level={2} style={{ color: '#2c1810', marginTop: 8, marginBottom: 12, fontWeight: 700 }}>
            三端系统入口
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            学生读得懂、教师备得快、馆员管得全，一套系统串联真实教学场景。
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {[
            {
              icon: '🎒', color: '#c43a31', bgColor: '#fef5f4', role: 'student' as const,
              title: '学生阅读端',
              desc: '古籍探索 · 三层阅读 · 考点练习 · 研学任务',
              stat1: '12,860+', stat1Label: '在读古籍',
              stat2: '3,420', stat2Label: '完成任务',
              btnText: '进入学生阅读端',
            },
            {
              icon: '📝', color: '#5b8c5a', bgColor: '#f0f5f0', role: 'teacher' as const,
              title: '教师备课端',
              desc: 'AI 智能备课 · 教案管理 · 资源共享 · 教学统计',
              stat1: '8,742', stat1Label: '备课教案',
              stat2: '1,580', stat2Label: '服务教师',
              btnText: '进入教师备课端',
            },
            {
              icon: '📋', color: '#b8860b', bgColor: '#fdf8f0', role: 'librarian' as const,
              title: '馆员管理端',
              desc: '数据看板 · 古籍管理 · 研学分发 · 学情统计',
              stat1: '36 家', stat1Label: '接入馆藏',
              stat2: '268', stat2Label: '研学场次',
              btnText: '进入馆员管理端',
            },
          ].map((item, i) => (
            <Col xs={24} sm={8} key={i}>
              <Card
                hoverable
                style={{
                  borderRadius: 12, border: '1px solid #e8d5b8',
                  textAlign: 'center', height: '100%',
                  boxShadow: '0 2px 16px rgba(44,24,16,0.04)',
                  background: '#fffef9',
                }}
                bodyStyle={{ padding: '32px 20px' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: item.bgColor, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, marginBottom: 16,
                }}>
                  {item.icon}
                </div>

                <Title level={4} style={{ marginBottom: 4, fontWeight: 600 }}>{item.title}</Title>
                <Text type="secondary" style={{ fontSize: 13 }}>{item.desc}</Text>

                <Row gutter={16} style={{ margin: '20px 0' }}>
                  <Col span={12}>
                    <Text strong style={{ fontSize: 20, color: item.color, display: 'block' }}>
                      {item.stat1}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{item.stat1Label}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ fontSize: 20, color: item.color, display: 'block' }}>
                      {item.stat2}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>{item.stat2Label}</Text>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  block
                  icon={<ArrowRightOutlined />}
                  onClick={() => enterSystem(item.role)}
                  style={{
                    background: item.color, borderColor: item.color,
                    borderRadius: 8, height: 40, fontWeight: 500,
                  }}
                >
                  {item.btnText}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ===== 底部 ===== */}
      <div style={{
        textAlign: 'center', padding: '40px 24px',
        background: '#2c1810', color: '#a89880',
      }}>
        <Text style={{ color: '#d4c5b2', fontSize: 14, fontWeight: 500 }}>
          基于 CADAL 古籍资源的义务教育课标智能适配与轻量化重构阅读系统
        </Text>
        <br />
        <Text style={{ color: '#8b7355', fontSize: 12 }}>
          对接课标 · AI 语义分级 · 真实用户视角 · 图书馆可落地
        </Text>
      </div>
    </div>
  );
}
