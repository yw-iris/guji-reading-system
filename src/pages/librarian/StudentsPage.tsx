import { Typography, Card, Table, Tag, Progress, Input } from 'antd';
import { SearchOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// 模拟学生数据
const mockStudents = [
  { id: 's1', name: '张三', grade: 3, totalReads: 12, totalTime: 3600, accuracy: 85, lastActive: '2025-03-16' },
  { id: 's2', name: '李四', grade: 4, totalReads: 8, totalTime: 2400, accuracy: 72, lastActive: '2025-03-15' },
  { id: 's3', name: '王五', grade: 5, totalReads: 15, totalTime: 5400, accuracy: 91, lastActive: '2025-03-16' },
  { id: 's4', name: '赵六', grade: 2, totalReads: 5, totalTime: 1200, accuracy: 68, lastActive: '2025-03-14' },
  { id: 's5', name: '小探宝', grade: 5, totalReads: 20, totalTime: 7200, accuracy: 94, lastActive: '2025-03-16' },
];

export default function StudentsPage() {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', render: (n: string) => <Text strong>{n}</Text> },
    {
      title: '年级', dataIndex: 'grade', key: 'grade',
      render: (g: number) => <Tag color={['#ff6b6b', '#ffa94d', '#74c0fc', '#51cf66', '#845ef7', '#f06595'][g - 1]}>{g}年级</Tag>,
    },
    { title: '阅读篇数', dataIndex: 'totalReads', key: 'totalReads' },
    {
      title: '阅读时长', dataIndex: 'totalTime', key: 'totalTime',
      render: (t: number) => `${Math.round(t / 60)}分钟`,
    },
    {
      title: '正确率', dataIndex: 'accuracy', key: 'accuracy',
      render: (a: number) => <Progress percent={a} size="small" style={{ width: 100 }} />,
    },
    { title: '最近活跃', dataIndex: 'lastActive', key: 'lastActive' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
            <TeamOutlined /> 学生管理
          </Title>
          <Text type="secondary">查看学生阅读数据和学习进度</Text>
        </div>
        <Input placeholder="搜索学生..." prefix={<SearchOutlined />} style={{ width: 220 }} />
      </div>

      <Card className="parchment-card">
        <Table
          columns={columns}
          dataSource={mockStudents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
