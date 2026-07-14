import { useState } from 'react';
import {
  Typography, Row, Col, Tag, Button, Space, Input, Modal, Descriptions, Collapse, Badge, Tooltip, Popconfirm, Divider,
} from 'antd';
import {
  SearchOutlined, EyeOutlined, DownloadOutlined,
  ClockCircleOutlined, StarOutlined, SnippetsOutlined,
  ShareAltOutlined, ExperimentOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockLessonPlans } from '../../utils/mockData';
import type { LessonPlan } from '../../types';
import { EmptyState, SealMark } from '../../components/common';

const { Title, Text, Paragraph } = Typography;

const stageColors: Record<string, string> = {
  primary: '#c98a3a',
  junior: '#3c6e8f',
  senior: '#6f4ba8',
};

const stageLabels: Record<string, string> = {
  primary: '小学',
  junior: '初中',
  senior: '高中',
};

function getStage(grade: number): string {
  if (grade <= 6) return 'primary';
  if (grade <= 9) return 'junior';
  return 'senior';
}

function planStatus(plan: LessonPlan): { label: string; color: string } {
  return plan.isPublic
    ? { label: '已发布', color: 'var(--jade)' }
    : { label: '草稿', color: 'var(--warm-brown)' };
}

/** 将教案内容拼接为可下载的纯文本 */
function buildPlanText(plan: LessonPlan): string {
  const lines: string[] = [];
  lines.push(`《${plan.title}》备课教案`);
  lines.push(`年级：${plan.targetGrade}年级    学科：${plan.subject}`);
  lines.push(`创建日期：${plan.createdAt}    状态：${plan.isPublic ? '已发布' : '草稿'}`);
  lines.push('');
  lines.push('一、教学目标');
  plan.objectives.forEach((o, i) => lines.push(`  ${i + 1}. ${o}`));
  lines.push('');
  lines.push('二、教学流程');
  plan.teachingProcess.forEach((s) => {
    lines.push(`  ${s.order}. ${s.title}（${s.duration}分钟）`);
    lines.push(`     ${s.content}`);
    if (s.activities?.length) lines.push(`     课堂活动：${s.activities.join('、')}`);
  });
  lines.push('');
  lines.push('三、标签');
  lines.push(`  ${plan.tags.join('、')}`);
  return lines.join('\n');
}

/** 浏览器端触发文本文件下载（无需第三方依赖） */
function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function TeacherPlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<LessonPlan[]>(mockLessonPlans);
  const [searchText, setSearchText] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filtered = plans.filter(
    (p) =>
      p.title.includes(searchText) ||
      p.tags.some((t) => t.includes(searchText)) ||
      p.subject.includes(searchText)
  );

  const handleDelete = (id: string) => setPlans((prev) => prev.filter((x) => x.id !== id));
  const handleDownload = (plan: LessonPlan) => {
    downloadText(`${plan.title}.txt`, buildPlanText(plan));
  };
  const openPreview = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setPreviewOpen(true);
  };

  return (
    <div className="gj-studio-bg gj-fade-up" style={{ minHeight: '100vh', padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <style>{`
        .gj-plan-card { padding: 18px; display: flex; flex-direction: column; gap: 8px; cursor: default; }
        .gj-plan-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .gj-plan-title { font-size: 17px; font-weight: 700; color: var(--ink-black);
          font-family: 'Noto Serif SC', serif; line-height: 1.4; }
        .gj-plan-obj ul { margin: 4px 0 0; padding-left: 18px; font-size: 12px; color: var(--ink-gray); }
        .gj-plan-meta { display: flex; gap: 16px; font-size: 11px; color: var(--ink-gray); }
        .gj-plan-steps { display: flex; flex-wrap: wrap; gap: 2px 0; }
        .gj-plan-actions { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2px; }
      `}</style>

      {/* 页面标题 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="gj-section-title" style={{ fontSize: 22 }}>
            <SnippetsOutlined style={{ color: 'var(--vermilion)' }} /> 备课教案
          </div>
          <Text type="secondary">
            基于 CADAL 古籍资源的一键备课系统，覆盖小学到高中，支持学校教师与独立教师
          </Text>
        </div>
        <Space wrap>
          <Input
            placeholder="搜索教案 / 标签…"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            style={{ background: 'var(--jade)', borderColor: 'var(--jade)' }}
            onClick={() => navigate('/teacher/create-plan')}
          >
            AI 智能备课
          </Button>
        </Space>
      </div>

      {/* 教案列表 */}
      {filtered.length === 0 ? (
        <EmptyState text="未寻得匹配之卷，换个关键词试试？">
          <Button
            type="primary"
            icon={<ExperimentOutlined />}
            style={{ background: 'var(--jade)', borderColor: 'var(--jade)', marginTop: 12 }}
            onClick={() => navigate('/teacher/create-plan')}
          >
            前往 AI 备课
          </Button>
        </EmptyState>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((plan) => {
            const stage = getStage(plan.targetGrade);
            const status = planStatus(plan);
            return (
              <Col xs={24} sm={12} lg={8} key={plan.id}>
                <div className="gj-card gj-plan-card">
                  <div className="gj-plan-top">
                    <Space size={4} wrap>
                      <Tag color={stageColors[stage]}>{stageLabels[stage]}</Tag>
                      <Tag>{plan.targetGrade}年级</Tag>
                      <Tag color="green">{plan.subject}</Tag>
                      {plan.isPublic && (
                        <Tag icon={<ShareAltOutlined />} color="blue">公开</Tag>
                      )}
                    </Space>
                    <SealMark text={status.label} color={status.color} size={38} bg="transparent" />
                  </div>

                  <div className="gj-plan-title">{plan.title}</div>

                  <div className="gj-plan-obj">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <StarOutlined /> 教学目标
                    </Text>
                    <ul>
                      {plan.objectives.slice(0, 2).map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                      {plan.objectives.length > 2 && <li key="more">……</li>}
                    </ul>
                  </div>

                  <div className="gj-plan-meta">
                    <span><ClockCircleOutlined /> {plan.createdAt}</span>
                    <span><DownloadOutlined /> {plan.downloads}次</span>
                  </div>

                  <div className="gj-plan-steps">
                    {plan.teachingProcess.map((step) => (
                      <Badge
                        key={step.order}
                        count={step.order}
                        style={{ backgroundColor: 'var(--jade)', marginRight: 8, marginBottom: 4 }}
                      >
                        <Text style={{ fontSize: 11 }}>{step.title}</Text>
                      </Badge>
                    ))}
                  </div>

                  <Divider style={{ margin: '6px 0', borderColor: 'var(--border-ink)' }} />

                  <div className="gj-plan-actions">
                    <Tooltip title="预览教案">
                      <Button type="link" icon={<EyeOutlined />} onClick={() => openPreview(plan)}>
                        预览
                      </Button>
                    </Tooltip>
                    <Tooltip title="编辑教案">
                      <Button type="link" icon={<EditOutlined />} onClick={() => navigate('/teacher/create-plan')}>
                        编辑
                      </Button>
                    </Tooltip>
                    <Popconfirm
                      title="确定删除该教案？"
                      description="删除后不可恢复"
                      okText="删除"
                      cancelText="取消"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(plan.id)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                    <Tooltip title="下载教案">
                      <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(plan)}>
                        下载
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      {/* 教案预览弹窗 */}
      <Modal
        title={selectedPlan?.title}
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>关闭</Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            style={{ background: 'var(--jade)', borderColor: 'var(--jade)' }}
            onClick={() => selectedPlan && handleDownload(selectedPlan)}
          >
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
              {selectedPlan.objectives.map((o) => <li key={o}>{o}</li>)}
            </ul>

            <Title level={5} style={{ marginTop: 16 }}>教学流程</Title>
            <Collapse
              items={selectedPlan.teachingProcess.map((step) => ({
                key: String(step.order),
                label: (
                  <Space>
                    <Badge count={step.order} style={{ backgroundColor: 'var(--jade)' }} />
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
                        {step.activities.map((a) => (
                          <Tag key={a}>{a}</Tag>
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
