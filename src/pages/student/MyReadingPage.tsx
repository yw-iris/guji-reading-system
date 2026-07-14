import { Typography, Card, Row, Col, Tag, Progress, Button, Space, Empty, message, Modal, List } from 'antd';
const { Paragraph } = Typography;
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RightOutlined,
  BookOutlined,
  FilePdfOutlined,
  StarOutlined,
  GiftOutlined,
  CrownOutlined,
  HeartOutlined,
  TrophyOutlined,
  PictureOutlined,
  CalendarOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useAppStore } from '../../stores/appStore';
import { mockStudyTasks, mockReadingRecords, mockTexts, mockTieredContent } from '../../utils/mockData';
import { exportToPDF } from '../../utils/pdfExport';
import type { TieredContent, RedeemItem, WorkCard, ReadingRecord, AncientText } from '../../types';

const { Title, Text } = Typography;

// 兑换项目列表
const redeemItems: RedeemItem[] = [
  { id: 'r1', name: '高清古籍原图下载', description: '获取CADAL古籍高清扫描图', cost: 50, icon: '📜' },
  { id: 'r2', name: '生字练习册', description: '个性化生字描红练习册', cost: 30, icon: '✍️' },
  { id: 'r3', name: '古诗卡片集', description: '精美古诗背诵卡片套装', cost: 40, icon: '🎴' },
  { id: 'r4', name: '古籍印章', description: '专属古籍收藏电子印章', cost: 20, icon: '🔖' },
];

const tierLabels: Record<string, string> = {
  original: '原版繁体',
  adapted: '简化适配版',
  vernacular: '白话解读',
};

// 推荐算法：基于用户已读书籍计算偏好
function getRecommendations(
  readRecords: ReadingRecord[],
  allTexts: AncientText[],
  count: number
): AncientText[] {
  const readIds = new Set(readRecords.map((r) => r.textId));
  const readTexts = allTexts.filter((t) => readIds.has(t.id));
  const unreadTexts = allTexts.filter((t) => !readIds.has(t.id));

  // 如果没有阅读记录，随机推荐
  if (readTexts.length === 0) {
    const shuffled = [...unreadTexts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // 计算偏好：统计已读书籍的标签、朝代、学段频率
  const tagFreq: Record<string, number> = {};
  const dynastyFreq: Record<string, number> = {};
  const stageFreq: Record<string, number> = {};

  for (const t of readTexts) {
    for (const tag of t.tags) {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1;
    }
    dynastyFreq[t.dynasty] = (dynastyFreq[t.dynasty] || 0) + 1;
    for (const stage of t.schoolStage) {
      stageFreq[stage] = (stageFreq[stage] || 0) + 1;
    }
  }

  // 为未读书籍打分
  const scored = unreadTexts.map((t) => {
    let score = 0;
    // 标签匹配
    for (const tag of t.tags) {
      score += (tagFreq[tag] || 0) * 3;
    }
    // 朝代匹配
    score += (dynastyFreq[t.dynasty] || 0) * 2;
    // 学段匹配
    for (const stage of t.schoolStage) {
      score += (stageFreq[stage] || 0) * 2;
    }
    return { text: t, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.text);
}

export default function MyReadingPage() {
  const navigate = useNavigate();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [redeemModalVisible, setRedeemModalVisible] = useState(false);
  const [workCards, setWorkCards] = useState<WorkCard[]>([]);
  const { points, addPoints, currentUser, todayPlan, removeTodayPlan } = useAppStore();

  // 合并阅读记录与古籍信息
  const enrichedRecords = mockReadingRecords.map((rec) => {
    const text = mockTexts.find((t) => t.id === rec.textId);
    return { ...rec, text };
  });

  // 推荐书籍
  const recommendedTexts = useMemo(
    () => getRecommendations(mockReadingRecords, mockTexts, 4),
    []
  );

  // 今日学习计划（与「找古诗」拖拽制定联动）
  const plannedTexts = todayPlan
    .map((id) => mockTexts.find((t) => t.id === id))
    .filter((t): t is AncientText => Boolean(t));

  const handleExport = (rec: (typeof enrichedRecords)[number]) => {
    if (!rec.text) return;
    const rawContent = (mockTieredContent as Record<string, TieredContent>)[rec.textId];
    if (!rawContent) return;
    setExportingId(rec.id);
    const { promise } = exportToPDF(rec.text.title, rawContent[rec.tier], {
      tier: tierLabels[rec.tier],
    });
    promise
      .catch((err) => {
        if (err.message !== '导出已取消') {
          console.error('PDF 导出失败:', err);
        }
      })
      .finally(() => {
        setExportingId(null);
      });
  };

  const handleRedeem = (item: RedeemItem) => {
    if (points < item.cost) {
      message.warning(`积分不足！需要 ${item.cost} 积分，当前 ${points} 积分`);
      return;
    }
    addPoints(-item.cost);
    message.success(`兑换成功！已消耗 ${item.cost} 积分获得「${item.name}」`);
  };

  const handleGenerateCard = (rec: (typeof enrichedRecords)[number]) => {
    if (!rec.text) return;
    const exists = workCards.find((c) => c.textId === rec.textId);
    if (exists) {
      message.info('该作品卡片已存在');
      return;
    }
    const card: WorkCard = {
      id: `card-${Date.now()}`,
      textTitle: rec.text.title,
      userName: currentUser?.name || '学子',
      readDate: new Date(rec.lastReadAt).toLocaleDateString('zh-CN'),
      tier: tierLabels[rec.tier],
      textId: rec.textId,
    };
    setWorkCards((prev) => [...prev, card]);
    message.success('作品卡片已生成！');
  };

  const handleStartReading = (text: AncientText) => {
    navigate(`/student/reading/${text.id}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#2c1810', marginBottom: 4 }}>
          📖 我的阅读
        </Title>
        <Text type="secondary">查看阅读记录和完成情况</Text>
      </div>

      {/* 今日学习计划（与「找古诗」拖拽制定联动） */}
      <Card
        className="parchment-card"
        style={{ marginBottom: 24, borderColor: 'rgba(196,58,49,0.25)', background: 'linear-gradient(135deg, #fff7ee 0%, #fffef9 100%)' }}
      >
        <div className="gj-section-title" style={{ marginBottom: 12 }}>
          <CalendarOutlined style={{ color: 'var(--vermilion)' }} /> 今日学习计划
          {plannedTexts.length > 0 && (
            <Tag color="red" style={{ marginLeft: 8 }}>{plannedTexts.length} 篇</Tag>
          )}
        </div>
        {plannedTexts.length === 0 ? (
          <Text type="secondary" style={{ fontSize: 13 }}>
            还没有安排今日任务，去「找古诗」把想学的古文拖进「今日学习栏目」吧～
          </Text>
        ) : (
          <List
            dataSource={plannedTexts}
            renderItem={(t) => (
              <List.Item
                key={t.id}
                actions={[
                  <Button type="link" size="small" key="study" onClick={() => navigate(`/student/reading/${t.id}`)}>
                    继续学习
                  </Button>,
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    key="del"
                    onClick={() => removeTodayPlan(t.id)}
                  />,
                ]}
              >
                <List.Item.Meta title={t.title} description={`${t.dynasty} · ${t.author}`} />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 积分展示 */}
      <Card
        className="parchment-card"
        style={{ marginBottom: 24, background: 'linear-gradient(135deg, #fff7e6 0%, #fffef9 100%)' }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space size={24}>
              <div>
                <Text type="secondary">我的积分</Text>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#b8860b' }}>
                  <TrophyOutlined style={{ marginRight: 8 }} />
                  {points}
                  <Text style={{ fontSize: 14 }}> 分</Text>
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  完成阅读 +10分 | 完成练习 +5分 | 完成研学任务 +20分
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              icon={<GiftOutlined />}
              onClick={() => setRedeemModalVisible(true)}
              style={{ borderColor: '#b8860b', color: '#b8860b' }}
            >
              积分兑换
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 积分兑换弹窗 */}
      <Modal
        title="积分兑换"
        open={redeemModalVisible}
        onCancel={() => setRedeemModalVisible(false)}
        footer={null}
        width={500}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          当前积分：<Text strong style={{ color: '#b8860b' }}>{points}</Text> 分
        </Text>
        <List
          dataSource={redeemItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="redeem"
                  type="primary"
                  size="small"
                  disabled={points < item.cost}
                  onClick={() => handleRedeem(item)}
                  style={{ background: '#b8860b', borderColor: '#b8860b' }}
                >
                  {item.cost} 分兑换
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: 24 }}>{item.icon}</span>}
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Modal>

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
                      <Button
                        icon={<FilePdfOutlined />}
                        loading={exportingId === rec.id}
                        onClick={() => handleExport(rec)}
                        style={{ borderColor: '#c43a31', color: '#c43a31' }}
                      >
                        导出
                      </Button>
                      {rec.progress >= 100 && (
                        <Button
                          icon={<PictureOutlined />}
                          onClick={() => handleGenerateCard(rec)}
                          style={{ borderColor: '#5b8c5a', color: '#5b8c5a' }}
                        >
                          生成作品卡片
                        </Button>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 我的作品 */}
      {workCards.length > 0 && (
        <>
          <Title level={4} style={{ marginTop: 32, marginBottom: 16, color: '#2c1810' }}>
            <CrownOutlined /> 我的作品
          </Title>
          <Row gutter={[16, 16]}>
            {workCards.map((card) => (
              <Col xs={24} sm={12} key={card.id}>
                <div
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #fffef9 0%, #f5e6d3 100%)',
                    border: '2px solid #c43a31',
                    borderRadius: 12,
                    padding: '28px 24px 20px',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(196,58,49,0.1)',
                  }}
                >
                  {/* 印章装饰 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 20,
                      width: 52,
                      height: 52,
                      border: '2px solid #c43a31',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c43a31',
                      fontSize: 14,
                      fontWeight: 700,
                      transform: 'rotate(8deg)',
                      opacity: 0.85,
                    }}
                  >
                    已阅
                  </div>

                  {/* 古籍标题 */}
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#2c1810',
                      textAlign: 'center',
                      marginBottom: 8,
                      letterSpacing: '0.08em',
                    }}
                  >
                    《{card.textTitle}》
                  </div>

                  {/* 分隔线 */}
                  <div
                    style={{
                      width: 60,
                      height: 2,
                      background: '#c43a31',
                      opacity: 0.5,
                      marginBottom: 16,
                    }}
                  />

                  {/* 元数据 */}
                  <Space direction="vertical" size={6} style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      学子：<Text strong>{card.userName}</Text>
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      阅读日期：{card.readDate}
                    </Text>
                    <Tag color="green" style={{ fontSize: 12 }}>
                      {card.tier}
                    </Tag>
                  </Space>

                  {/* 底部纹理 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 24,
                      right: 24,
                      height: 1,
                      background: 'repeating-linear-gradient(90deg, #c43a31 0px, #c43a31 4px, transparent 4px, transparent 8px)',
                      opacity: 0.3,
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </>
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

      {/* 猜你喜欢 - 阅读推荐 */}
      <Title level={4} style={{ marginTop: 32, marginBottom: 16, color: '#2c1810' }}>
        <HeartOutlined /> 猜你喜欢
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 13 }}>
        基于你的阅读记录，为你推荐以下古籍
      </Text>
      <Row gutter={[16, 16]}>
        {recommendedTexts.map((text) => (
          <Col xs={24} sm={12} lg={6} key={text.id}>
            <Card
              className="parchment-card"
              hoverable
              onClick={() => handleStartReading(text)}
              style={{ cursor: 'pointer', height: '100%' }}
            >
              <div style={{ marginBottom: 8 }}>
                <Tag color="#c43a31">{text.dynasty}</Tag>
                {text.tags.slice(0, 2).map((tag) => (
                  <Tag key={tag} style={{ fontSize: 11 }}>{tag}</Tag>
                ))}
              </div>
              <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>
                {text.title}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {text.author} · {text.dynasty}
              </Text>
              <div style={{ marginTop: 8 }}>
                {text.gradeLevel.slice(0, 3).map((g) => (
                  <Tag key={g} color="green" style={{ fontSize: 11, marginBottom: 2 }}>
                    {g}年级
                  </Tag>
                ))}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <StarOutlined style={{ color: '#b8860b', fontSize: 12 }} />
                <Text style={{ fontSize: 11, color: '#b8860b' }}>
                  难度 {'⭐'.repeat(text.difficulty)}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
