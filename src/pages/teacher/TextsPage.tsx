import { Typography, Card, Table, Tag, Button, Space, Input, Select } from 'antd';
import { SearchOutlined, BookOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockTexts } from '../../utils/mockData';
import type { AncientText } from '../../types';

const { Title, Text } = Typography;

const stageColors: Record<string, string> = { primary: '#ffa94d', junior: '#74c0fc', senior: '#845ef7' };
const stageLabels: Record<string, string> = { primary: '小学', junior: '初中', senior: '高中' };
const diffColors = ['', '#52c41a', '#73d13d', '#ffa940', '#ff7a45', '#f5222d'];

export default function TeacherTextsPage() {
  const navigate = useNavigate();

  const columns = [
    {
      title: '古籍名称', dataIndex: 'title', key: 'title',
      render: (t: string, r: AncientText) => (
        <Space>
          <Text strong>{t}</Text>
          <Tag color="#c43a31">{r.dynasty}</Tag>
        </Space>
      ),
    },
    { title: '作者', dataIndex: 'author', key: 'author' },
    {
      title: '学段', dataIndex: 'schoolStage', key: 'stage',
      render: (stages: string[]) => stages.map((s) => <Tag key={s} color={stageColors[s]}>{stageLabels[s]}</Tag>),
    },
    {
      title: '难度', dataIndex: 'difficulty', key: 'difficulty',
      render: (d: number) => <Tag color={diffColors[d]}>{'⭐'.repeat(d)}</Tag>,
    },
    {
      title: '标签', dataIndex: 'tags', key: 'tags',
      render: (tags: string[]) => <Space wrap>{tags.map((t) => <Tag key={t}>{t}</Tag>)}</Space>,
    },
    {
      title: '操作', key: 'actions',
      render: (_: unknown, r: AncientText) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/student/reading/${r.id}`)}>
          预览
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
            <BookOutlined /> 古籍资源库
          </Title>
          <Text type="secondary">浏览全部 CADAL 古籍资源，覆盖小学至高中全学段</Text>
        </div>
        <Space>
          <Input placeholder="搜索古籍..." prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select placeholder="筛选学段" allowClear style={{ width: 120 }}
            options={[
              { label: '小学', value: 'primary' },
              { label: '初中', value: 'junior' },
              { label: '高中', value: 'senior' },
            ]}
          />
        </Space>
      </div>
      <Card className="parchment-card">
        <Table columns={columns} dataSource={mockTexts} rowKey="id" pagination={{ pageSize: 10 }} size="middle" />
      </Card>
    </div>
  );
}
