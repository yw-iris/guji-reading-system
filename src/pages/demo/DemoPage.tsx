import { useState, useEffect } from 'react';
import {
  Typography, Card, Row, Col, Button, Space, Tag, Steps, Divider,
  Alert, Spin, Descriptions, Collapse, Image,
} from 'antd';
import {
  ThunderboltOutlined, CheckCircleOutlined,
  ExperimentOutlined, TrophyOutlined,
  BulbOutlined, DownloadOutlined,
  PlayCircleOutlined, StarOutlined,
  ScanOutlined, RobotOutlined, ReadOutlined, BarChartOutlined,
} from '@ant-design/icons';
import { mockTexts, mockTieredContent } from '../../utils/mockData';

const { Title, Text, Paragraph } = Typography;

// 路演步骤
const demoSteps = [
  { title: '调取古籍', description: 'CADAL随机调取', icon: <ScanOutlined /> },
  { title: '课标对标', description: '一键匹配五年级考点', icon: <RobotOutlined /> },
  { title: '三层重构', description: '原版/适配/白话', icon: <ReadOutlined /> },
  { title: '考点拆解', description: '生字+习题自动生成', icon: <BulbOutlined /> },
  { title: '研学落地', description: '任务单+数据看板', icon: <BarChartOutlined /> },
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 路演用古籍：选一篇有代表性的
  const demoText = mockTexts.find(t => t.id === 'text-005') || mockTexts[4]; // 论语
  const tieredContent = mockTieredContent[demoText?.id || 'text-005'];

  const startDemo = () => {
    setIsRunning(true);
    setShowResult(false);
    setCurrentStep(0);
  };

  // 自动推进步骤
  useEffect(() => {
    if (!isRunning) return;
    if (currentStep < 4) {
      const timer = setTimeout(() => setCurrentStep(s => s + 1), 2000);
      return () => clearTimeout(timer);
    } else if (currentStep === 4) {
      const timer = setTimeout(() => {
        setShowResult(true);
        setIsRunning(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isRunning]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* 顶部标题区 - 正式路演名称 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Space>
          <span className="seal" style={{ width: 56, height: 56, fontSize: 14 }}>古籍探宝</span>
        </Space>
        <Title level={2} style={{ color: '#2c1810', marginTop: 12, marginBottom: 4 }}>
          基于CADAL古籍资源的义务教育课标智能适配与轻量化重构阅读系统
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          对接义务教育课标 · AI三层分级重构 · 图书馆可落地试运行
        </Text>
      </div>

      {/* 系统亮点标签 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Space wrap size="middle">
          {[
            { icon: <TrophyOutlined />, text: '教育落地·课标适配', color: '#c43a31' },
            { icon: <StarOutlined />, text: '真实用户视角定义', color: '#b8860b' },
            { icon: <ExperimentOutlined />, text: 'AI语义分级重构', color: '#5b8c5a' },
            { icon: <CheckCircleOutlined />, text: '馆内可试运行', color: '#2e5984' },
          ].map((item, i) => (
            <Tag key={i} color={item.color} style={{ fontSize: 13, padding: '4px 12px' }}>
              {item.icon} {item.text}
            </Tag>
          ))}
        </Space>
      </div>

      {/* 核心痛点展示 */}
      <Alert
        message="CADAL 有 280 万册古籍资源，但原文晦涩、无难度分级、不对应中小学课本——现有系统只能看原版，无法直接服务义务教育。本系统旨在填补这一空白。"
        type="warning"
        showIcon
        style={{ marginBottom: 24, fontSize: 13 }}
      />

      {/* Demo 控制区 */}
      <Card
        className="parchment-card"
        style={{ marginBottom: 24, textAlign: 'center' }}
      >
        {!isRunning && !showResult && (
          <div style={{ padding: '40px 0' }}>
            <PlayCircleOutlined style={{ fontSize: 72, color: '#c43a31', marginBottom: 16 }} />
            <Title level={3} style={{ color: '#2c1810' }}>
              5 分钟系统演示 Demo
            </Title>
            <Paragraph type="secondary" style={{ maxWidth: 600, margin: '0 auto 24px' }}>
              随机调取一篇 CADAL 古籍 → 匹配课标 → AI 三层重构 → 考点拆解 → 研学任务落地
            </Paragraph>
            <Button
              size="large"
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={startDemo}
              style={{
                background: 'linear-gradient(135deg, #c43a31, #e8493a)',
                border: 'none',
                height: 52,
                padding: '0 40px',
                fontSize: 17,
                borderRadius: 8,
              }}
            >
              开始演示 Demo
            </Button>
          </div>
        )}

        {/* 步骤动画 */}
        {isRunning && (
          <div style={{ padding: '40px 0' }}>
            <Steps
              current={currentStep}
              items={demoSteps.map((s, i) => ({
                title: s.title,
                description: s.description,
                icon: currentStep === i ? <Spin size="small" /> : currentStep > i ? <CheckCircleOutlined /> : s.icon,
                status: currentStep > i ? 'finish' : currentStep === i ? 'process' : 'wait',
              }))}
            />

            <div style={{ marginTop: 40, minHeight: 120 }}>
              {currentStep === 0 && (
                <div className="fade-in">
                  <Spin size="large" />
                  <Title level={4} style={{ marginTop: 16, color: '#5b8c5a' }}>
                    正在从 CADAL 调取古籍资源...
                  </Title>
                  <Text type="secondary">
                    CADAL ID: {demoText.cadalId} · 匹配学段：{demoText.schoolStage.includes('primary') ? '小学' : '中学'}
                  </Text>
                </div>
              )}
              {currentStep === 1 && (
                <div className="fade-in">
                  <Spin size="large" />
                  <Title level={4} style={{ marginTop: 16, color: '#5b8c5a' }}>
                    AI 正在对标义务教育语文课标...
                  </Title>
                  <Text type="secondary">
                    自动匹配 {demoText.gradeLevel.join('、')} 年级知识点
                  </Text>
                </div>
              )}
              {currentStep === 2 && (
                <div className="fade-in">
                  <Spin size="large" />
                  <Title level={4} style={{ marginTop: 16, color: '#5b8c5a' }}>
                    AI 正在生成三层分级文本...
                  </Title>
                  <Space>
                    <Tag color="orange">A级：原版繁体</Tag>
                    <Tag color="green">B级：简化适配</Tag>
                    <Tag color="blue">C级：白话通识</Tag>
                  </Space>
                </div>
              )}
              {currentStep === 3 && (
                <div className="fade-in">
                  <Spin size="large" />
                  <Title level={4} style={{ marginTop: 16, color: '#5b8c5a' }}>
                    AI 正在拆解生字考点与同步练习...
                  </Title>
                  <Text type="secondary">标注必考生字、古今异义、多音字</Text>
                </div>
              )}
              {currentStep === 4 && (
                <div className="fade-in">
                  <Spin size="large" />
                  <Title level={4} style={{ marginTop: 16, color: '#5b8c5a' }}>
                    正在生成图书馆研学任务单...
                  </Title>
                  <Text type="secondary">一键导出，可直接馆内展陈使用</Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 完整结果展示 */}
        {showResult && (
          <div className="fade-in">
            <Alert
              message="Demo 完成！5 分钟内完成全部流程：调取 → 对标 → 重构 → 拆解 → 落地"
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Row gutter={[16, 16]}>
              {/* 1. CADAL 原图 */}
              <Col xs={24} lg={8}>
                <Card
                  title="📷 CADAL 古籍原图溯源"
                  className="parchment-card"
                  size="small"
                >
                  <Image
                    src={demoText.cadalImageUrl}
                    style={{ width: '100%', borderRadius: 8 }}
                    fallback="https://placehold.co/400x500/f5e6d3/8b4513?text=CADAL古籍原图"
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text style={{ fontSize: 11 }} type="secondary">
                      CADAL: {demoText.cadalId} · {demoText.author} · {demoText.dynasty}
                    </Text>
                  </div>
                </Card>
              </Col>

              {/* 2. 三层文本 */}
              <Col xs={24} lg={16}>
                <Card
                  title="📖 AI 三层难度分级重构"
                  className="parchment-card"
                  size="small"
                >
                  <Collapse
                    defaultActiveKey={['adapted']}
                    items={[
                      {
                        key: 'original',
                        label: (
                          <Space>
                            <Tag color="orange">A级</Tag>
                            <Text strong>原版繁体（学术留存）</Text>
                          </Space>
                        ),
                        children: (
                          <Paragraph style={{ fontSize: 16, lineHeight: 2, fontFamily: '"Noto Serif SC", "STSong", serif' }}>
                            {tieredContent?.original}
                          </Paragraph>
                        ),
                      },
                      {
                        key: 'adapted',
                        label: (
                          <Space>
                            <Tag color="green">B级</Tag>
                            <Text strong>简化适配版（适合小学生精读）</Text>
                          </Space>
                        ),
                        children: (
                          <Paragraph style={{ fontSize: 16, lineHeight: 2 }}>
                            {tieredContent?.adapted}
                          </Paragraph>
                        ),
                      },
                      {
                        key: 'vernacular',
                        label: (
                          <Space>
                            <Tag color="blue">C级</Tag>
                            <Text strong>白话通识版（预习理解+考点标注）</Text>
                          </Space>
                        ),
                        children: (
                          <Paragraph style={{ fontSize: 15, lineHeight: 2 }}>
                            {tieredContent?.vernacular}
                          </Paragraph>
                        ),
                      },
                    ]}
                  />
                </Card>
              </Col>

              {/* 3. 课标对标 */}
              <Col xs={24} lg={12}>
                <Card
                  title="🎯 课标精准对标"
                  className="parchment-card"
                  size="small"
                >
                  {demoText.textbookMatch.map((match, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <Descriptions column={2} size="small" bordered>
                        <Descriptions.Item label="年级">{match.grade}年级{match.semester}学期</Descriptions.Item>
                        <Descriptions.Item label="课文">{match.lessonName}</Descriptions.Item>
                        <Descriptions.Item label="单元">{match.unit}</Descriptions.Item>
                        <Descriptions.Item label="CADAL对标古籍">{demoText.title}</Descriptions.Item>
                      </Descriptions>
                      <div style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 12 }}>关联知识点：</Text>
                        <Space wrap>
                          {match.knowledgePoints.map((kp, j) => (
                            <Tag key={j} color="green">{kp}</Tag>
                          ))}
                        </Space>
                      </div>
                    </div>
                  ))}
                  <Alert
                    message="实现「课本知识点 ↔ CADAL古籍」精准联动，自动匹配拓展阅读资源。"
                    type="info"
                    showIcon
                    style={{ marginTop: 8, fontSize: 12 }}
                  />
                </Card>
              </Col>

              {/* 4. 考点拆解 */}
              <Col xs={24} lg={12}>
                <Card
                  title="📝 生字考点自动拆解"
                  className="parchment-card"
                  size="small"
                >
                  <Row gutter={[8, 8]}>
                    {[
                      { char: '说', pinyin: 'yuè', note: '通"悦"，高兴', type: '通假字' },
                      { char: '愠', pinyin: 'yùn', note: '恼怒、生气', type: '生字' },
                      { char: '君子', pinyin: 'jūn zǐ', note: '有德行的人', type: '古今异义' },
                      { char: '习', pinyin: 'xí', note: '温习、实践', type: '多义词' },
                    ].map((item, i) => (
                      <Col xs={12} key={i}>
                        <Card size="small" style={{ background: '#faf5eb' }}>
                          <Space direction="vertical" size={0}>
                            <Space>
                              <Text strong style={{ fontSize: 20 }}>{item.char}</Text>
                              <Tag color="#c43a31">{item.type}</Tag>
                            </Space>
                            <Text style={{ fontSize: 12 }} type="secondary">{item.pinyin}</Text>
                            <Text style={{ fontSize: 12 }}>{item.note}</Text>
                          </Space>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  <Divider style={{ margin: '12px 0' }} />
                  <Text strong style={{ fontSize: 13 }}>同步练习：</Text>
                  <Card size="small" style={{ background: '#faf5eb', marginTop: 8 }}>
                    <Text>1. "学而时习之，不亦说乎"中"说"的读音和意思是？</Text>
                    <br />
                    <Text type="secondary">A. shuō 说话  B. yuè 愉快  C. shuì 说服  D. tuō 解脱</Text>
                    <br />
                    <Tag color="green" style={{ marginTop: 4 }}>答案：B · 考点：通假字</Tag>
                  </Card>
                  <Card size="small" style={{ background: '#faf5eb', marginTop: 8 }}>
                    <Text>2. "人不知而不愠"体现了怎样的品质？（简答）</Text>
                    <br />
                    <Tag color="green" style={{ marginTop: 4 }}>考点：文言文阅读理解 · 宽容待人的君子风范</Tag>
                  </Card>
                </Card>
              </Col>

              {/* 5. 研学任务单 */}
              <Col xs={24}>
                <Card
                  title="📋 一键生成图书馆研学任务单"
                  className="parchment-card"
                  size="small"
                  extra={<Button size="small" icon={<DownloadOutlined />}>导出PDF</Button>}
                >
                  <Descriptions bordered size="small" column={3}>
                    <Descriptions.Item label="研学主题">《{demoText.title}》古籍探秘</Descriptions.Item>
                    <Descriptions.Item label="适用年级">{demoText.gradeLevel.join('、')}年级</Descriptions.Item>
                    <Descriptions.Item label="CADAL溯源">{demoText.cadalId}</Descriptions.Item>
                    <Descriptions.Item label="阅读层级" span={3}>
                      <Space>
                        <Tag color="orange">A级·原版繁体（感受古籍原貌）</Tag>
                        <Tag color="green">B级·简化适配（精读理解）</Tag>
                        <Tag color="blue">C级·白话通识（预习入门）</Tag>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="研学任务一" span={3}>
                      阅读B级简化版，圈出不认识的字词，借助C级白话版理解文意
                    </Descriptions.Item>
                    <Descriptions.Item label="研学任务二" span={3}>
                      完成配套练习题（2道选择题 + 1道简答题），对照答案自评
                    </Descriptions.Item>
                    <Descriptions.Item label="研学任务三" span={3}>
                      在系统中查看CADAL古籍原图，对比古今文字差异，写一段50字感言
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* 重新演示 */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={startDemo}
                style={{ marginRight: 16 }}
              >
                重新演示
              </Button>
              <Button size="large" type="primary" icon={<DownloadOutlined />}>
                导出演示资料包
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 底部：项目核心优势分析 */}
      <Card
        className="parchment-card"
        title="🏆 项目核心优势"
        style={{ marginTop: 24 }}
      >
        <Row gutter={[16, 16]}>
          {[
            { icon: '🎯', title: '教育落地导向', desc: '聚焦教育落地与AI重构、课标适配，直接服务于义务教育实际需求' },
            { icon: '👧', title: '真实用户视角', desc: '由真实小学生参与需求定义，从一线使用者角度理解古籍阅读痛点' },
            { icon: '🤖', title: '技术体系完整', desc: 'AI语义分级、文本重构、课标匹配等多项技术协同，构成完整解决方案' },
            { icon: '🏫', title: '落地性强', desc: '线上系统+研学手册+馆内展陈，满足赛事试运行和展陈的硬性要求' },
            { icon: '📊', title: '数据底座扎实', desc: '内置126篇课内古诗文数据库，基于2022版课标三学段分级标准' },
            { icon: '🤝', title: '双人优势互补', desc: '五年级用户视角需求定义 + 大学生技术开发，视角与能力互补' },
          ].map((item, i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card size="small" style={{ background: '#faf5eb', height: '100%' }}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                <Title level={5} style={{ margin: '4px 0' }}>{item.title}</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 项目理念 */}
      <Card
        className="parchment-card"
        title="💬 项目理念"
        style={{ marginTop: 16 }}
      >
        <blockquote style={{
          borderLeft: '4px solid #c43a31',
          padding: '12px 20px',
          background: '#fdf6f5',
          borderRadius: '0 8px 8px 0',
          margin: 0,
        }}>
          <Text style={{ fontSize: 14, lineHeight: 2 }}>
            "图书馆CADAL资源的最终价值是<b>落地服务读者</b>，而非单纯堆砌技术。
            本系统致力于将学术资源下沉到义务教育，真正对接课标、服务学生、
            支持教师备课，实现<b>古籍数字化资源在教学场景中的实际应用</b>。"
          </Text>
        </blockquote>
      </Card>
    </div>
  );
}
