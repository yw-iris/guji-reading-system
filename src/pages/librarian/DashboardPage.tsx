import { Typography, Card, Row, Col, Statistic, Table, Progress } from 'antd';
import {
  TeamOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { mockLearningStats } from '../../utils/mockData';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const stats = mockLearningStats;

  const popularColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 },
    { title: '古籍名称', dataIndex: 'title', key: 'title' },
    {
      title: '阅读次数',
      dataIndex: 'readCount',
      key: 'readCount',
      render: (val: number) => <Progress percent={val} size="small" style={{ width: 120 }} format={() => val} />,
    },
  ];

  const popularData = stats.popularTexts.map((t, i) => ({ ...t, rank: i + 1, key: t.textId }));

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          📊 数据看板
        </Title>
        <Text type="secondary">学生古籍阅读学情数据总览</Text>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic
              title="学生总数"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#c43a31' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic
              title="活跃学生"
              value={stats.activeStudents}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#5b8c5a' }}
              suffix={`/ ${stats.totalStudents}`}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic
              title="总阅读时长(小时)"
              value={Math.round(stats.totalReadingTime / 3600)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#b8860b' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="parchment-card">
            <Statistic
              title="平均正确率"
              value={stats.avgAccuracy}
              prefix={<TrophyOutlined />}
              suffix="%"
              valueStyle={{ color: '#2e5984' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 热门古籍 & 年级分布 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="🏆 热门古籍 TOP 3" className="parchment-card">
            <Table
              columns={popularColumns}
              dataSource={popularData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="🎒 年级分布" className="parchment-card">
            {stats.gradeDistribution.map((g) => (
              <div key={g.grade} style={{ marginBottom: 12 }}>
                <Text>{g.grade}年级</Text>
                <Progress
                  percent={Math.round((g.count / stats.totalStudents) * 100)}
                  size="small"
                  format={() => `${g.count}人`}
                  strokeColor={
                    ['#ff6b6b', '#ffa94d', '#74c0fc', '#51cf66', '#845ef7', '#f06595'][g.grade - 1]
                  }
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 周趋势 */}
      <Card title="📈 本周阅读趋势" className="parchment-card">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, height: 200, padding: '16px 0' }}>
          {stats.weeklyTrend.map((day) => {
            const maxCount = Math.max(...stats.weeklyTrend.map((d) => d.readingCount));
            const height = (day.readingCount / maxCount) * 160;
            return (
              <div key={day.date} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height,
                    background: 'linear-gradient(180deg, #c43a31 0%, #e8a87c 100%)',
                    borderRadius: '6px 6px 0 0',
                    marginBottom: 8,
                    transition: 'all 0.3s',
                  }}
                />
                <Text style={{ fontSize: 12 }}>{day.date}</Text>
                <br />
                <Text strong style={{ fontSize: 13 }}>{day.readingCount}</Text>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
