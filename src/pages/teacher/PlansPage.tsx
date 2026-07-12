import { useState } from 'react';
import {
  Typography, Card, Row, Col, Tag, Button, Space, Input, Modal, Descriptions, Collapse, Badge, Tooltip,
} from 'antd';
import {
  SearchOutlined, EyeOutlined, DownloadOutlined,
  ClockCircleOutlined, StarOutlined, SnippetsOutlined,
  ShareAltOutlined, ExperimentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockLessonPlans } from '../../utils/mockData';
import type { LessonPlan } from '../../types';

const { Title, Text, Paragraph } = Typography;

const stageColors: Record<string, string> = {
  'primary': '#ffa94d',
  'junior': '#74c0fc',
  'senior': '#845ef7',
};

const stageLabels: Record<string, string> = {
  'primary': '小学',
  'junior': '初中',
  'senior': '高中',
};

function getStage(grade: number): string {
  if (grade <= 6) return 'primary';
  if (grade <= 9) return 'junior';
  return 'senior';
}

export default function TeacherPlansPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filtered = mockLessonPlans.filter(
    (p) =>
      p.title.includes(searchText) ||
      p.tags.some((t) => t.includes(searchText)) ||
      p.subject.includes(searchText)
  );

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
            <SnippetsOutlined /> 备课教案
          </Title>
          <Text type="secondary">
            基于 CADAL 古籍资源的一键备课系统，覆盖小学到高中，支持学校教师和独立教师
          </Text>
        </div>
        <Space>
          <Input
            placeholder="搜索教案..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            style={{ background: '#5b8c5a', borderColor: '#5b8c5a' }}
            onClick={() => navigate('/teacher/create-plan')}
          >
            AI 智能备课
          </Button>
        </Space>
      </div>

      {/* 教案列表 */}
      <Row gutter={[16, 16]}>
        {filtered.map((plan) => {
          const stage = getStage(plan.targetGrade);
          return (
            <Col xs={24} sm={12} lg={8} key={plan.id}>
              <Card
                className="parchment-card"
                hoverable
                actions={[
                  <Tooltip title="预览教案" key="view">
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => { setSelectedPlan(plan); setPreviewOpen(true); }}
                    >
                      预览
                    </Button>
                  </Tooltip>,
                  <Tooltip title="下载教案" key="download">
                    <Button type="link" icon={<DownloadOutlined />}>
                      下载
                    </Button>
                  </Tooltip>,
                ]}
              >
                {/* 学段标签 */}
                <div style={{ marginBottom: 8 }}>
                  <Tag color={stageColors[stage]}>{stageLabels[stage]}</Tag>
                  <Tag>{plan.targetGrade}年级</Tag>
                  <Tag color="green">{plan.subject}</Tag>
                  {plan.isPublic && (
                    <Tag icon={<ShareAltOutlined />} color="blue">公开</Tag>
                  )}
                </div>

                <Title level={5} style={{ marginBottom: 8 }}>{plan.title}</Title>

                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <StarOutlined /> 教学目标：
                  </Text>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#5c4a3a' }}>
                    {plan.objectives.slice(0, 2).map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                    {plan.objectives.length > 2 && <li>...</li>}
                  </ul>
                </Space>

                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 11 }} type="secondary">
                    <ClockCircleOutlined /> {plan.createdAt}
                  </Text>
                  <Text style={{ fontSize: 11 }} type="secondary">
                    <DownloadOutlined /> {plan.downloads}次下载
                  </Text>
                </div>

                {/* 教学流程概览 */}
                <div style={{ marginTop: 8 }}>
                  {plan.teachingProcess.map((step) => (
                    <Badge
                      key={step.order}
                      count={step.order}
                      style={{ backgroundColor: '#5b8c5a', marginRight: 8, marginBottom: 4 }}
                    >
                      <Text style={{ fontSize: 11 }}>{step.title}</Text>
                    </Badge>
                  ))}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 教案预览弹窗 */}
      <Modal
        title={selectedPlan?.title}
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>关闭</Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />} style={{ background: '#5b8c5a' }}>
            下载教案
          </Button>,
        ]}
      >
        {selectedPlan && (
          <div>
            <Descriptions column={3} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="年级">{selectedPlan.targetGrade}年级</Descriptions.Item>
              <Descriptions.Item label="学科">{selectedPlan.subject}</Descriptions.Item>
              <Descriptions.Item label="下载量">{selectedPlan.downloads}次</Descriptions.Item>
            </Descriptions>

            <Title level={5}>教学目标</Title>
            <ul>
              {selectedPlan.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>

            <Title level={5} style={{ marginTop: 16 }}>教学流程</Title>
            <Collapse
              items={selectedPlan.teachingProcess.map((step) => ({
                key: String(step.order),
                label: (
                  <Space>
                    <Badge count={step.order} style={{ backgroundColor: '#5b8c5a' }} />
                    <Text strong>{step.title}</Text>
                    <Tag>{step.duration}分钟</Tag>
                  </Space>
                ),
                children: (
                  <div>
                    <Paragraph>{step.content}</Paragraph>
                    {step.ancientTextRef && (
                      <Tag color="orange">引用古籍: {step.ancientTextRef}</Tag>
                    )}
                    {step.tier && (
                      <Tag color="blue">推荐文本层级: {step.tier === 'original' ? '原版' : step.tier === 'adapted' ? '简化版' : '白话版'}</Tag>
                    )}
                    {step.activities.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">课堂活动：</Text>
                        {step.activities.map((a, i) => (
                          <Tag key={i}>{a}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
