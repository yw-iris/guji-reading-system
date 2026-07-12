import { useState } from 'react';
import {
  Typography, Card, Row, Col, Button, Space, Steps, Tag, Input, Select, Divider, Alert, Spin, Badge,
} from 'antd';
import {
  ExperimentOutlined, ThunderboltOutlined,
  CheckCircleOutlined, ArrowRightOutlined, ReloadOutlined,
  BookOutlined, BulbOutlined, DownloadOutlined, StarOutlined,
} from '@ant-design/icons';
import { mockTexts } from '../../utils/mockData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const steps = [
  { title: '选择古籍与年级', description: '确定备课内容' },
  { title: 'AI 生成教案', description: '自动匹配课标' },
  { title: '调整与确认', description: '个性化修改' },
];

export default function CreatePlanPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [targetGrade, setTargetGrade] = useState<number | null>(null);
  const [customRequirement, setCustomRequirement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // 模拟 AI 生成过程
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPlan(true);
      setCurrentStep(2);
    }, 2500);
  };

  const selectedTextObj = mockTexts.find((t) => t.id === selectedText);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          <ExperimentOutlined /> AI 智能备课助手
        </Title>
        <Text type="secondary">
          选择古籍、设定年级，AI 自动生成匹配课标的完整教案。支持学校教师和课外独立教师使用。
        </Text>
      </div>

      {/* 步骤条 */}
      <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

      {/* 步骤 1: 选择古籍 */}
      {currentStep === 0 && (
        <div className="fade-in">
          <Card title="第一步：选择古籍与目标年级" className="parchment-card" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>选择古籍：</Text>
                <Row gutter={[8, 8]} style={{ marginTop: 8 }}>
                  {mockTexts.map((text) => (
                    <Col key={text.id}>
                      <Card
                        size="small"
                        hoverable
                        style={{
                          border: selectedText === text.id ? '2px solid #5b8c5a' : '1px solid #d4c5b2',
                          background: selectedText === text.id ? '#f0f5e8' : '#fdfaf3',
                          cursor: 'pointer',
                          minWidth: 140,
                        }}
                        onClick={() => setSelectedText(text.id)}
                      >
                        <Text strong>{text.title}</Text>
                        <br />
                        <Text style={{ fontSize: 11 }} type="secondary">{text.author} · {text.dynasty}</Text>
                        <br />
                        <Tag color="orange" style={{ marginTop: 4 }}>
                          {text.schoolStage.includes('primary') ? '小学' : text.schoolStage.includes('junior') ? '初中' : '高中'}
                        </Tag>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>目标年级：</Text>
                <Select
                  placeholder="选择年级"
                  style={{ width: '100%', marginTop: 8 }}
                  value={targetGrade}
                  onChange={setTargetGrade}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    label: `${i + 1}年级（${i < 6 ? '小学' : i < 9 ? '初中' : '高中'}）`,
                    value: i + 1,
                  }))}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>特殊需求（可选）：</Text>
                <TextArea
                  placeholder="例如：侧重朗读教学 / 需要小组讨论环节 / 适合独立教师一对一辅导场景..."
                  style={{ marginTop: 8 }}
                  rows={3}
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                />
              </Col>
            </Row>
          </Card>

          <div style={{ textAlign: 'center' }}>
            <Button
              size="large"
              type="primary"
              icon={<ThunderboltOutlined />}
              disabled={!selectedText || !targetGrade}
              onClick={() => { setCurrentStep(1); handleGenerate(); }}
              style={{ background: '#5b8c5a', borderColor: '#5b8c5a', height: 48, padding: '0 40px', fontSize: 16 }}
            >
              AI 生成教案
            </Button>
          </div>
        </div>
      )}

      {/* 步骤 2: AI 生成中 */}
      {currentStep === 1 && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
          {isGenerating ? (
            <div>
              <Spin size="large" />
              <Title level={4} style={{ marginTop: 24, color: '#5b8c5a' }}>
                AI 正在生成教案...
              </Title>
              <div style={{ maxWidth: 500, margin: '16px auto', textAlign: 'left' }}>
                {[
                  { icon: <CheckCircleOutlined style={{ color: '#5b8c5a' }} />, text: '正在匹配课标知识点...', done: true },
                  { icon: <CheckCircleOutlined style={{ color: '#5b8c5a' }} />, text: '正在提取古籍三层文本...', done: true },
                  { icon: <CheckCircleOutlined style={{ color: '#5b8c5a' }} />, text: '正在生成教学目标和流程...', done: true },
                  { icon: <Spin size="small" />, text: '正在优化课堂活动设计...', done: false },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.icon}
                    <Text>{item.text}</Text>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <CheckCircleOutlined style={{ fontSize: 64, color: '#5b8c5a' }} />
              <Title level={3} style={{ color: '#5b8c5a', marginTop: 16 }}>教案生成完成！</Title>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => setCurrentStep(2)}
                style={{ background: '#5b8c5a', marginTop: 16 }}
              >
                查看并调整教案
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 步骤 3: 教案预览 */}
      {currentStep === 2 && generatedPlan && selectedTextObj && (
        <div className="fade-in">
          <Alert
            message="AI 教案已生成"
            description="以下是基于课标和古籍内容自动生成的教案，您可以根据需要调整各环节。"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Card className="parchment-card" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 教案头 */}
              <div>
                <Title level={3} style={{ marginBottom: 4 }}>
                  《{selectedTextObj.title}》教学设计
                </Title>
                <Space>
                  <Tag color="green">{targetGrade}年级 · {targetGrade! <= 6 ? '小学' : targetGrade! <= 9 ? '初中' : '高中'}语文</Tag>
                  <Tag>{selectedTextObj.author} · {selectedTextObj.dynasty}</Tag>
                  <Tag color="orange">CADAL: {selectedTextObj.cadalId}</Tag>
                </Space>
              </div>

              <Divider />

              {/* 教学目标 */}
              <div>
                <Title level={5}><StarOutlined style={{ color: '#b8860b' }} /> 教学目标</Title>
                <Row gutter={[16, 8]}>
                  {[
                    { label: '知识与能力', content: `理解${selectedTextObj.title}的基本内容，掌握重点字词含义` },
                    { label: '过程与方法', content: `通过${selectedTextObj.tags.includes('唐诗') ? '诵读' : '研读'}和讨论，体会${selectedTextObj.tags.includes('唐诗') ? '诗歌' : '文章'}的表达技巧` },
                    { label: '情感态度', content: selectedTextObj.textbookMatch[0]?.knowledgePoints.slice(-1)[0] || '体会古典文学之美' },
                  ].map((obj, i) => (
                    <Col xs={24} sm={8} key={i}>
                      <Card size="small" style={{ background: '#faf5eb', height: '100%' }}>
                        <Text strong style={{ color: '#b8860b' }}>{obj.label}</Text>
                        <Paragraph style={{ marginTop: 4, fontSize: 13 }}>{obj.content}</Paragraph>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* 教学流程 */}
              <div>
                <Title level={5}><BookOutlined style={{ color: '#5b8c5a' }} /> 教学流程</Title>
                {[
                  { order: 1, title: '情境导入', duration: 5, content: `展示${selectedTextObj.title}相关图片/视频，创设情境，激发兴趣。${customRequirement ? `（根据教师需求：${customRequirement}）` : ''}` },
                  { order: 2, title: '初读感知', duration: 10, content: '教师范读 → 学生跟读 → 借助简化版文本自主阅读，标记疑难字词。', tier: 'adapted' },
                  { order: 3, title: '精读研析', duration: 15, content: `逐句讲解重点字词和句式。结合白话解读版帮助理解文意。分析${selectedTextObj.textbookMatch[0]?.knowledgePoints.slice(0, 2).join('、')}等知识点。`, tier: 'vernacular' },
                  { order: 4, title: '拓展延伸', duration: 8, content: `展示CADAL古籍原图（编号：${selectedTextObj.cadalId}），让学生感受古籍原貌。讨论：这篇文章/诗歌在今天的意义是什么？` },
                  { order: 5, title: '课堂总结', duration: 5, content: '回顾本课重点，布置课后练习。推荐学生课后在古籍探宝系统自主阅读。' },
                ].map((step) => (
                  <Card key={step.order} size="small" style={{ marginBottom: 8, background: '#fdfaf3' }}>
                    <Space>
                      <Badge count={step.order} style={{ backgroundColor: '#5b8c5a' }} />
                      <Text strong>{step.title}</Text>
                      <Tag>{step.duration}分钟</Tag>
                      {'tier' in step && (
                        <Tag color="blue">
                          {step.tier === 'adapted' ? '简化版文本' : '白话解读版'}
                        </Tag>
                      )}
                    </Space>
                    <Paragraph style={{ marginTop: 8, fontSize: 13 }}>{step.content}</Paragraph>
                  </Card>
                ))}
              </div>

              {/* 课后作业 */}
              <div>
                <Title level={5}><BulbOutlined style={{ color: '#c43a31' }} /> 课后练习</Title>
                <Card size="small" style={{ background: '#faf5eb' }}>
                  <Text strong>1. 基础题：</Text>熟读并背诵{selectedTextObj.title}。
                  <br />
                  <Text strong>2. 提升题：</Text>选择文中最打动你的一句，写一段 100 字的赏析。
                  <br />
                  <Text strong>3. 拓展题：</Text>在古籍探宝系统中自主阅读一篇同朝代/同作者的古籍，比较异同。
                </Card>
              </div>
            </Space>
          </Card>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Space size="large">
              <Button icon={<ReloadOutlined />} onClick={() => { setCurrentStep(0); setGeneratedPlan(false); }}>
                重新生成
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                style={{ background: '#5b8c5a', borderColor: '#5b8c5a' }}
              >
                下载完整教案
              </Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  );
}

// 本地使用的 Badge 已在上方从 antd 导入
