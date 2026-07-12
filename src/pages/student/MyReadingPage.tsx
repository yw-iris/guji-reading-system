import { Typography, Card, Row, Col, Tag, Progress, Button, Space, Empty } from 'antd';
const { Paragraph } = Typography;
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockStudyTasks, mockReadingRecords, mockTexts } from '../../utils/mockData';

const { Title, Text } = Typography;

export default function MyReadingPage() {
  const navigate = useNavigate();

  // 合并阅读记录与古籍信息
  const enrichedRecords = mockReadingRecords.map((rec) => {
    const text = mockTexts.find((t) => t.id === rec.textId);
    return { ...rec, text };
  });

  const tierLabels: Record<string, string> = {
    original: '原版繁体',
    adapted: '简化适配版',
    vernacular: '白话解读',
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          📖 我的阅读
        </Title>
        <Text type="secondary">查看阅读记录和完成情况</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Text type="secondary">已读古籍</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#c43a31' }}>
              {enrichedRecords.length}
              <Text style={{ fontSize: 14 }}> 篇</Text>
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Text type="secondary">阅读时长</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#5b8c5a' }}>
              {Math.round(enrichedRecords.reduce((s, r) => s + r.timeSpent, 0) / 60)}
              <Text style={{ fontSize: 14 }}> 分钟</Text>
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Text type="secondary">练习题</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#b8860b' }}>
              {enrichedRecords.reduce((s, r) => s + r.exercisesCompleted, 0)}
              <Text style={{ fontSize: 14 }}> 道</Text>
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Text type="secondary">正确率</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#2e5984' }}>
              {enrichedRecords.length > 0
                ? Math.round(
                    (enrichedRecords.reduce((s, r) => s + r.exercisesCorrect, 0) /
                      enrichedRecords.reduce((s, r) => s + r.exercisesCompleted, 0)) *
                      100
                  )
                : 0}
              <Text style={{ fontSize: 14 }}>%</Text>
            </Title>
          </Card>
        </Col>
      </Row>

      {/* 阅读记录 */}
      <Title level={4} style={{ marginBottom: 16, color: '#2c1810' }}>
        <ClockCircleOutlined /> 最近阅读
      </Title>

      {enrichedRecords.length === 0 ? (
        <Empty description="还没有阅读记录，去探索古籍吧！" />
      ) : (
        <Row gutter={[16, 16]}>
          {enrichedRecords.map((rec) => (
            <Col xs={24} key={rec.id}>
              <Card className="parchment-card" hoverable>
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space direction="vertical" size={4}>
                      <Space>
                        <BookOutlined style={{ color: '#c43a31' }} />
                        <Text strong style={{ fontSize: 16 }}>
                          {rec.text?.title || '未知古籍'}
                        </Text>
                        <Tag>{rec.text?.dynasty}</Tag>
                      </Space>
                      <Space>
                        <Tag color="green">{tierLabels[rec.tier]}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {new Date(rec.lastReadAt).toLocaleDateString()}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          阅读 {Math.round(rec.timeSpent / 60)} 分钟
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Progress
                        type="circle"
                        percent={rec.progress}
                        size={48}
                        strokeColor="#5b8c5a"
                      />
                      <Button
                        type="link"
                        icon={<RightOutlined />}
                        onClick={() => navigate(`/student/reading/${rec.textId}`)}
                      >
                        继续阅读
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 研学任务 */}
      <Title level={4} style={{ marginTop: 32, marginBottom: 16, color: '#2c1810' }}>
        <FileTextOutlined /> 我的研学任务
      </Title>
      <Row gutter={[16, 16]}>
        {mockStudyTasks.map((task) => (
          <Col xs={24} sm={12} key={task.id}>
            <Card
              className="parchment-card"
              hoverable
              actions={[
                <Button type="link" icon={<RightOutlined />} key="detail">
                  查看详情
                </Button>,
              ]}
            >
              <Title level={5} style={{ marginBottom: 8 }}>
                {task.title}
              </Title>
              <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                {task.description}
              </Paragraph>
              <Space>
                <Tag icon={<CheckCircleOutlined />} color="green">
                  {task.completedCount}/{task.assignedCount} 已完成
                </Tag>
                {task.targetGrade.map((g) => (
                  <Tag key={g}>{g}年级</Tag>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

