import { Typography, Card, Row, Col, Statistic, Table, Progress } from 'antd';
import {
  SnippetsOutlined, DownloadOutlined, ShareAltOutlined, StarOutlined,
} from '@ant-design/icons';
import { mockTeachingStats, mockLessonPlans } from '../../utils/mockData';

const { Title, Text } = Typography;

export default function TeacherStatsPage() {
  const stats = mockTeachingStats;

  const planColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: '教案名称', dataIndex: 'title', key: 'title' },
    {
      title: '下载量', dataIndex: 'downloads', key: 'downloads',
      render: (v: number) => <Progress percent={Math.min(v / 3, 100)} size="small" format={() => v} style={{ width: 120 }} />,
    },
  ];

  const planData = stats.popularPlans.map((p, i) => ({ ...p, rank: i + 1, key: p.id }));

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          📊 教学统计
        </Title>
        <Text type="secondary">查看教案使用情况和共享数据</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="教案总数" value={stats.totalLessonPlans} prefix={<SnippetsOutlined />} valueStyle={{ color: '#5b8c5a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="公开教案" value={stats.publicLessonPlans} prefix={<ShareAltOutlined />} valueStyle={{ color: '#2e5984' }} suffix={`/ ${stats.totalLessonPlans}`} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="总下载量" value={stats.totalDownloads} prefix={<DownloadOutlined />} valueStyle={{ color: '#b8860b' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic title="平均评分" value={4.7} prefix={<StarOutlined />} suffix="/5" valueStyle={{ color: '#c43a31' }} precision={1} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="🏆 热门教案" className="parchment-card">
            <Table columns={planColumns} dataSource={planData} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="📝 最近更新" className="parchment-card">
            {mockLessonPlans.slice(0, 3).map((plan) => (
              <div key={plan.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0e6d3' }}>
                <Text strong>{plan.title}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {plan.targetGrade}年级 · {plan.subject} · {plan.downloads}次下载
                </Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
