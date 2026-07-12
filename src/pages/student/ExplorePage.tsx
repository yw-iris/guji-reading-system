import { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Tag,
  Select,
  Typography,
  Button,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  RightOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { mockTexts } from '../../utils/mockData';
import type { AncientText, GradeLevel } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const dynastyColors: Record<string, string> = {
  '唐': '#c43a31',
  '宋': '#5b8c5a',
  '春秋': '#b8860b',
  '战国': '#8b6914',
};

const gradeColors: Record<number, string> = {
  1: '#ff6b6b', 2: '#ffa94d', 3: '#74c0fc',
  4: '#51cf66', 5: '#845ef7', 6: '#f06595',
};

export default function ExplorePage() {
  const navigate = useNavigate();
  const { searchKeyword, setSearchKeyword, selectedGrade, setSelectedGrade, setCurrentText } = useAppStore();
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null);

  // 筛选逻辑
  const filteredTexts = useMemo(() => {
    let result = [...mockTexts];
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.includes(kw) ||
          t.author.includes(kw) ||
          t.tags.some((tag) => tag.includes(kw))
      );
    }
    if (selectedGrade) {
      result = result.filter((t) => t.gradeLevel.includes(selectedGrade as GradeLevel));
    }
    if (selectedDynasty) {
      result = result.filter((t) => t.dynasty === selectedDynasty);
    }
    return result;
  }, [searchKeyword, selectedGrade, selectedDynasty]);

  const handleStartReading = (text: AncientText) => {
    setCurrentText(text);
    navigate(`/student/reading/${text.id}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          📜 古籍探索
        </Title>
        <Text type="secondary">
          从 CADAL 古籍库中探索与课本对应的古诗文，AI 帮你读懂每一篇
        </Text>
      </div>

      {/* 搜索与筛选栏 */}
      <Card
        className="parchment-card"
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              size="large"
              placeholder="搜索古籍名称、作者、标签..."
              prefix={<SearchOutlined style={{ color: '#b8860b' }} />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              size="large"
              placeholder="选择年级"
              allowClear
              style={{ width: '100%' }}
              value={selectedGrade}
              onChange={setSelectedGrade}
              suffixIcon={<FilterOutlined />}
            >
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <Option key={g} value={g}>{g}年级</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              size="large"
              placeholder="选择朝代"
              allowClear
              style={{ width: '100%' }}
              value={selectedDynasty}
              onChange={setSelectedDynasty}
            >
              <Option value="唐">唐</Option>
              <Option value="宋">宋</Option>
              <Option value="春秋">春秋</Option>
              <Option value="战国">战国</Option>
            </Select>
          </Col>
          <Col flex="auto">
            <Text type="secondary">
              共找到 <Text strong>{filteredTexts.length}</Text> 篇古籍
            </Text>
          </Col>
        </Row>
      </Card>

      {/* 古籍列表 */}
      {filteredTexts.length === 0 ? (
        <Empty description="没有找到匹配的古籍" style={{ marginTop: 80 }} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTexts.map((text, idx) => (
            <Col xs={24} sm={12} lg={8} key={text.id}>
              <Card
                className="parchment-card fade-in"
                style={{ animationDelay: `${idx * 0.08}s`, height: '100%' }}
                hoverable
                onClick={() => handleStartReading(text)}
                actions={[
                  <Button type="link" icon={<RightOutlined />} key="read">
                    开始阅读
                  </Button>,
                ]}
              >
                {/* 朝代标签 */}
                <div style={{ marginBottom: 12 }}>
                  <Tag color={dynastyColors[text.dynasty] || '#8b6914'}>
                    {text.dynasty}
                  </Tag>
                  {text.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag} style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>

                {/* 标题 */}
                <Title level={4} style={{ color: '#2c1810', marginBottom: 8 }}>
                  {text.title}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  {text.author} · {text.dynasty}
                </Text>

                {/* 适配年级 */}
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: '#8b6914' }}>适配年级：</Text>
                  {text.gradeLevel.map((g) => (
                    <Tag
                      key={g}
                      color={gradeColors[g]}
                      style={{ marginBottom: 4, fontSize: 11 }}
                    >
                      {g}年级
                    </Tag>
                  ))}
                </div>

                {/* 课标匹配 */}
                {text.textbookMatch.length > 0 && (
                  <Paragraph
                    type="secondary"
                    style={{ fontSize: 12, marginBottom: 0 }}
                    ellipsis={{ rows: 2 }}
                  >
                    <BookOutlined /> 课本对应：
                    {text.textbookMatch.map((m) => `${m.grade}年级${m.semester}学期《${m.lessonName}》`).join('、')}
                  </Paragraph>
                )}

                {/* CADAL 标识 */}
                <div style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: 11, color: '#b8860b' }}>
                    <ClockCircleOutlined /> CADAL: {text.cadalId}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
