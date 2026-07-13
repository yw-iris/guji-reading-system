import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Button, Space, Segmented, Card, Tag, Divider,
  Tabs, Collapse, Tooltip, Empty, Progress,
} from 'antd';
import {
  ArrowLeftOutlined, FileImageOutlined, CheckCircleOutlined,
  ReloadOutlined, StepForwardOutlined, PauseCircleOutlined, CaretRightOutlined,
  StarOutlined, QuestionCircleOutlined, BookOutlined, FilePdfOutlined,
  BulbOutlined, ReadOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import { wenyanGrammar } from '../../data/wenyanGrammar';
import { wenyanBackgrounds } from '../../data/wenyanBackground';
import { wenyanExercises } from '../../data/wenyanExercises';
import type { AncientText, TieredContent, TextTier, WenyanAnnotation, WenyanToken, MindMapNode } from '../../types';
import { exportToPDF } from '../../utils/pdfExport';
import { AncientImage } from '../reading/AncientImage';

const { Title, Text, Paragraph } = Typography;

// 语法类型配色
const tokenTypeColor: Record<string, { color: string; bg: string; label: string }> = {
  '实词': { color: '#8b4513', bg: '#f8ecd8', label: '实词' },
  '虚词': { color: '#2e5984', bg: '#e3eef8', label: '虚词' },
  '通假字': { color: '#c43a31', bg: '#f8e0de', label: '通假字' },
  '古今异义': { color: '#b8860b', bg: '#f8f0d8', label: '古今异义' },
  '词类活用': { color: '#5b8c5a', bg: '#e3f0e3', label: '词类活用' },
  '特殊句式': { color: '#7d4fa8', bg: '#efe6f6', label: '特殊句式' },
};

// 思维导图渲染
function MindMap({ node, level = 0 }: { node: MindMapNode; level?: number }) {
  return (
    <div style={{ marginLeft: level === 0 ? 0 : 18, borderLeft: level > 0 ? '2px solid #e8d5b8' : 'none', paddingLeft: level > 0 ? 12 : 0 }}>
      <div style={{
        display: 'inline-block', margin: '4px 0', padding: '4px 12px', borderRadius: 8,
        background: level === 0 ? '#c43a31' : level === 1 ? '#f0e6d3' : '#faf5eb',
        color: level === 0 ? '#fff' : '#5c4a3a',
        fontSize: level === 0 ? 15 : 13, fontWeight: level === 0 ? 700 : 500,
      }}>
        {node.label}
      </div>
      {node.children && (
        <div style={{ marginTop: 2 }}>
          {node.children.map((c, i) => (
            <MindMap key={i} node={c} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// 生字词注释气泡内容
function TokenList({ tokens }: { tokens: WenyanToken[] }) {
  if (!tokens || tokens.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
      {tokens.map((tk, i) => {
        const c = tokenTypeColor[tk.type] || tokenTypeColor['实词'];
        return (
          <Tooltip
            key={i}
            title={
              <div style={{ maxWidth: 240 }}>
                <div style={{ fontWeight: 600 }}>{tk.word}　<span style={{ color: '#ffd591' }}>{tk.pinyin || ''}</span></div>
                <div style={{ marginTop: 4 }}>现代汉语：{tk.modernMeaning}</div>
                {tk.detail && <div style={{ marginTop: 4, opacity: 0.85 }}>{tk.detail}</div>}
                {tk.relatedChar && <div style={{ marginTop: 4 }}>通假：{tk.word} → {tk.relatedChar}</div>}
              </div>
            }
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 8, background: c.bg,
              border: `1px solid ${c.color}40`, cursor: 'help',
              fontSize: 13, color: c.color,
            }}>
              <b>{tk.word}</b>
              <span style={{
                fontSize: 10, padding: '1px 5px', borderRadius: 4,
                background: c.color, color: '#fff',
              }}>{c.label}</span>
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default function WenyanReadingMode({
  text,
  content,
}: {
  text: AncientText;
  content: TieredContent;
}) {
  void content; // 文言文主数据来自 wenyanGrammar 模块，content 作为接口预留
  const navigate = useNavigate();
  const {
    currentTier, setCurrentTier, currentUser, addReadingRecord, addPoints,
  } = useAppStore();
  const [fontSize, setFontSize] = useState(20);
  const [showOriginal, setShowOriginal] = useState(false);

  const annotation: WenyanAnnotation | undefined = wenyanGrammar[text.id];
  const sentences = annotation?.sentences || [];
  const background = wenyanBackgrounds[text.id];
  const exercises = wenyanExercises[text.id] || [];

  const totalSentences = sentences.length;

  const [revealedIdx, setRevealedIdx] = useState<number[]>([0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});

  const readingProgress = totalSentences > 0
    ? Math.round((revealedIdx.length / totalSentences) * 100) : 0;

  // 切换层级重置
  useEffect(() => {
    setRevealedIdx([0]);
    setCurrentIdx(0);
    setIsCompleted(false);
    setExpandedNotes({});
  }, [currentTier, text.id]);

  // 自动播放
  useEffect(() => {
    if (!isAutoPlay || isCompleted) return;
    const t = setTimeout(() => goNext(), 4000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlay, currentIdx, isCompleted]);

  const goNext = useCallback(() => {
    if (currentIdx < totalSentences - 1) {
      const n = currentIdx + 1;
      setCurrentIdx(n);
      setRevealedIdx((p) => (p.includes(n) ? p : [...p, n]));
    } else {
      setIsCompleted(true);
      setIsAutoPlay(false);
    }
  }, [currentIdx, totalSentences]);

  const handleCardClick = () => { if (!isCompleted) goNext(); };

  const toggleNote = (i: number) =>
    setExpandedNotes((p) => ({ ...p, [i]: !p[i] }));

  const tierColor: Record<TextTier, string> = {
    original: '#8b6914', adapted: '#3c6e47', vernacular: '#2e5984',
  };
  const accent = tierColor[currentTier];

  // 根据层级决定对照显示方式
  const showOriginalProminent = currentTier === 'original';

  const handleExportPDF = () => {
    const tierName = currentTier === 'original' ? '挑战版（繁体原文）'
      : currentTier === 'adapted' ? '适中版（简体原文）' : '简单版（白话串讲）';
    const body = sentences
      .map((s) => `${s.original}\n【译】${s.translation}`)
      .join('\n\n');
    setIsExporting(true);
    const { promise } = exportToPDF(
      `${text.title}（${tierName}）`,
      `出处：${background?.source || '古籍'}\n作者：${text.author}\n\n${body}`,
      { tier: tierName }
    );
    promise
      .catch((err) => { if (err.message !== '导出已取消') console.error(err); })
      .finally(() => setIsExporting(false));
  };

  const handleAnswer = (exId: string, val: string) => {
    setExerciseAnswers((p) => ({ ...p, [exId]: val }));
    setShowResult((p) => ({ ...p, [exId]: true }));
  };

  const answeredCount = Object.keys(exerciseAnswers).length;
  const correctCount = exercises.filter((e) => {
    const a = exerciseAnswers[e.id];
    if (!a) return false;
    return a.trim() === e.answer.trim() ||
      (e.options && a === e.answer) ||
      e.answer.includes(a);
  }).length;

  return (
    <div style={{ minHeight: '100vh', background: '#fdfaf3' }}>
      {/* 顶部导航 */}
      <div style={{
        background: '#fffef9', borderBottom: '1px solid #e8d5b8',
        padding: '10px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate('/student/explore')}>返回</Button>
          <Divider type="vertical" />
          <Text strong style={{ fontSize: 16 }}>{text.title}</Text>
          <Tag color="#c43a31">{text.dynasty}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>{text.author}</Text>
          <Tag color="gold" style={{ fontSize: 11 }}>文言文</Tag>
        </Space>
        <Space>
          <Tooltip title="查看古籍善本原图">
            <Button size="small" icon={<FileImageOutlined />}
              onClick={() => setShowOriginal(!showOriginal)}
              type={showOriginal ? 'primary' : 'default'} />
          </Tooltip>
          <Segmented size="small" value={fontSize}
            onChange={(v) => setFontSize(v as number)}
            options={[{ label: '小', value: 16 }, { label: '中', value: 20 }, { label: '大', value: 26 }]} />
        </Space>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '24px 20px 80px' }}>
        {/* 课标对应 */}
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
            {background && (
              <Tag color="blue" style={{ fontSize: 11 }}>出处：{background.source}</Tag>
            )}
          </div>
        </div>

        {/* 版本切换卡片 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { tier: 'vernacular' as TextTier, icon: '⭐', label: '简单版', desc: '白话串讲，一看就懂', color: '#2e5984', bg: '#e8f0f8', border: '#b8d4e8', activeBg: '#2e5984' },
            { tier: 'adapted' as TextTier, icon: '⭐⭐', label: '适中版', desc: '简体原文+句注', color: '#3c6e47', bg: '#e8f2e8', border: '#b8d8b8', activeBg: '#3c6e47' },
            { tier: 'original' as TextTier, icon: '⭐⭐⭐', label: '挑战版', desc: '繁体原文，挑战自己', color: '#8b6914', bg: '#f8f0e0', border: '#d8c8a8', activeBg: '#8b6914' },
          ].map((opt) => {
            const active = currentTier === opt.tier;
            return (
              <div key={opt.tier} onClick={() => setCurrentTier(opt.tier)} style={{
                flex: '1 1 140px', minWidth: 130, padding: '16px 14px', borderRadius: 14,
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s ease',
                background: active ? opt.activeBg : opt.bg,
                border: `2px solid ${active ? opt.color : opt.border}`,
                boxShadow: active ? `0 4px 20px ${opt.color}33` : '0 1px 4px rgba(0,0,0,0.04)',
                transform: active ? 'translateY(-2px)' : 'none',
              }}>
                <div style={{ fontSize: active ? 22 : 18, marginBottom: 4 }}>{opt.icon}</div>
                <div style={{ fontWeight: active ? 700 : 500, fontSize: 15, color: active ? '#fff' : opt.color }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: active ? 'rgba(255,255,255,0.8)' : '#999' }}>{opt.desc}</div>
                {active && <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '2px 10px', display: 'inline-block' }}>✓ 当前版本</div>}
              </div>
            );
          })}
        </div>

        {/* 古籍善本原图 */}
        {showOriginal && (
          <AncientImage src={text.cadalImageUrl} alt={`${text.title} 古籍原图`}
            caption={`来源：CADAL 数字图书馆 · ${text.cadalId}`} />
        )}

        {/* 进度条 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Space>
              <Tag color={accent} style={{ borderRadius: 6 }}>
                {currentTier === 'original' ? '挑战版·繁体' : currentTier === 'adapted' ? '适中版·简体' : '简单版·白话'}
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>{revealedIdx.length} / {totalSentences} 句</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>{readingProgress}%</Text>
          </div>
          <div style={{ height: 4, background: '#f0e6d3', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${readingProgress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* 逐句对照区 */}
        <div onClick={handleCardClick} style={{ cursor: isCompleted ? 'default' : 'pointer' }}>
          {revealedIdx.map((idx) => {
            const s = sentences[idx];
            if (!s) return null;
            const noteOpen = expandedNotes[idx];
            return (
              <div key={idx} className="fade-in" style={{
                padding: '18px 20px', marginBottom: 10, borderRadius: 12,
                background: idx === currentIdx && !isCompleted ? '#fffef9' : '#fdfaf3',
                border: idx === currentIdx && !isCompleted ? `1px solid ${accent}33` : '1px solid transparent',
                transition: 'all 0.3s ease',
              }}>
                {/* 原文 */}
                <div style={{
                  fontSize: showOriginalProminent ? fontSize + 4 : fontSize,
                  lineHeight: 2.1, letterSpacing: '0.04em', color: '#2c1810',
                  fontFamily: currentTier === 'original'
                    ? '"Noto Serif SC", "STSong", "SimSun", serif'
                    : '"Noto Serif SC", "KaiTi", serif',
                  fontWeight: showOriginalProminent ? 600 : 400,
                }}>
                  {s.original}
                </div>
                {/* 翻译 */}
                {(!showOriginalProminent || noteOpen) && (
                  <div style={{
                    marginTop: 8, fontSize: 15, lineHeight: 1.9, color: '#5c4a3a',
                    paddingLeft: 12, borderLeft: `3px solid ${accent}55`,
                  }}>
                    {s.translation}
                  </div>
                )}
                {/* 字词注释 */}
                <div style={{ marginTop: 8 }}>
                  <Button
                    size="small" type="link" icon={<BookOutlined />}
                    onClick={(e) => { e.stopPropagation(); toggleNote(idx); }}
                    style={{ padding: 0, height: 'auto', color: accent }}
                  >
                    {noteOpen ? '收起字词注释' : '🔍 看字词注释'}
                  </Button>
                  {noteOpen && <TokenList tokens={s.tokens} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* 操作提示 */}
        {!isCompleted && (
          <div style={{ textAlign: 'center', marginTop: 20, padding: '16px', background: '#faf5eb', borderRadius: 12, border: '1px solid #e8d5b8' }}>
            <Space direction="vertical" size={8}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {isAutoPlay ? '⏱ 自动播放中（每句4秒）' : '👆 点击文字区域读下一句'}
              </Text>
              <Space>
                <Button size="small" icon={isAutoPlay ? <PauseCircleOutlined /> : <CaretRightOutlined />}
                  onClick={(e) => { e.stopPropagation(); setIsAutoPlay(!isAutoPlay); }}
                  type={isAutoPlay ? 'primary' : 'default'}>
                  {isAutoPlay ? '暂停' : '自动播放'}
                </Button>
                <Button size="small" icon={<StepForwardOutlined />}
                  onClick={(e) => { e.stopPropagation(); goNext(); }}>下一句</Button>
                <Button size="small" icon={<ReloadOutlined />}
                  onClick={(e) => { e.stopPropagation(); setRevealedIdx([0]); setCurrentIdx(0); setIsCompleted(false); setExpandedNotes({}); }}>重来</Button>
              </Space>
            </Space>
          </div>
        )}

        {/* 完成状态 */}
        {isCompleted && (
          <div className="fade-in" style={{ textAlign: 'center', marginTop: 24 }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#5b8c5a' }} />
            <Title level={4} style={{ color: '#5b8c5a', marginTop: 12 }}>🎉 太厉害了！你读完了整篇文言文！</Title>
            <Text type="secondary">你读完了 {totalSentences} 句，获得了 ⭐ 10 颗星星！</Text>
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button icon={<ReloadOutlined />}
                  onClick={() => { setRevealedIdx([0]); setCurrentIdx(0); setIsCompleted(false); setExpandedNotes({}); }}>重新阅读</Button>
                <Button type="primary" icon={<CheckCircleOutlined />}
                  style={{ background: '#5b8c5a', borderColor: '#5b8c5a' }}
                  onClick={() => {
                    if (currentUser) {
                      addReadingRecord({
                        id: `rec-${Date.now()}`, studentId: currentUser.id, textId: text.id,
                        tier: currentTier, progress: 100, timeSpent: 300,
                        exercisesCompleted: answeredCount, exercisesCorrect: correctCount,
                        lastReadAt: new Date().toISOString(),
                      });
                      addPoints(10);
                    }
                  }}>标记完成</Button>
                <Button icon={<FilePdfOutlined />} loading={isExporting} onClick={handleExportPDF}
                  style={{ borderColor: '#c43a31', color: '#c43a31' }}>导出 PDF</Button>
              </Space>
            </div>
          </div>
        )}
      </div>

      {/* 底部：背景 / 练习 / 溯源 */}
      {isCompleted && (
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px 40px' }} className="fade-in">
          <Card style={{ borderRadius: 12, borderColor: '#e8d5b8' }}>
            <Tabs items={[
              {
                key: 'grammar',
                label: <span><StarOutlined /> 字词注释汇总</span>,
                children: <GrammarSummary textId={text.id} annotation={annotation} />,
              },
              {
                key: 'bg',
                label: <span><BulbOutlined /> 背景拓展</span>,
                children: background ? <BackgroundPanel background={background} /> : <Empty description="暂无背景资料" />,
              },
              {
                key: 'ex',
                label: <span><QuestionCircleOutlined /> 文言文练习（{answeredCount}/{exercises.length}）</span>,
                children: exercises.length > 0
                  ? <ExerciseList exercises={exercises} answers={exerciseAnswers} results={showResult}
                      onAnswer={handleAnswer} correct={correctCount} total={exercises.length} />
                  : <Empty description="暂无练习题" />,
              },
              {
                key: 'source',
                label: <span><ReadOutlined /> CADAL 溯源</span>,
                children: (
                  <div>
                    <AncientImage src={text.cadalImageUrl} alt={`${text.title} 古籍原图`}
                      caption={`CADAL 数字图书馆 · ${text.cadalId}`} />
                    <Paragraph style={{ marginTop: 12 }}>
                      本篇出自 <b>{background?.source || '古籍'}</b>
                      {background?.sourceDescription && <>——{background.sourceDescription}</>}
                    </Paragraph>
                    <Paragraph type="secondary">
                      系统已自动匹配 CADAL 古籍善本资源，可对照原版书影理解文字流变与版本差异。
                    </Paragraph>
                  </div>
                ),
              },
            ]} />
          </Card>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .reading-wenyan-original { font-size: calc(var(--font-size, 20px) - 2px) !important; }
        }
      `}</style>
    </div>
  );
}

// 字词注释汇总（按类型分组）
function GrammarSummary({ annotation }: { textId: string; annotation?: WenyanAnnotation }) {
  if (!annotation) return <Empty description="暂无语法标注" />;
  const allTokens = annotation.sentences.flatMap((s) => s.tokens);
  const groups: Record<string, WenyanToken[]> = {};
  allTokens.forEach((t) => {
    (groups[t.type] = groups[t.type] || []).push(t);
  });
  const order = ['实词', '虚词', '通假字', '古今异义', '词类活用', '特殊句式'];
  return (
    <Collapse defaultActiveKey={['实词', '通假字']} items={order
      .filter((k) => groups[k]?.length)
      .map((k) => ({
        key: k,
        label: (
          <span>
            <span style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: tokenTypeColor[k].color, marginRight: 8,
            }} />
            {tokenTypeColor[k].label}（{groups[k].length}）
          </span>
        ),
        children: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {groups[k].map((t, i) => (
              <div key={i} style={{ paddingBottom: 10, borderBottom: '1px dashed #eee' }}>
                <Space size={6} wrap>
                  <Text strong style={{ fontSize: 15 }}>{t.word}</Text>
                  {t.pinyin && <Text type="secondary" style={{ fontSize: 12 }}>{t.pinyin}</Text>}
                  {t.relatedChar && <Tag color="red" style={{ fontSize: 11 }}>通 {t.relatedChar}</Tag>}
                </Space>
                <div style={{ marginTop: 4, fontSize: 13, color: '#5c4a3a' }}>释义：{t.modernMeaning}</div>
                {t.detail && <div style={{ marginTop: 2, fontSize: 12, color: '#999' }}>{t.detail}</div>}
              </div>
            ))}
          </div>
        ),
      }))} />
  );
}

// 背景拓展面板
function BackgroundPanel({ background }: { background: NonNullable<typeof wenyanBackgrounds[string]> }) {
  return (
    <div>
      <Card size="small" style={{ marginBottom: 12, borderRadius: 12, borderColor: '#e8d5b8', background: '#faf5eb' }}>
        <Text strong>📜 出处典籍：{background.source}</Text>
        <Paragraph style={{ marginTop: 6, marginBottom: 0, fontSize: 13 }}>{background.sourceDescription}</Paragraph>
      </Card>
      <Collapse defaultActiveKey={['author', 'context', 'stories', 'map']} items={[
        {
          key: 'author', label: '✍️ 作者生平',
          children: <Paragraph style={{ margin: 0, fontSize: 13 }}>{background.authorBio}</Paragraph>,
        },
        {
          key: 'context', label: '🏛 历史背景',
          children: <Paragraph style={{ margin: 0, fontSize: 13 }}>{background.historicalContext}</Paragraph>,
        },
        {
          key: 'stories', label: '🔗 相关典故',
          children: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {background.relatedStories.map((s, i) => (
                <div key={i}>
                  <Text strong style={{ fontSize: 14 }}>{s.title}</Text>
                  <div style={{ fontSize: 13, color: '#5c4a3a', marginTop: 2 }}>{s.description}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>— {s.source}</div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'map', label: '🧠 思维导图',
          children: <MindMap node={background.mindMap} />,
        },
      ]} />
    </div>
  );
}

// 练习列表（交互）
function ExerciseList({
  exercises, answers, results, onAnswer, correct, total,
}: {
  exercises: NonNullable<typeof wenyanExercises[string]>;
  answers: Record<string, string>; results: Record<string, boolean>;
  onAnswer: (id: string, val: string) => void; correct: number; total: number;
}) {
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Progress type="circle" percent={total > 0 ? Math.round((correct / total) * 100) : 0}
          size={56} strokeColor="#5b8c5a" />
        <div>
          <div style={{ fontWeight: 600 }}>已答 {Object.keys(answers).length} / {total}</div>
          <div style={{ fontSize: 12, color: '#5b8c5a' }}>答对 {correct} 题</div>
        </div>
      </div>
      {exercises.map((ex, i) => {
        const ans = answers[ex.id];
        const res = results[ex.id];
        const isCorrect = res && (ans?.trim() === ex.answer.trim() || (ex.options && ans === ex.answer) || ex.answer.includes(ans || ''));
        return (
          <Card key={ex.id} size="small" style={{ marginBottom: 12, borderRadius: 12, borderColor: '#e8d5b8' }}>
            <div style={{ marginBottom: 8 }}>
              <Tag color="gold" style={{ fontSize: 11 }}>{ex.type}</Tag>
              <Text strong style={{ fontSize: 14 }}>{i + 1}. {ex.question}</Text>
            </div>
            {ex.options ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ex.options.map((opt) => {
                  const selected = ans === opt;
                  const isAnswer = opt === ex.answer;
                  let bg = '#fff';
                  let border = '#e8d5b8';
                  if (res && selected && isAnswer) { bg = '#e8f0e3'; border = '#5b8c5a'; }
                  else if (res && selected && !isAnswer) { bg = '#f8e0de'; border = '#c43a31'; }
                  else if (res && isAnswer) { bg = '#e8f0e3'; border = '#5b8c5a'; }
                  return (
                    <Button key={opt} block style={{ textAlign: 'left', background: bg, borderColor: border }}
                      onClick={() => onAnswer(ex.id, opt)} disabled={!!res}>
                      {opt}
                      {res && isAnswer && ' ✓'}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={ans || ''}
                  disabled={!!res}
                  placeholder="输入你的答案…"
                  onChange={(e) => onAnswer(ex.id, e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e8d5b8', minWidth: 200, fontSize: 14 }}
                />
                {!res && <Button size="small" type="primary" onClick={() => onAnswer(ex.id, ans || '')}>提交</Button>}
              </div>
            )}
            {res && (
              <div style={{
                marginTop: 10, padding: '10px 12px', borderRadius: 8,
                background: isCorrect ? '#f0f7f0' : '#fbf1f0',
                border: `1px solid ${isCorrect ? '#5b8c5a' : '#c43a31'}55`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isCorrect ? '#5b8c5a' : '#c43a31' }}>
                  {isCorrect ? '✓ 答对啦！' : `✗ 正确答案：${ex.answer}`}
                </div>
                <div style={{ fontSize: 12, color: '#5c4a3a', marginTop: 4 }}>解析：{ex.analysis}</div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
