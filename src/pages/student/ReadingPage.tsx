import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Space,
  Segmented,
  Card,
  Tag,
  Divider,
  Progress,
  Breadcrumb,
  Tabs,
  Collapse,
  Image,
  Tooltip,
} from 'antd';
import {
  ArrowLeftOutlined,
  SoundOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import { mockTexts, mockTieredContent } from '../../utils/mockData';
import type { TextTier } from '../../types';

const { Title, Text, Paragraph } = Typography;

export default function ReadingPage() {
  const { textId } = useParams<{ textId: string }>();
  const navigate = useNavigate();
  const { currentTier, setCurrentTier, addReadingRecord, currentUser } = useAppStore();

  const text = mockTexts.find((t) => t.id === textId);
  const content = textId ? (mockTieredContent as Record<string, { original: string; adapted: string; vernacular: string }>)[textId] : null;

  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [showOriginal, setShowOriginal] = useState(false);

  // 模拟阅读进度
  useEffect(() => {
    if (readingProgress < 100) {
      const timer = setTimeout(() => {
        setReadingProgress((p) => Math.min(p + 5, 100));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [readingProgress]);

  if (!text || !content) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Title level={3}>未找到该古籍</Title>
        <Button onClick={() => navigate('/student/explore')}>返回探索</Button>
      </div>
    );
  }

  const tierLabels: Record<TextTier, { label: string; className: string; icon: React.ReactNode }> = {
    original: { label: '原版繁体', className: 'tier-original', icon: <FileImageOutlined /> },
    adapted: { label: '简化适配版', className: 'tier-adapted', icon: <CheckCircleOutlined /> },
    vernacular: { label: '白话解读', className: 'tier-vernacular', icon: <BulbOutlined /> },
  };

  const currentContent = content[currentTier];

  return (
    <div className="reading-container">
      {/* 面包屑 */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <a onClick={() => navigate('/student/explore')}>古籍探索</a> },
          { title: text.title },
        ]}
      />

      {/* 古籍信息头 */}
      <Card className="parchment-card" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={() => navigate('/student/explore')}
            />
            <Title level={3} style={{ margin: 0, color: '#2c1810' }}>
              {text.title}
            </Title>
            <Tag color="#c43a31">{text.dynasty}</Tag>
          </Space>
          <Text type="secondary">
            {text.author} · CADAL 古籍编号：{text.cadalId}
          </Text>

          {/* 课标匹配信息 */}
          <div style={{ background: '#f0f5e8', padding: '8px 16px', borderRadius: 8 }}>
            <Text style={{ fontSize: 13 }}>
              📚 课本对应：
              {text.textbookMatch.map((m) => (
                <Tag key={m.lessonName} color="green" style={{ marginLeft: 8 }}>
                  {m.grade}年级{m.semester}学期 · {m.lessonName}
                </Tag>
              ))}
            </Text>
          </div>
        </Space>
      </Card>

      {/* 文本层级切换 */}
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }} align="center">
          <Segmented
            size="large"
            value={currentTier}
            onChange={(val) => setCurrentTier(val as TextTier)}
            options={[
              { label: '📜 原版繁体', value: 'original' },
              { label: '📖 简化版', value: 'adapted' },
              { label: '💡 白话解读', value: 'vernacular' },
            ]}
          />

          <Space>
            <Tooltip title="查看古籍原图">
              <Button
                icon={<FileImageOutlined />}
                onClick={() => setShowOriginal(!showOriginal)}
                type={showOriginal ? 'primary' : 'default'}
              >
                古籍原图
              </Button>
            </Tooltip>
            <Tooltip title="朗读">
              <Button icon={<SoundOutlined />}>朗读</Button>
            </Tooltip>
            <Segmented
              size="small"
              value={fontSize}
              onChange={(val) => setFontSize(val as number)}
              options={[
                { label: '小', value: 16 },
                { label: '中', value: 18 },
                { label: '大', value: 22 },
              ]}
            />
          </Space>
        </Space>
      </Card>

      {/* 古籍原图（可折叠） */}
      {showOriginal && (
        <Card title="📷 CADAL 古籍原图" style={{ marginBottom: 24 }} className="parchment-card">
          <div style={{ textAlign: 'center' }}>
            <Image
              src={text.cadalImageUrl}
              alt={`${text.title} 古籍原图`}
              style={{ maxHeight: 400, borderRadius: 8 }}
              fallback="https://placehold.co/400x600/f5e6d3/8b4513?text=古籍原图加载中..."
            />
            <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 12 }}>
              来源：CADAL 数字图书馆 · {text.cadalId}
            </Paragraph>
          </div>
        </Card>
      )}

      {/* 主阅读内容 */}
      <Card
        className="parchment-card"
        style={{ marginBottom: 24, minHeight: 300 }}
        extra={
          <span className={`tier-badge ${tierLabels[currentTier].className}`}>
            {tierLabels[currentTier].label}
          </span>
        }
      >
        <div
          style={{
            fontSize,
            lineHeight: 2.2,
            letterSpacing: '0.05em',
            color: '#2c1810',
            padding: '24px 16px',
            whiteSpace: 'pre-wrap',
            fontFamily: currentTier === 'original'
              ? '"Noto Serif SC", "STSong", "SimSun", serif'
              : '"Noto Serif SC", "KaiTi", serif',
          }}
        >
          {currentContent}
        </div>

        {/* 阅读进度 */}
        <Divider />
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text type="secondary">阅读进度</Text>
          <Progress percent={readingProgress} size="small" style={{ width: 200 }} />
        </Space>
      </Card>

      {/* 考点与练习 */}
      <Card title="📝 考点提炼与练习" className="parchment-card" style={{ marginBottom: 24 }}>
        <Tabs
          items={[
            {
              key: 'points',
              label: (
                <span><StarOutlined /> 知识点</span>
              ),
              children: (
                <Collapse
                  items={[
                    {
                      key: '1',
                      label: '生字词',
                      children: (
                        <Space wrap>
                          {['疑', '霜', '举', '思'].map((char) => (
                            <Tag key={char} style={{ fontSize: 16, padding: '4px 12px' }}>
                              {char}
                              <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
                                {/* 简化的拼音占位 */}
                              </Text>
                            </Tag>
                          ))}
                        </Space>
                      ),
                    },
                    {
                      key: '2',
                      label: '修辞手法',
                      children: (
                        <ul style={{ paddingLeft: 20 }}>
                          {text.textbookMatch[0]?.knowledgePoints.map((kp, i) => (
                            <li key={i} style={{ marginBottom: 4 }}>{kp}</li>
                          ))}
                        </ul>
                      ),
                    },
                    {
                      key: '3',
                      label: '课文关联',
                      children: (
                        <Paragraph>
                          本文对应{text.textbookMatch.map(m => `${m.grade}年级${m.semester}学期《${m.lessonName}》`).join('、')}，
                          建议在学习该课文前后作为拓展阅读材料使用。
                        </Paragraph>
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              key: 'exercises',
              label: (
                <span><QuestionCircleOutlined /> 同步练习</span>
              ),
              children: (
                <div>
                  <Card size="small" style={{ marginBottom: 12 }}>
                    <Text strong>1. {text.title}的作者是哪个朝代的？</Text>
                    <div style={{ marginTop: 8 }}>
                      {['A. 宋代', 'B. 唐代', 'C. 明代', 'D. 清代'].map((opt) => (
                        <Button key={opt} block style={{ marginBottom: 4, textAlign: 'left' }}>
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </Card>
                  <Card size="small">
                    <Text strong>2. 请用自己的话说说这首诗表达了什么情感？</Text>
                    <div style={{ marginTop: 8, padding: 12, background: '#faf5eb', borderRadius: 8, minHeight: 60 }}>
                      <Text type="secondary">在此作答...</Text>
                    </div>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* 操作区 */}
      <Space style={{ width: '100%', justifyContent: 'center', padding: '16px 0' }}>
        <Button
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/student/explore')}
        >
          返回探索
        </Button>
        <Button
          size="large"
          type="primary"
          icon={<CheckCircleOutlined />}
          style={{ background: '#5b8c5a', borderColor: '#5b8c5a' }}
          onClick={() => {
            if (currentUser) {
              addReadingRecord({
                id: `rec-${Date.now()}`,
                studentId: currentUser.id,
                textId: text.id,
                tier: currentTier,
                progress: 100,
                timeSpent: 300,
                exercisesCompleted: 2,
                exercisesCorrect: 2,
                lastReadAt: new Date().toISOString(),
              });
            }
          }}
        >
          完成阅读
        </Button>
      </Space>
    </div>
  );
}
