import { Typography, Card, Table, Tag, Button, Space, Input } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { mockTexts } from '../../utils/mockData';
import type { ColumnsType } from 'antd/es/table';
import type { AncientText } from '../../types';

const { Title, Text } = Typography;

const dynastyColors: Record<string, string> = {
  '唐': '#c43a31',
  '宋': '#5b8c5a',
  '春秋': '#b8860b',
  '战国': '#8b6914',
};

export default function TextsManagePage() {
  const columns: ColumnsType<AncientText> = [
    {
      title: '古籍名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record) => (
        <Space>
          <Text strong>{title}</Text>
          <Tag color={dynastyColors[record.dynasty]}>{record.dynasty}</Tag>
        </Space>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'CADAL ID',
      dataIndex: 'cadalId',
      key: 'cadalId',
      render: (id: string) => <Text code>{id}</Text>,
    },
    {
      title: '适配年级',
      dataIndex: 'gradeLevel',
      key: 'gradeLevel',
      render: (grades: number[]) => (
        <Space>
          {grades.map((g) => (
            <Tag key={g} color="green">{g}年级</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />} type="link">编辑</Button>
          <Button size="small" type="link" danger>下架</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
            📚 古籍管理
          </Title>
          <Text type="secondary">管理 CADAL 古籍资源库，维护内容与课标匹配</Text>
        </div>
        <Space>
          <Input placeholder="搜索古籍..." prefix={<SearchOutlined />} style={{ width: 220 }} />
          <Button type="primary" icon={<PlusOutlined />} style={{ background: '#c43a31' }}>
            添加古籍
          </Button>
        </Space>
      </div>

      <Card className="parchment-card">
        <Table
          columns={columns}
          dataSource={mockTexts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
