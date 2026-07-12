import { Typography, Card, Row, Col, Tag, Button, Space, Tabs, Avatar } from 'antd';
import {
  DownloadOutlined, StarOutlined, EyeOutlined,
  UserOutlined, HomeOutlined,
} from '@ant-design/icons';
import { mockLessonPlans } from '../../utils/mockData';

const { Title, Text } = Typography;

// 模拟共享社区的教师
const mockTeachers = [
  { id: 't1', name: '张老师', school: '杭州市实验小学', subject: '语文', plans: 12, avatar: null },
  { id: 't2', name: '李老师', school: '独立教师', subject: '语文/国学', plans: 8, avatar: null },
  { id: 't3', name: '王老师', school: '北京四中', subject: '语文', plans: 15, avatar: null },
  { id: 't4', name: '陈老师', school: '学而思网校', subject: '语文', plans: 20, avatar: null },
];

const stageColors: Record<string, string> = { primary: '#ffa94d', junior: '#74c0fc', senior: '#845ef7' };
const stageLabels: Record<string, string> = { primary: '小学', junior: '初中', senior: '高中' };

export default function SharePage() {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          🌐 教案共享社区
        </Title>
        <Text type="secondary">
          学校教师与课外独立教师共享备课资源，一人备课，众人受益
        </Text>
      </div>

      <Tabs
        items={[
          {
            key: 'plans',
            label: '共享教案',
            children: (
              <Row gutter={[16, 16]}>
                {mockLessonPlans.filter((p) => p.isPublic).map((plan) => {
                  const author = mockTeachers.find((t) => t.id === plan.authorId);
                  return (
                    <Col xs={24} sm={12} lg={8} key={plan.id}>
                      <Card
                        className="parchment-card"
                        hoverable
                        actions={[
                          <Button type="link" icon={<EyeOutlined />} key="view">预览</Button>,
                          <Button type="link" icon={<DownloadOutlined />} key="dl">下载</Button>,
                          <Button type="link" icon={<StarOutlined />} key="star">收藏</Button>,
                        ]}
                      >
                        <div style={{ marginBottom: 8 }}>
                          <Tag color={stageColors[plan.targetGrade <= 6 ? 'primary' : plan.targetGrade <= 9 ? 'junior' : 'senior']}>
                            {stageLabels[plan.targetGrade <= 6 ? 'primary' : plan.targetGrade <= 9 ? 'junior' : 'senior']}
                          </Tag>
                          <Tag>{plan.targetGrade}年级</Tag>
                        </div>
                        <Title level={5}>{plan.title}</Title>
                        <Space style={{ marginTop: 8 }}>
                          <Avatar size="small" icon={<UserOutlined />} style={{ background: '#5b8c5a' }} />
                          <Text style={{ fontSize: 12 }} type="secondary">
                            {author?.name || '匿名'} · {author?.school || ''}
                          </Text>
                        </Space>
                        <div style={{ marginTop: 8 }}>
                          <Text style={{ fontSize: 11 }} type="secondary">
                            <DownloadOutlined /> {plan.downloads}次下载 · {plan.createdAt}
                          </Text>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ),
          },
          {
            key: 'teachers',
            label: '教师达人',
            children: (
              <Row gutter={[16, 16]}>
                {mockTeachers.map((teacher) => (
                  <Col xs={24} sm={12} lg={6} key={teacher.id}>
                    <Card className="parchment-card" hoverable style={{ textAlign: 'center' }}>
                      <Avatar size={64} icon={<UserOutlined />} style={{ background: '#5b8c5a', marginBottom: 12 }} />
                      <Title level={5}>{teacher.name}</Title>
                      <Space direction="vertical" size={2}>
                        <Tag icon={<HomeOutlined />}>{teacher.school}</Tag>
                        <Tag color="green">{teacher.subject}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          贡献 {teacher.plans} 份教案
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
}
