import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Row,
  Col,
  AutoComplete,
  Tag,
  Select,
  Typography,
  Button,
  message,
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  RightOutlined,
  FilterOutlined,
  AudioOutlined,
  AudioMutedOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore, getFilteredTextsFromCache } from '../../stores/appStore';
import { mockTexts, mockReadingRecords } from '../../utils/mockData';
import type { AncientText, GradeLevel } from '../../types';
import { EmptyState, InkLoader, SealMark } from '../../components/common';
import TodayStudyPlan from '../../components/student/TodayStudyPlan';

const { Title, Text } = Typography;
const { Option } = Select;

const dynastyColors: Record<string, string> = {
  唐: '#c43a31',
  宋: '#5b8c5a',
  春秋: '#b8860b',
  战国: '#8b6914',
  三国: '#8b7355',
  东晋: '#5b8c5a',
  南朝: '#b8860b',
  汉: '#8b6914',
  清: '#8b7355',
};

const gradeColors: Record<number, string> = {
  1: '#ff6b6b', 2: '#ffa94d', 3: '#74c0fc',
  4: '#51cf66', 5: '#845ef7', 6: '#f06595',
};

// 页面级国风配色常量
const STYLE = {
  bg: '#fdfaf3',
  cardBg: 'rgba(253,250,243,0.92)',
  cardBorder: 'rgba(44,24,16,0.08)',
  titleColor: '#2c1810',
  accentGold: '#b8860b',
  accentRed: '#c43a31',
  subtleBg: '#f5e6d3',
};

// AutoComplete 下拉选项类型
interface AutoCompleteOption {
  value: string;
  label: React.ReactNode;
  text: AncientText;
}

const difficultyWord = (d: number) => (d <= 2 ? '易' : d <= 4 ? '中' : '难');

// 山水长卷上的篇章节点
function MapNode({
  text,
  status,
  isCurrent,
  onClick,
}: {
  text: AncientText;
  status: 'read' | 'progress' | 'unread';
  isCurrent: boolean;
  onClick: () => void;
}) {
  const fill =
    isCurrent
      ? 'var(--vermilion)'
      : status === 'read'
      ? 'var(--jade)'
      : status === 'progress'
      ? 'var(--gold)'
      : 'rgba(44,24,16,0.2)';
  const labelColor =
    status === 'unread' ? 'var(--ink-gray)' : 'var(--ink-black)';
  return (
    <button
      type="button"
      className={`gj-map-node ${isCurrent ? 'gj-pulse' : ''}`}
      onClick={onClick}
      title={`${text.title}（${status === 'read' ? '已读' : status === 'progress' ? '在读' : '未读'}）`}
      style={{ color: labelColor }}
    >
      {isCurrent && <span className="gj-map-current">当前</span>}
      <svg className="gj-map-peak" viewBox="0 0 36 26" aria-hidden>
        <path
          d="M2 24 L12 8 L20 18 L26 11 L34 24 Z"
          fill={fill}
          stroke={isCurrent ? 'var(--vermilion)' : 'transparent'}
          strokeWidth="1.5"
        />
      </svg>
      <span className="gj-map-label">{text.title}</span>
    </button>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    searchKeyword,
    setSearchKeyword,
    selectedGrade,
    setSelectedGrade,
    setCurrentText,
    texts,
    setTexts,
    readingRecords,
    addReadingRecord,
    currentUser,
    currentText,
  } = useAppStore();

  // 从星图跳转携带的筛选参数（朝代 / 学段 / 文体）
  const queryDynasty = searchParams.get('dynasty');
  const queryStage = searchParams.get('stage');
  const queryGenre = searchParams.get('genre');

  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(queryDynasty);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  // 初始化 texts 到 store
  useEffect(() => {
    if (texts.length === 0) {
      setTexts(mockTexts);
    }
  }, [texts.length, setTexts]);

  // 初始化阅读记录（复用已有 mock，使探宝地图的已读/在读状态有意义）
  useEffect(() => {
    if (readingRecords.length === 0) {
      mockReadingRecords.forEach((r) => addReadingRecord(r));
    }
  }, [readingRecords.length, addReadingRecord]);

  // 默认按当前用户年级筛选，避免首屏栏目空白（仅首次挂载时设置一次，
  // 之后用户点击「全部」可正常清空，不会被默认年级覆盖）
  const didInitGrade = useRef(false);
  useEffect(() => {
    if (!didInitGrade.current && selectedGrade === null && currentUser?.grade) {
      setSelectedGrade(currentUser.grade);
      didInitGrade.current = true;
    }
  }, [selectedGrade, currentUser?.grade, setSelectedGrade]);

  // 首屏 texts 可能尚未填充，直接以 mockTexts 为数据源计算，避免空白闪烁
  const sourceTexts = texts.length > 0 ? texts : mockTexts;
  const loading = texts.length === 0;

  // 使用缓存筛选逻辑
  let cachedFiltered = getFilteredTextsFromCache(sourceTexts, {
    grade: selectedGrade,
    dynasty: selectedDynasty,
    keyword: searchKeyword,
  });

  // 星图维度筛选（学段 / 文体）
  if (queryStage) {
    cachedFiltered = cachedFiltered.filter((t) =>
      t.schoolStage.includes(queryStage as 'primary' | 'junior' | 'senior')
    );
  }
  if (queryGenre === 'wenyan') {
    cachedFiltered = cachedFiltered.filter((t) => t.tags.includes('文言文'));
  } else if (queryGenre === 'poem') {
    cachedFiltered = cachedFiltered.filter((t) => !t.tags.includes('文言文'));
  }

  // 难度筛选（在缓存结果之后，不破坏缓存键）
  const filteredTexts = useMemo(() => {
    if (!difficulty) return cachedFiltered;
    const [lo, hi] = difficulty === '易' ? [1, 2] : difficulty === '中' ? [3, 4] : [5, 5];
    return cachedFiltered.filter((t) => t.difficulty >= lo && t.difficulty <= hi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedFiltered, difficulty]);

  // 当前用户的有效阅读记录
  const userRecords = useMemo(
    () =>
      readingRecords.filter((r) => !currentUser || r.studentId === currentUser.id),
    [readingRecords, currentUser]
  );
  const readSet = useMemo(
    () => new Set(userRecords.filter((r) => r.progress >= 100).map((r) => r.textId)),
    [userRecords]
  );
  const progressSet = useMemo(
    () => new Set(userRecords.filter((r) => r.progress > 0 && r.progress < 100).map((r) => r.textId)),
    [userRecords]
  );

  // 当前节点（探宝地图脉动光晕）：优先当前阅读篇章，否则取在读记录
  const currentId = useMemo(() => {
    if (currentText && filteredTexts.some((t) => t.id === currentText.id)) return currentText.id;
    const p = userRecords.find((r) => r.progress > 0 && r.progress < 100);
    if (p && filteredTexts.some((t) => t.id === p.textId)) return p.textId;
    return null;
  }, [currentText, filteredTexts, userRecords]);

  // 继续阅读入口
  const continueText = useMemo(() => {
    if (currentText) return currentText;
    const p =
      userRecords.find((r) => r.progress > 0 && r.progress < 100) ?? userRecords[0];
    return p ? sourceTexts.find((t) => t.id === p.textId) ?? null : null;
  }, [currentText, userRecords, sourceTexts]);

  // AutoComplete 联想选项
  const autoCompleteOptions = useMemo<AutoCompleteOption[]>(() => {
    if (!searchKeyword) return [];
    const kw = searchKeyword.toLowerCase();
    return mockTexts
      .filter(
        (t) =>
          t.title.toLowerCase().includes(kw) ||
          t.author.toLowerCase().includes(kw) ||
          t.tags.some((tag) => tag.toLowerCase().includes(kw))
      )
      .slice(0, 8)
      .map((t) => ({
        value: t.title,
        label: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 0',
            }}
          >
            <span style={{ fontWeight: 600, color: STYLE.titleColor }}>{t.title}</span>
            <span style={{ color: '#8b7355', fontSize: 12, marginLeft: 12 }}>
              {t.dynasty} · {t.author}
            </span>
          </div>
        ),
        text: t,
      }));
  }, [searchKeyword]);

  // 无结果时的相似古籍推荐
  const recommendedTexts = useMemo<AncientText[]>(() => {
    if (filteredTexts.length > 0) return [];
    const scored = mockTexts.map((t) => {
      let score = 0;
      if (selectedDynasty && t.dynasty === selectedDynasty) score += 3;
      if (selectedGrade && t.gradeLevel.includes(selectedGrade as GradeLevel)) score += 3;
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        const tagMatch = t.tags.filter((tag) => tag.toLowerCase().includes(kw)).length;
        score += tagMatch * 2;
        if (t.title.toLowerCase().includes(kw) || t.author.toLowerCase().includes(kw)) score += 1;
      }
      return { text: t, score };
    });
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.text);
  }, [filteredTexts.length, searchKeyword, selectedGrade, selectedDynasty]);

  // 为你推荐（稳定洗牌，避免每次渲染抖动 + 不再就地篡改 mockTexts）
  const suggestedTexts = useMemo(() => {
    const arr = [...mockTexts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 3);
  }, []);

  // 语音搜书
  const speechSupported =
    typeof window !== 'undefined' &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      message.warning('您的浏览器不支持语音识别');
      return;
    }
    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN';
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchKeyword(transcript);
        stopListening();
      };
      recognition.onerror = () => {
        message.error('语音识别失败，请重试');
        stopListening();
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      message.error('无法启动语音识别');
    }
  }, [setSearchKeyword, stopListening]);

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSelect = (value: string, option: { value: string; text: AncientText }) => {
    setSearchKeyword(value);
    setCurrentText(option.text);
    navigate(`/student/reading/${option.text.id}`);
  };

  const handleStartReading = (text: AncientText) => {
    setCurrentText(text);
    navigate(`/student/reading/${text.id}`);
  };

  // 古籍书册封面卡片
  const renderBook = (text: AncientText, idx: number) => {
    const isRead = readSet.has(text.id);
    const isProgress = progressSet.has(text.id);
    const status = isRead ? 'read' : isProgress ? 'progress' : 'unread';
    return (
      <Col xs={24} sm={12} lg={8} key={text.id} style={{ perspective: '900px' }}>
        <div
          className="gj-book gj-card gj-fade-up"
          style={{ animationDelay: `${idx * 0.06}s` }}
          role="button"
          tabIndex={0}
          onClick={() => handleStartReading(text)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStartReading(text);
            }
          }}
        >
          {/* 顶部：朝代 + 难度印章 */}
          <div className="gj-book-top">
            <Tag color={dynastyColors[text.dynasty] || '#8b6914'}>{text.dynasty}</Tag>
            <SealMark text={difficultyWord(text.difficulty)} color="var(--vermilion)" size={40} />
          </div>

          {/* 书册封面：竖排标题 */}
          <div className={`gj-book-cover gj-book-cover--${status}`}>
            <div className="gj-book-title vertical-text">{text.title}</div>
            <span className="gj-book-seal-corner">藏</span>
          </div>

          {/* 元信息 */}
          <div className="gj-book-meta">
            <div className="gj-book-author">
              {text.author} · {text.dynasty}
            </div>
            <div className="gj-book-tags">
              {text.tags.slice(0, 2).map((tag) => (
                <Tag key={tag} bordered={false} style={{ fontSize: 11, marginBottom: 4 }}>
                  {tag}
                </Tag>
              ))}
              <Tag color={gradeColors[text.gradeLevel[0]] || '#8b7355'} style={{ fontSize: 11 }}>
                {text.gradeLevel[0]}年级
              </Tag>
            </div>
            {text.textbookMatch.length > 0 && (
              <div className="gj-book-textbook">
                <BookOutlined /> 课本：
                {text.textbookMatch
                  .map((m) => `${m.grade}年${m.semester}《${m.lessonName}》`)
                  .join('、')}
              </div>
            )}
            <div className="gj-book-cadal">
              <ClockCircleOutlined /> CADAL {text.cadalId}
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="gj-book-cta">
            <RightOutlined /> {isRead ? '重读' : isProgress ? '继续阅读' : '开始阅读'}
          </div>
        </div>
      </Col>
    );
  };

  // 计算探宝地图的整体进度
  const readCount = filteredTexts.filter((t) => readSet.has(t.id)).length;
  const progressPct = filteredTexts.length
    ? Math.round((readCount / filteredTexts.length) * 100)
    : 0;

  if (loading) {
    return (
      <div
        className="gj-ink-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <InkLoader size={28} />
        <Text type="secondary">水墨铺展中，请稍候…</Text>
      </div>
    );
  }

  return (
    <div
      className="explore-page gj-ink-bg"
      style={{
        padding: 24,
        maxWidth: 1200,
        margin: '0 auto',
        background: 'transparent',
        minHeight: '100vh',
      }}
    >
      {/* 页面标题 —— 泛舟书海，探宝古籍 */}
      <div className="gj-fade-up" style={{ marginBottom: 20 }}>
        <Title
          level={2}
          style={{
            color: 'var(--ink-black)',
            marginBottom: 4,
            letterSpacing: 2,
            fontFamily: '"Noto Serif SC", serif',
          }}
        >
          泛舟书海 · 探宝古籍
        </Title>
        <Text type="secondary">
          从 CADAL 古籍库中探索与课本对应的古诗文，AI 帮你读懂每一篇
        </Text>
      </div>

      {/* 继续阅读 */}
      {continueText && (
        <div
          className="gj-cloud-border gj-lift"
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background:
              'linear-gradient(135deg, rgba(196,58,49,0.08), rgba(184,134,11,0.08))',
            border: '1px solid rgba(196,58,49,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <SealMark text="续" color="var(--vermilion)" size={42} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--warm-brown)' }}>继续阅读</div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--ink-black)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {continueText.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-gray)' }}>
                {continueText.author} · {continueText.dynasty}
              </div>
            </div>
          </div>
          <Button
            type="primary"
            icon={<RightOutlined />}
            onClick={() => handleStartReading(continueText)}
            style={{ flexShrink: 0 }}
          >
            继续
          </Button>
        </div>
      )}

      {/* 探宝地图：山水长卷路径 */}
      {filteredTexts.length > 0 && (
        <div
          className="gj-cloud-border gj-fade-up"
          style={{ marginBottom: 24, padding: '16px 18px 12px' }}
        >
          <div className="gj-section-title" style={{ marginBottom: 4 }}>
            探宝地图
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              已览 {readCount} / {filteredTexts.length} 卷
            </Text>
            <span style={{ fontSize: 12, color: 'var(--ink-gray)' }}>{progressPct}%</span>
          </div>
          <div className="gj-scroll-progress" style={{ marginBottom: 14 }}>
            <i style={{ width: `${progressPct}%` }} />
          </div>
          <div className="gj-map-track">
            {filteredTexts.map((text) => {
              const status: 'read' | 'progress' | 'unread' = readSet.has(text.id)
                ? 'read'
                : progressSet.has(text.id)
                ? 'progress'
                : 'unread';
              return (
                <MapNode
                  key={text.id}
                  text={text}
                  status={status}
                  isCurrent={currentId === text.id}
                  onClick={() => handleStartReading(text)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 搜索与筛选栏 */}
      <div
        className="gj-card gj-cloud-border"
        style={{ marginBottom: 24, padding: 16 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={9} className="explore-search-col" style={{ position: 'relative' }}>
            <AutoComplete
              style={{ width: '100%' }}
              options={autoCompleteOptions}
              value={searchKeyword}
              onChange={setSearchKeyword}
              onSelect={handleSelect}
              defaultActiveFirstOption={false}
              popupClassName="explore-autocomplete-dropdown"
            >
              <input
                placeholder="搜索古籍名称、作者、标签..."
                style={{
                  width: '100%',
                  height: 40,
                  paddingLeft: 36,
                  paddingRight: 40,
                  borderRadius: 8,
                  border: '1px solid var(--border-ink)',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  background: '#fffef9',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#b8860b';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--border-ink)';
                }}
              />
            </AutoComplete>
            <SearchOutlined
              style={{
                position: 'absolute',
                left: 20,
                top: 18,
                zIndex: 1,
                color: 'var(--gold)',
                fontSize: 16,
                pointerEvents: 'none',
              }}
            />
            {speechSupported && (
              <Button
                type="text"
                icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={handleVoiceClick}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 4,
                  zIndex: 1,
                  color: isListening ? 'var(--vermilion)' : 'var(--gold)',
                  fontSize: 16,
                  animation: isListening ? 'voicePulse 1s infinite' : 'none',
                }}
              />
            )}
          </Col>
          <Col xs={12} sm={12} md={5}>
            <Select
              size="large"
              placeholder="选择朝代"
              allowClear
              style={{ width: '100%' }}
              value={selectedDynasty}
              onChange={setSelectedDynasty}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="唐">唐</Option>
              <Option value="宋">宋</Option>
              <Option value="春秋">春秋</Option>
              <Option value="战国">战国</Option>
            </Select>
          </Col>
          <Col xs={24} md={5}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              共找到 <Text strong>{filteredTexts.length}</Text> 篇古籍
            </Text>
          </Col>
        </Row>

        {/* 年级 / 难度 筛选（古书批注风：选中下方朱红横线） */}
        <div className="gj-filter-bar">
          <span className="gj-filter-label">
            <EnvironmentOutlined /> 年级
          </span>
          <div className="gj-chip-row">
            <button
              type="button"
              className={`gj-chip ${selectedGrade === null ? 'is-active' : ''}`}
              onClick={() => setSelectedGrade(null)}
            >
              全部
            </button>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <button
                type="button"
                key={g}
                className={`gj-chip ${selectedGrade === g ? 'is-active' : ''}`}
                onClick={() => setSelectedGrade(g as GradeLevel)}
              >
                {g}年级
              </button>
            ))}
          </div>

          <span className="gj-filter-label" style={{ marginLeft: 8 }}>
            难度
          </span>
          <div className="gj-chip-row">
            <button
              type="button"
              className={`gj-chip ${difficulty === null ? 'is-active' : ''}`}
              onClick={() => setDifficulty(null)}
            >
              全部
            </button>
            {['易', '中', '难'].map((d) => (
              <button
                type="button"
                key={d}
                className={`gj-chip ${difficulty === d ? 'is-active' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 今日学习计划（进入学生端的提醒 + 拖拽制定） */}
      <TodayStudyPlan />

      {/* 古籍书册列表 */}
      {filteredTexts.length === 0 && recommendedTexts.length === 0 ? (
        <EmptyState text="暂无篇章，何不添一卷？" />
      ) : filteredTexts.length === 0 ? (
        <div>
          <div
            className="gj-card"
            style={{
              marginBottom: 24,
              padding: '14px 18px',
              background: 'var(--subtle-bg, #faf5eb)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <SearchOutlined style={{ color: 'var(--gold)', fontSize: 16 }} />
              <Text style={{ color: 'var(--ink-black)', fontSize: 15, fontWeight: 500 }}>
                没有找到完全匹配的古籍，以下是为你推荐的同类古籍：
              </Text>
            </div>
            {searchKeyword && (
              <Text type="secondary" style={{ fontSize: 13, marginLeft: 24 }}>
                关键词「{searchKeyword}」
                {selectedDynasty && ` · ${selectedDynasty}代`}
                {selectedGrade && ` · ${selectedGrade}年级`}
              </Text>
            )}
          </div>
          <Row gutter={[16, 16]}>
            {recommendedTexts.map((text, idx) => renderBook(text, idx))}
          </Row>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTexts.map((text, idx) => renderBook(text, idx))}
        </Row>
      )}

      {/* 为你推荐 */}
      {filteredTexts.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div className="gj-section-title" style={{ marginBottom: 16 }}>
            为你推荐
          </div>
          <Row gutter={[16, 16]}>
            {suggestedTexts.map((text, idx) => renderBook(text, idx))}
          </Row>
        </div>
      )}

      {/* 移动端响应式 + 交互样式 */}
      <style>{`
        @keyframes voicePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        /* 探宝地图长卷 */
        .gj-map-track {
          position: relative;
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 26px 4px 14px;
          scrollbar-width: thin;
        }
        .gj-map-track::before {
          content: '';
          position: absolute;
          left: 8px; right: 8px; top: 46px;
          height: 2px;
          background: repeating-linear-gradient(90deg, rgba(44,24,16,0.28) 0 6px, transparent 6px 14px);
        }
        .gj-map-node {
          position: relative;
          flex: 0 0 auto;
          width: 76px;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 4px 2px;
          border-radius: 8px;
          transition: transform 0.3s var(--gj-ease);
        }
        .gj-map-node:hover { transform: translateY(-4px); }
        .gj-map-peak { width: 34px; height: 24px; transition: transform 0.3s var(--gj-ease); }
        .gj-map-node:hover .gj-map-peak { transform: scale(1.12); }
        .gj-map-label {
          font-size: 11px;
          line-height: 1.3;
          max-width: 72px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Noto Serif SC', serif;
        }
        .gj-map-current {
          position: absolute;
          top: -18px; left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #fff;
          background: var(--vermilion);
          padding: 1px 6px;
          border-radius: 8px;
          white-space: nowrap;
        }

        /* 年级 / 难度 筛选标签 */
        .gj-filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px 10px;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px dashed rgba(44,24,16,0.12);
        }
        .gj-filter-label {
          font-size: 13px;
          color: var(--ink-gray);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .gj-chip-row { display: inline-flex; flex-wrap: wrap; gap: 4px; }
        .gj-chip {
          position: relative;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'Noto Serif SC', serif;
          font-size: 13px;
          color: var(--ink-gray);
          padding: 4px 10px;
          border-radius: 6px;
          transition: color 0.25s var(--gj-ease), background 0.25s var(--gj-ease);
        }
        .gj-chip:hover { color: var(--vermilion); background: rgba(196,58,49,0.06); }
        .gj-chip::after {
          content: '';
          position: absolute;
          left: 10px; right: 10px; bottom: 2px;
          height: 2px;
          background: var(--vermilion);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s var(--gj-ease);
        }
        .gj-chip.is-active { color: var(--vermilion); font-weight: 700; }
        .gj-chip.is-active::after { transform: scaleX(1); }

        /* 古籍书册封面卡片 */
        .gj-book {
          height: 100%;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          transform-style: preserve-3d;
          outline: none;
        }
        .gj-book:hover {
          transform: translateY(-6px) rotateX(4deg);
          box-shadow: var(--shadow-3);
          border-color: var(--vermilion);
        }
        .gj-book:focus-visible { border-color: var(--vermilion); box-shadow: 0 0 0 3px var(--vermilion-soft); }
        .gj-book-top { display: flex; align-items: center; justify-content: space-between; }
        .gj-book-cover {
          position: relative;
          height: 132px;
          border-radius: 8px;
          background:
            linear-gradient(180deg, rgba(91,140,90,0.10), rgba(184,134,11,0.10)),
            linear-gradient(135deg, #fdfaf3 0%, #f5e6d3 100%);
          border: 1px solid rgba(44,24,16,0.1);
          border-left: 5px solid var(--vermilion);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .gj-book-cover--read { border-left-color: var(--jade); }
        .gj-book-cover--progress { border-left-color: var(--gold); }
        .gj-book-title {
          font-family: 'Noto Serif SC', serif;
          font-size: 19px;
          font-weight: 700;
          color: var(--ink-black);
          letter-spacing: 3px;
          line-height: 1.25;
          max-height: 116px;
          text-shadow: 0 1px 0 rgba(255,255,255,0.6);
        }
        .gj-book-seal-corner {
          position: absolute;
          right: 8px; bottom: 6px;
          font-size: 12px;
          color: var(--vermilion);
          border: 1px solid var(--vermilion);
          border-radius: 4px;
          padding: 0 4px;
          transform: rotate(-6deg);
          opacity: 0.7;
        }
        .gj-book-meta { display: flex; flex-direction: column; gap: 4px; }
        .gj-book-author { font-size: 13px; color: var(--ink-black); font-weight: 600; }
        .gj-book-tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .gj-book-textbook, .gj-book-cadal {
          font-size: 11px; color: var(--ink-gray); line-height: 1.4;
        }
        .gj-book-textbook { color: var(--warm-brown); }
        .gj-book-cta {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          color: var(--vermilion);
          font-weight: 700;
          font-size: 14px;
          border-top: 1px dashed rgba(44,24,16,0.12);
          padding-top: 8px;
          width: 100%;
        }
        .gj-book:hover .gj-book-cta { gap: 10px; }

        @media (max-width: 768px) {
          .explore-page { padding: 16px 12px !important; }
          .explore-autocomplete-dropdown {
            min-width: 280px !important;
            max-width: calc(100vw - 32px) !important;
          }
        }
      `}</style>
    </div>
  );
}
