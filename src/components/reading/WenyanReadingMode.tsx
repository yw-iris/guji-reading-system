import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Button, Space, Segmented, Card, Tag, Divider,
  Tabs, Collapse, Tooltip, Empty, Progress,
} from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined, FileImageOutlined, CheckCircleOutlined,
  ReloadOutlined, StepForwardOutlined, PauseCircleOutlined, CaretRightOutlined,
  StarOutlined, QuestionCircleOutlined, BookOutlined, FilePdfOutlined,
  BulbOutlined, ReadOutlined, EyeOutlined, EyeInvisibleOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import { wenyanGrammar } from '../../data/wenyanGrammar';
import { wenyanBackgrounds } from '../../data/wenyanBackground';
import { wenyanExercises } from '../../data/wenyanExercises';
import type { AncientText, TieredContent, TextTier, WenyanAnnotation, WenyanToken, MindMapNode } from '../../types';
import { exportToPDF } from '../../utils/pdfExport';
import { AncientImage } from '../reading/AncientImage';
import { useSpeech } from '../../hooks/useSpeech';

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
  // 繁体原版（纯挑战）默认隐藏译文，需主动展开；简体原版默认显示
  const [showTranslation, setShowTranslation] = useState(currentTier !== 'original');

  const sentenceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<Record<string, boolean>>({});

  // 语音朗读（浏览器原生 TTS，中文跟读）
  const speech = useSpeech();
  const [isReading, setIsReading] = useState(false);
  const readingRef = useRef(false);

  // 卸载时停止朗读，避免离开页面后仍在后台发声
  useEffect(() => () => { readingRef.current = false; }, []);
  // 阅读完成后自动停止朗读
  useEffect(() => {
    if (isCompleted && readingRef.current) {
      speech.stop();
      readingRef.current = false;
      setIsReading(false);
    }
  }, [isCompleted, speech]);

  // 自动播放与朗读全文互斥
  const toggleAutoPlay = useCallback(() => {
    if (readingRef.current) { speech.stop(); readingRef.current = false; setIsReading(false); }
    setIsAutoPlay((p) => !p);
  }, [speech]);

  // 朗读全文：从当前句开始，逐句朗读并自动推进
  const startReadingAll = useCallback(() => {
    if (!speech.supported) return;
    if (readingRef.current) {
      speech.stop();
      readingRef.current = false;
      setIsReading(false);
      return;
    }
    readingRef.current = true;
    setIsReading(true);
    if (isAutoPlay) setIsAutoPlay(false);
    const readFrom = (i: number) => {
      if (i >= totalSentences) { readingRef.current = false; setIsReading(false); return; }
      setCurrentIdx(i);
      setRevealedIdx((p) => (p.includes(i) ? p : [...p, i]));
      speech.say(`s-${i}`, sentences[i].original, {
        onEnd: () => {
          if (!readingRef.current) return;
          if (i + 1 < totalSentences) readFrom(i + 1);
          else { readingRef.current = false; setIsReading(false); }
        },
      });
    };
    readFrom(currentIdx);
  }, [speech, isAutoPlay, currentIdx, totalSentences, sentences]);

  const readingProgress = totalSentences > 0
    ? Math.round((revealedIdx.length / totalSentences) * 100) : 0;

  // 切换层级重置
  useEffect(() => {
    setRevealedIdx([0]);
    setCurrentIdx(0);
    setIsCompleted(false);
    setExpandedNotes({});
    setShowTranslation(currentTier !== 'original');
  }, [currentTier, text.id]);

  // 当前句变化时，平滑滚动到视口（页面向上推进，已读句子向上累积）
  useEffect(() => {
    const el = sentenceRefs.current[currentIdx];
    if (el && !isCompleted) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIdx, isCompleted]);

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
    const tierName = currentTier === 'original' ? '繁体原版' : '简体原版';
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

        {/* 版本切换：原版（简体）/ 繁体版 两个小按钮 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>文字版本：</Text>
          {[
            { tier: 'adapted' as TextTier, label: '简体原版', desc: '简体' },
            { tier: 'original' as TextTier, label: '繁体原版', desc: '繁体' },
          ].map((opt) => {
            const active = currentTier === opt.tier;
            return (
              <Button
                key={opt.tier}
                size="middle"
                type={active ? 'primary' : 'default'}
                onClick={() => setCurrentTier(opt.tier)}
                style={{
                  borderRadius: 20, padding: '0 18px', height: 36, fontWeight: active ? 600 : 500,
                  border: active ? 'none' : `1px solid #d4c5b2`,
                  background: active ? '#2c1810' : '#fffef9',
                  color: active ? '#f5e6d3' : '#5c4a3a',
                }}
              >
                {opt.label}
                {active && <span style={{ marginLeft: 6, fontSize: 11 }}>✓</span>}
              </Button>
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
                {currentTier === 'original' ? '繁体原版' : '简体原版'}
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>{revealedIdx.length} / {totalSentences} 句</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>{readingProgress}%</Text>
          </div>
          <div style={{ height: 4, background: '#f0e6d3', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${readingProgress}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* 逐句对照区：左原文 / 箭头 / 右翻译+注释 */}
        <div onClick={handleCardClick} style={{ cursor: isCompleted ? 'default' : 'pointer' }}>
          {revealedIdx.map((idx) => {
            const s = sentences[idx];
            if (!s) return null;
            const noteOpen = expandedNotes[idx];
            const isCurrent = idx === currentIdx && !isCompleted;
            return (
              <div
                key={idx}
                ref={(el) => { sentenceRefs.current[idx] = el; }}
                className="fade-in wenyan-sentence"
                style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '16px 18px', marginBottom: 10, borderRadius: 12,
                  background: isCurrent ? '#fffef9' : '#fdfaf3',
                  border: isCurrent
                    ? `1px solid ${accent}55`
                    : speech.isSpeaking(`s-${idx}`)
                      ? '1px solid #c43a3155'
                      : '1px solid transparent',
                  boxShadow: speech.isSpeaking(`s-${idx}`) ? '0 0 0 3px rgba(196,58,49,0.12)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* 左：原句 */}
                <div style={{
                  flex: '1 1 0', minWidth: 0,
                  fontSize: showOriginalProminent ? fontSize + 4 : fontSize,
                  lineHeight: 2.1, letterSpacing: '0.04em', color: '#2c1810',
                  fontFamily: currentTier === 'original'
                    ? '"Noto Serif SC", "STSong", "SimSun", serif'
                    : '"Noto Serif SC", "KaiTi", serif',
                  fontWeight: showOriginalProminent ? 600 : 400,
                }}>
                  {s.original}
                </div>
                {/* 箭头指向右 */}
                <ArrowRightOutlined className="wenyan-arrow" style={{
                  color: accent, marginTop: 8, fontSize: 16, flexShrink: 0,
                  opacity: isCurrent ? 1 : 0.4, transition: 'opacity 0.3s',
                }} />
                {/* 逐句朗读按钮 */}
                <Tooltip title={speech.supported ? (speech.isSpeaking(`s-${idx}`) ? '停止朗读' : '朗读这一句') : '当前浏览器不支持语音朗读'}>
                  <Button
                    size="small"
                    shape="circle"
                    type={speech.isSpeaking(`s-${idx}`) ? 'primary' : 'default'}
                    icon={<SoundOutlined spin={speech.isSpeaking(`s-${idx}`)} />}
                    disabled={!speech.supported}
                    onClick={(e) => { e.stopPropagation(); if (readingRef.current) { speech.stop(); readingRef.current = false; setIsReading(false); } speech.say(`s-${idx}`, s.original); }}
                    style={{ flexShrink: 0, marginTop: 8 }}
                  />
                </Tooltip>
                {/* 右：翻译 + 注释（繁体原版默认隐藏译文，纯挑战） */}
                <div style={{ flex: '1 1 0', minWidth: 0 }}>
                  {showTranslation ? (
                    <>
                      <div style={{
                        fontSize: 15, lineHeight: 1.9, color: '#5c4a3a',
                        paddingLeft: 12, borderLeft: `3px solid ${accent}55`,
                      }}>
                        {s.translation}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <Button size="small" type="link" icon={<EyeInvisibleOutlined />}
                          onClick={(e) => { e.stopPropagation(); setShowTranslation(false); }}
                          style={{ padding: 0, height: 'auto', color: '#a08b6b' }}>
                          隐藏译文
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                      padding: '8px 12px', borderRadius: 8, background: '#faf5eb',
                      borderLeft: `3px dashed ${accent}66`, color: '#a08b6b', fontSize: 13,
                    }}>
                      🔒 纯挑战 · 仅见原句
                      <Button size="small" type="link" icon={<EyeOutlined />}
                        onClick={(e) => { e.stopPropagation(); setShowTranslation(true); }}
                        style={{ padding: 0, height: 'auto', color: accent }}>
                        显示译文
                      </Button>
                    </div>
                  )}
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
              </div>
            );
          })}
        </div>

        {/* 操作提示 */}
        {!isCompleted && (
          <div style={{ textAlign: 'center', marginTop: 20, padding: '16px', background: '#faf5eb', borderRadius: 12, border: '1px solid #e8d5b8' }}>
            <Space direction="vertical" size={8}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {isReading ? '📢 正在朗读，跟着一起读吧！'
                  : isAutoPlay ? '⏱ 自动播放中（每句4秒）' : '👆 点击文字区域读下一句'}
              </Text>
              <Space>
                <Tooltip title={speech.supported ? '' : '当前浏览器不支持语音朗读'}>
                  <Button
                    size="small"
                    icon={isReading ? <PauseCircleOutlined /> : <SoundOutlined />}
                    onClick={(e) => { e.stopPropagation(); startReadingAll(); }}
                    type={isReading ? 'primary' : 'default'}
                    disabled={!speech.supported}
                  >
                    {isReading ? '停止朗读' : '朗读全文'}
                  </Button>
                </Tooltip>
                <Button size="small" icon={isAutoPlay ? <PauseCircleOutlined /> : <CaretRightOutlined />}
                  onClick={(e) => { e.stopPropagation(); toggleAutoPlay(); }}
                  type={isAutoPlay ? 'primary' : 'default'}>
                  {isAutoPlay ? '暂停' : '自动播放'}
                </Button>
                <Button size="small" icon={<StepForwardOutlined />}
                  onClick={(e) => { e.stopPropagation(); goNext(); }}>下一句</Button>
                <Button size="small" icon={<ReloadOutlined />}
                  onClick={(e) => { e.stopPropagation(); speech.stop(); readingRef.current = false; setIsReading(false); setRevealedIdx([0]); setCurrentIdx(0); setIsCompleted(false); setExpandedNotes({}); }}>重来</Button>
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
          .wenyan-sentence { flex-direction: column !important; gap: 8px !important; }
          .wenyan-arrow { display: none !important; }
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
