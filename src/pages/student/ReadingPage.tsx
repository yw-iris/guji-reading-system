import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Button, Space, Segmented, Card, Tag, Divider,
  Tabs, Collapse, Tooltip,
} from 'antd';
import {
  ArrowLeftOutlined, FileImageOutlined,
  CheckCircleOutlined, StarOutlined, QuestionCircleOutlined,
  ReloadOutlined,
  StepForwardOutlined, PauseCircleOutlined, CaretRightOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import { mockTexts, mockTieredContent, mockStudyPoints } from '../../utils/mockData';
import { prebuiltDemos, prebuiltDemoToAncientText } from '../../data/prebuiltDemos';
import { exportToPDF } from '../../utils/pdfExport';
import { AncientImage } from '../../components/reading/AncientImage';
import WenyanReadingMode from '../../components/reading/WenyanReadingMode';
import type { TextTier, SchoolStage, TieredContent } from '../../types';

const { Title, Text, Paragraph } = Typography;

const PAGE_SIZE = 28;
const MAX_SENTENCES_WITHOUT_PAGINATION = 30;

// 把文本按句子拆分（按句号、问号、感叹号、分号、换行分割）
function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const paragraphs = text.split('\n').filter(p => p.trim());
  const sentences: string[] = [];
  for (const para of paragraphs) {
    const parts = para.split(/(?<=[。！？；])/g).filter(s => s.trim());
    sentences.push(...parts);
  }
  if (sentences.length === 0) {
    return text.split(/(?<=[。！？])/g).filter(s => s.trim());
  }
  return sentences;
}
// ---- 生字注释面板 ----
function StudyPointPanel({ textId }: { textId: string | undefined }) {
  const [collapsed, setCollapsed] = useState(false);
  let studyPoints = textId ? mockStudyPoints[textId] : undefined;

  // fallback: 从 prebuiltDemos 中获取生字数据
  if (!studyPoints || studyPoints.length === 0) {
    const demo = prebuiltDemos.find(
      (d) => d.cadalId.replace('CADAL-', 'text-') === textId || d.cadalId === textId
    );
    if (demo?.studyPoints) {
      studyPoints = demo.studyPoints;
    }
  }

  const panelContent = (
    <div style={{
      background: '#fffef9',
      border: '1px solid #e8d5b8',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: '10px 14px',
          background: '#faf5eb',
          borderBottom: collapsed ? 'none' : '1px solid #e8d5b8',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 14,
          fontWeight: 600,
          color: '#8b6914',
        }}
      >
        <span>📖 生字注释</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{collapsed ? '展开' : '收起'}</span>
      </div>
      <div style={{
        display: collapsed ? 'none' : 'block',
        padding: '10px 14px',
        maxHeight: 400,
        overflowY: 'auto',
      }}>
        {(!studyPoints || studyPoints.length === 0) ? (
          <div style={{ color: '#999', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>
            暂无生字数据
          </div>
        ) : (
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            {studyPoints.map((sp) => (
              <div
                key={sp.char}
                style={{
                  padding: '8px 10px',
                  background: '#fdfaf3',
                  borderRadius: 8,
                  border: '1px solid #f0e6d3',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#c43a31' }}>
                    {sp.char}
                  </span>
                  <span style={{ fontSize: 12, color: '#8b6914' }}>{sp.pinyin}</span>
                </div>
                <div style={{ fontSize: 12, color: '#5c4033', lineHeight: 1.5 }}>
                  {sp.explanation}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                  部首：{sp.radical} · {sp.strokes}画
                </div>
              </div>
            ))}
          </Space>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 桌面端：侧边栏 sticky */}
      <div className="study-point-desktop" style={{
        width: 200,
        flexShrink: 0,
        position: 'sticky',
        top: 16,
        alignSelf: 'flex-start',
      }}>
        {panelContent}
      </div>

      {/* 移动端：底部折叠 */}
      <div className="study-point-mobile" style={{ padding: '0 16px 16px' }}>
        {panelContent}
      </div>

      <style>{`
        .study-point-desktop { display: block; }
        .study-point-mobile { display: none; }
        @media (max-width: 860px) {
          .study-point-desktop { display: none; }
          .study-point-mobile { display: block; }
        }
      `}</style>
    </>
  );
}

export default function ReadingPage() {
  const { textId } = useParams<{ textId: string }>();
  const navigate = useNavigate();
  const { currentTier, setCurrentTier, addReadingRecord, addPoints, currentUser } = useAppStore();

  const textFromMock = mockTexts.find((t) => t.id === textId);
  const rawContent = textId
    ? (mockTieredContent as Record<string, TieredContent>)[textId]
    : null;

  // fallback: 如果 mockData 中没有，尝试从 prebuiltDemos 中获取
  const fallbackDemo = textId
    ? prebuiltDemos.find(
        (d) => d.cadalId.replace('CADAL-', 'text-') === textId || d.cadalId === textId
      )
    : undefined;
  const text = textFromMock || prebuiltDemoToAncientText(fallbackDemo || prebuiltDemos[0]) || null;

  // 课标难度匹配：根据用户学段选择 adapted 版本
  const content = useMemo(() => {
    const baseContent = rawContent || fallbackDemo?.tieredContent || prebuiltDemos[0]?.tieredContent || null;
    if (!baseContent) return null;
    const userStage: SchoolStage | undefined = currentUser?.schoolStage;
    if (baseContent.stageLevel && userStage) {
      if (baseContent.stageLevel === userStage) {
        return baseContent;
      }
    }
    return baseContent;
  }, [rawContent, currentUser, fallbackDemo]);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [revealedSentences, setRevealedSentences] = useState<number[]>([0]);
  const [fontSize, setFontSize] = useState(20);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const sentences = useMemo(() => {
    if (!content) return [];
    return splitIntoSentences(content[currentTier]);
  }, [content, currentTier]);

  const totalSentences = sentences.length;
  const totalPages = Math.ceil(totalSentences / PAGE_SIZE);
  const shouldPaginate = totalSentences > MAX_SENTENCES_WITHOUT_PAGINATION;

  // 当前页的句子全局索引范围
  const pageStartIndex = currentPage * PAGE_SIZE;
  const pageEndIndex = Math.min(pageStartIndex + PAGE_SIZE, totalSentences);

  // 只显示 revealedSentences 中属于当前页的句子
  const pageRevealedSentences = useMemo(() => {
    return revealedSentences.filter(
      (idx) => idx >= pageStartIndex && idx < pageEndIndex
    );
  }, [revealedSentences, pageStartIndex, pageEndIndex]);

  const readingProgress = totalSentences > 0
    ? Math.round((revealedSentences.length / totalSentences) * 100)
    : 0;

  useEffect(() => {
    setCurrentSentenceIndex(0);
    setRevealedSentences([0]);
    setIsCompleted(false);
    setCurrentPage(0);
  }, [currentTier]);

  useEffect(() => {
    if (!isAutoPlay || isCompleted) return;
    const timer = setTimeout(() => {
      goToNextSentence();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isAutoPlay, currentSentenceIndex, isCompleted]);

  const goToNextSentence = useCallback(() => {
    if (currentSentenceIndex < totalSentences - 1) {
      const next = currentSentenceIndex + 1;
      setCurrentSentenceIndex(next);
      setRevealedSentences(prev => [...prev, next]);
      // 如果下一页属于新的一页，自动翻页
      if (shouldPaginate && next >= pageEndIndex) {
        setCurrentPage(prev => prev + 1);
      }
    } else {
      setIsCompleted(true);
      setIsAutoPlay(false);
    }
  }, [currentSentenceIndex, totalSentences, shouldPaginate, pageEndIndex]);

  const handleCardClick = () => {
    if (!isCompleted) {
      goToNextSentence();
    }
  };

  const handleExportPDF = () => {
    if (!content || !text) return;
    setIsExporting(true);
    const { promise } = exportToPDF(text.title, content[currentTier], {
      tier: tierLabels[currentTier].label,
    });
    promise
      .catch((err) => {
        if (err.message !== '导出已取消') {
          console.error('PDF 导出失败:', err);
        }
      })
      .finally(() => {
        setIsExporting(false);
      });
    // 返回 cancel 以便在组件卸载时清理（此处简化处理）
  };

  const handleRestart = () => {
    setCurrentSentenceIndex(0);
    setRevealedSentences([0]);
    setIsCompleted(false);
    setIsAutoPlay(false);
    setCurrentPage(0);
  };

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    const startIdx = page * PAGE_SIZE;
    setCurrentSentenceIndex(startIdx);
    setRevealedSentences([startIdx]);
    setIsCompleted(false);
  };

  if (!text || !content) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Title level={3}>未找到该古籍</Title>
        <Button onClick={() => navigate('/student/explore')}>返回探索</Button>
      </div>
    );
  }

  // 文言文：进入专属阅读模式（逐句对照翻译 + 语法标注 + 背景拓展 + 专项练习）
  if (text.tags.includes('文言文')) {
    return <WenyanReadingMode text={text} content={content} />;
  }

  const tierLabels: Record<TextTier, { label: string; className: string; color: string }> = {
    original: { label: '原版繁体', className: 'tier-original', color: '#8b6914' },
    adapted: { label: '简化适配版', className: 'tier-adapted', color: '#3c6e47' },
    vernacular: { label: '白话解读', className: 'tier-vernacular', color: '#2e5984' },
  };

  const currentLabel = tierLabels[currentTier];

  return (
    <div style={{ minHeight: '100vh', background: '#fdfaf3' }}>
      {/* 顶部导航条 */}
      <div className="reading-navbar" style={{
        background: '#fffef9', borderBottom: '1px solid #e8d5b8',
        padding: '10px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Space className="reading-navbar-title">
          <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/student/explore')}>
            返回
          </Button>
          <Divider type="vertical" />
          <Text strong style={{ fontSize: 16 }}>{text.title}</Text>
          <Tag color="#c43a31">{text.dynasty}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>{text.author}</Text>
        </Space>

        <Space className="reading-navbar-controls">
          <Tooltip title="查看古籍原图">
            <Button size="small" icon={<FileImageOutlined />}
              onClick={() => setShowOriginal(!showOriginal)}
              type={showOriginal ? 'primary' : 'default'} />
          </Tooltip>
          <Segmented size="small" value={fontSize}
            onChange={(val) => setFontSize(val as number)}
            options={[
              { label: '小', value: 16 }, { label: '中', value: 20 }, { label: '大', value: 26 },
            ]} />
        </Space>
      </div>

      {/* 主内容区域：阅读区 + 生字注释面板 */}
      <div className="reading-main-area" style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '24px 20px 80px',
        display: 'flex',
        gap: 24,
      }}>
        {/* 阅读区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 课标匹配信息 */}
          <div style={{
            background: '#f0f5e8', padding: '8px 16px', borderRadius: 12, marginBottom: 16,
            fontSize: 13, color: '#3c6e47', border: '1px solid #d4e4c5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <span>📚 课本对应：</span>
              {text.textbookMatch.map((m) => (
                <Tag key={m.lessonName} color="green" style={{ marginLeft: 8, fontSize: 11 }}>
                  {m.grade}年级{m.semester}学期 · {m.lessonName}
                </Tag>
              ))}
              {content?.stageLevel && (
                <Tag color={content.stageLevel === currentUser?.schoolStage ? 'blue' : 'orange'} style={{ fontSize: 11 }}>
                  {content.stageLevel === 'primary' ? '小学段' : content.stageLevel === 'junior' ? '初中段' : '高中段'}
                  {currentUser?.schoolStage && content.stageLevel === currentUser.schoolStage ? ' ✓ 匹配' : ''}
                </Tag>
              )}
            </div>
          </div>

          {/* ===== 醒目的版本切换卡片 ===== */}
          <div style={{
            display: 'flex', gap: 12, marginBottom: 24,
            flexWrap: 'wrap',
          }}>
            {[
              {
                tier: 'vernacular' as TextTier,
                icon: '⭐',
                label: '简单版',
                desc: '大白话，一看就懂',
                color: '#2e5984',
                bg: '#e8f0f8',
                border: '#b8d4e8',
                activeBg: '#2e5984',
              },
              {
                tier: 'adapted' as TextTier,
                icon: '⭐⭐',
                label: '适中版',
                desc: '保留原文，加注释',
                color: '#3c6e47',
                bg: '#e8f2e8',
                border: '#b8d8b8',
                activeBg: '#3c6e47',
              },
              {
                tier: 'original' as TextTier,
                icon: '⭐⭐⭐',
                label: '挑战版',
                desc: '古籍原文，挑战自己',
                color: '#8b6914',
                bg: '#f8f0e0',
                border: '#d8c8a8',
                activeBg: '#8b6914',
              },
            ].map((opt) => {
              const isActive = currentTier === opt.tier;
              return (
                <div
                  key={opt.tier}
                  onClick={() => setCurrentTier(opt.tier)}
                  style={{
                    flex: '1 1 140px',
                    minWidth: 130,
                    padding: '16px 14px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    background: isActive ? opt.activeBg : opt.bg,
                    border: `2px solid ${isActive ? opt.color : opt.border}`,
                    boxShadow: isActive
                      ? `0 4px 20px ${opt.color}33`
                      : '0 1px 4px rgba(0,0,0,0.04)',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{
                    fontSize: isActive ? 22 : 18,
                    marginBottom: 4,
                    transition: 'font-size 0.25s',
                  }}>
                    {opt.icon}
                  </div>
                  <div style={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 15,
                    color: isActive ? '#fff' : opt.color,
                    marginBottom: 2,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: isActive ? 'rgba(255,255,255,0.8)' : '#999',
                  }}>
                    {opt.desc}
                  </div>
                  {isActive && (
                    <div style={{
                      marginTop: 6,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.9)',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 10,
                      padding: '2px 10px',
                      display: 'inline-block',
                    }}>
                      ✓ 当前阅读版本
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 古籍原图 - 使用自定义加载组件 */}
          {showOriginal && (
            <AncientImage
              src={text.cadalImageUrl}
              alt={`${text.title} 古籍原图`}
              caption={`来源：CADAL 数字图书馆 · ${text.cadalId}`}
            />
          )}

          {/* 进度条 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Space>
                <Tag color={currentLabel.color} style={{ borderRadius: 6 }}>{currentLabel.label}</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {revealedSentences.length} / {totalSentences} 句
                </Text>
                {shouldPaginate && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    第 {currentPage + 1}/{totalPages} 页
                  </Text>
                )}
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>{readingProgress}%</Text>
            </div>
            <div style={{
              height: 4, background: '#f0e6d3', borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${readingProgress}%`,
                background: `linear-gradient(90deg, ${currentLabel.color}, ${currentLabel.color}cc)`,
                borderRadius: 2, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* ===== 逐句阅读主区域 ===== */}
          <div onClick={handleCardClick} style={{ cursor: isCompleted ? 'default' : 'pointer' }}>
            {pageRevealedSentences.map((idx) => (
              <div
                key={idx}
                className="fade-in reading-sentence"
                style={{
                  fontSize,
                  lineHeight: 2.2,
                  letterSpacing: '0.04em',
                  color: '#2c1810',
                  padding: '16px 20px',
                  marginBottom: 8,
                  background: idx === currentSentenceIndex ? '#fffef9' : '#fdfaf3',
                  borderRadius: 12,
                  border: idx === currentSentenceIndex
                    ? `1px solid ${currentLabel.color}33`
                    : '1px solid transparent',
                  fontFamily: currentTier === 'original'
                    ? '"Noto Serif SC", "STSong", "SimSun", serif'
                    : '"Noto Serif SC", "KaiTi", serif',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                {sentences[idx]}
                {idx === currentSentenceIndex && !isCompleted && (
                  <span style={{
                    position: 'absolute', left: -3, top: 16, bottom: 16,
                    width: 3, background: currentLabel.color, borderRadius: 2,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* 分页器 */}
          {shouldPaginate && !isCompleted && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: 12, marginTop: 16, padding: '12px 0',
            }}>
              <Button
                size="small"
                disabled={currentPage === 0}
                onClick={(e) => { e.stopPropagation(); goToPage(currentPage - 1); }}
              >
                上一页
              </Button>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {currentPage + 1} / {totalPages}
              </Text>
              <Button
                size="small"
                disabled={currentPage >= totalPages - 1}
                onClick={(e) => { e.stopPropagation(); goToPage(currentPage + 1); }}
              >
                下一页
              </Button>
            </div>
          )}

          {/* 完成状态 */}
          {isCompleted && (
            <div className="fade-in" style={{ textAlign: 'center', marginTop: 24 }}>
              <CheckCircleOutlined style={{ fontSize: 48, color: '#5b8c5a' }} />
            <Title level={4} style={{ color: '#5b8c5a', marginTop: 12 }}>
              🎉 太厉害了！你读完了整篇！
            </Title>
            <Text type="secondary">你读完了全部 {totalSentences} 句，获得了 ⭐ 10 颗星星！</Text>
              <div style={{ marginTop: 16 }}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={handleRestart}>重新阅读</Button>
                  <Button
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
                        addPoints(10);
                      }
                    }}
                  >
                    标记完成
                  </Button>
                  <Button
                    icon={<FilePdfOutlined />}
                    loading={isExporting}
                    onClick={handleExportPDF}
                    style={{ borderColor: '#c43a31', color: '#c43a31' }}
                  >
                    导出 PDF
                  </Button>
                </Space>
              </div>
            </div>
          )}

          {/* 操作提示 */}
          {!isCompleted && (
            <div className="reading-actions" style={{
              textAlign: 'center', marginTop: 24, padding: '16px',
              background: '#faf5eb', borderRadius: 12, border: '1px solid #e8d5b8',
            }}>
              <Space direction="vertical" size={8}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {isAutoPlay ? '⏱ 自动播放中（每句3秒）' : '👆 点击文字区域读下一句'}
              </Text>
                <Space>
                  <Button
                    size="small"
                    icon={isAutoPlay ? <PauseCircleOutlined /> : <CaretRightOutlined />}
                    onClick={(e) => { e.stopPropagation(); setIsAutoPlay(!isAutoPlay); }}
                    type={isAutoPlay ? 'primary' : 'default'}
                  >
                    {isAutoPlay ? '暂停' : '自动播放'}
                  </Button>
                  <Button
                    size="small"
                    icon={<StepForwardOutlined />}
                    onClick={(e) => { e.stopPropagation(); goToNextSentence(); }}
                  >
                    下一句
                  </Button>
                  <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={(e) => { e.stopPropagation(); handleRestart(); }}
                  >
                    重来
                  </Button>
                </Space>
              </Space>
            </div>
          )}
        </div>

        {/* 生字注释面板 - 桌面端侧边栏 */}
        <StudyPointPanel textId={textId} />
      </div>

      {/* 底部：考点与练习（阅读完成后展示） */}
      {isCompleted && (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 40px' }} className="fade-in">
          <Card title="🎉 太棒了！来看看你学到了什么" style={{ borderRadius: 12, marginBottom: 24, borderColor: '#e8d5b8' }}>
            <Tabs items={[
              {
                key: 'points',
                label: <span><StarOutlined /> 知识点</span>,
                children: (
                  <Collapse items={[
                    {
                      key: '1', label: '修辞手法与知识点',
                      children: (
                        <ul style={{ paddingLeft: 20 }}>
                          {text.textbookMatch[0]?.knowledgePoints.map((kp, i) => (
                            <li key={i} style={{ marginBottom: 4 }}>{kp}</li>
                          ))}
                        </ul>
                      ),
                    },
                    {
                      key: '2', label: '课文关联',
                      children: (
                        <Paragraph>
                          本文对应{text.textbookMatch.map(m => `${m.grade}年级${m.semester}学期《${m.lessonName}》`).join('、')}，
                          建议在学习该课文前后作为拓展阅读材料使用。
                        </Paragraph>
                      ),
                    },
                  ]} />
                ),
              },
              {
                key: 'exercises',
                label: <span><QuestionCircleOutlined /> 同步练习</span>,
                children: (
                  <div>
                    <Card size="small" style={{ marginBottom: 12, borderRadius: 12, borderColor: '#e8d5b8' }}>
                      <Text strong>1. {text.title}的作者是哪个朝代的？</Text>
                      <div style={{ marginTop: 8 }}>
                        {['A. 宋代', 'B. 唐代', 'C. 明代', 'D. 清代'].map((opt) => (
                          <Button key={opt} block style={{ marginBottom: 4, textAlign: 'left' }}>{opt}</Button>
                        ))}
                      </div>
                    </Card>
                    <Card size="small" style={{ borderRadius: 12, borderColor: '#e8d5b8' }}>
                      <Text strong>2. 请用自己的话说说这篇文章/诗歌表达了什么？</Text>
                      <div style={{ marginTop: 8, padding: 12, background: '#faf5eb', borderRadius: 8, minHeight: 60 }}>
                        <Text type="secondary">在此作答...</Text>
                      </div>
                    </Card>
                  </div>
                ),
              },
            ]} />
          </Card>
        </div>
      )}

      {/* 移动端响应式样式 */}
      <style>{`
        @media (max-width: 768px) {
          .reading-navbar {
            padding: 8px 12px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .reading-navbar-title {
            width: 100%;
          }
          .reading-navbar-controls {
            width: 100%;
            justify-content: flex-end;
          }
          .reading-main-area {
            padding: 16px 12px 80px !important;
            gap: 12px !important;
          }
          .reading-sentence {
            font-size: calc(var(--font-size, 20px) - 2px) !important;
            padding: 12px 14px !important;
            line-height: 2 !important;
          }
          .reading-actions {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
