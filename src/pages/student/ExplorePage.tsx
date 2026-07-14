import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  AutoComplete,
  Tag,
  Select,
  Typography,
  Button,
  Empty,
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
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore, getFilteredTextsFromCache } from '../../stores/appStore';
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

// 页面级国风配色常量
const STYLE = {
  bg: '#fdfaf3',
  cardBg: '#fffef9',
  cardBorder: '#e8d5b8',
  titleColor: '#2c1810',
  accentGold: '#b8860b',
  accentRed: '#c43a31',
  subtleBg: '#faf5eb',
};

// AutoComplete 下拉选项类型
interface AutoCompleteOption {
  value: string;
  label: React.ReactNode;
  text: AncientText;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { searchKeyword, setSearchKeyword, selectedGrade, setSelectedGrade, setCurrentText, texts, setTexts, startWarp, currentUser } = useAppStore();

  // 从星图跳转携带的筛选参数（朝代 / 学段 / 文体）
  const queryDynasty = searchParams.get('dynasty');
  const queryStage = searchParams.get('stage');
  const queryGenre = searchParams.get('genre');

  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(queryDynasty);

  // 初始化 texts 到 store
  useEffect(() => {
    if (texts.length === 0) {
      setTexts(mockTexts);
    }
  }, [texts.length, setTexts]);

  // 默认按当前用户年级筛选，避免首屏栏目空白（用户未手动改过时）
  useEffect(() => {
    if (selectedGrade === null && currentUser?.grade) {
      setSelectedGrade(currentUser.grade);
    }
  }, [selectedGrade, currentUser?.grade, setSelectedGrade]);

  // 首屏 texts 可能尚未填充，直接以 mockTexts 为数据源计算，避免空白闪烁
  const sourceTexts = texts.length > 0 ? texts : mockTexts;

  // 使用缓存筛选逻辑
  let filteredTexts = getFilteredTextsFromCache(sourceTexts, {
    grade: selectedGrade,
    dynasty: selectedDynasty,
    keyword: searchKeyword,
  });

  // 星图维度筛选（学段 / 文体）
  if (queryStage) {
    filteredTexts = filteredTexts.filter((t) => t.schoolStage.includes(queryStage as 'primary' | 'junior' | 'senior'));
  }
  if (queryGenre === 'wenyan') {
    filteredTexts = filteredTexts.filter((t) => t.tags.includes('文言文'));
  } else if (queryGenre === 'poem') {
    filteredTexts = filteredTexts.filter((t) => !t.tags.includes('文言文'));
  }

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
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
    // 计算每篇古籍与当前筛选条件的匹配分
    const scored = mockTexts.map((t) => {
      let score = 0;
      if (selectedDynasty && t.dynasty === selectedDynasty) score += 3;
      if (selectedGrade && t.gradeLevel.includes(selectedGrade as GradeLevel)) score += 3;
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        // 标签匹配加权
        const tagMatch = t.tags.filter((tag) => tag.toLowerCase().includes(kw)).length;
        score += tagMatch * 2;
        // 标题/作者部分匹配
        if (t.title.toLowerCase().includes(kw) || t.author.toLowerCase().includes(kw)) score += 1;
      }
      return { text: t, score };
    });
    // 按分数降序，取前 6 个有分的
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.text);
  }, [filteredTexts.length, searchKeyword, selectedGrade, selectedDynasty]);

  // 语音搜书
  const speechSupported = typeof window !== 'undefined' && (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
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
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
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
    startWarp({ name: text.title, color: '#9ec5f0' });
    setTimeout(() => navigate(`/student/reading/${text.id}`), 1150);
  };

  // 古籍卡片渲染函数
  const renderTextCard = (text: AncientText, idx: number) => (
    <Col xs={24} sm={12} lg={8} key={text.id}>
      <Card
        className="parchment-card fade-in"
        style={{
          animationDelay: `${idx * 0.08}s`,
          height: '100%',
          background: STYLE.cardBg,
          border: `1px solid ${STYLE.cardBorder}`,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(44,24,16,0.04)',
        }}
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
        <Title level={4} style={{ color: STYLE.titleColor, marginBottom: 8 }}>
          {text.title}
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          {text.author} · {text.dynasty}
        </Text>

        {/* 适配年级 */}
        <div style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: STYLE.accentGold }}>适配年级：</Text>
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
          <Text style={{ fontSize: 11, color: STYLE.accentGold }}>
            <ClockCircleOutlined /> CADAL: {text.cadalId}
          </Text>
        </div>
      </Card>
    </Col>
  );

  return (
    <div className="explore-page" style={{ padding: 24, maxWidth: 1200, margin: '0 auto', background: STYLE.bg, minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: STYLE.titleColor, marginBottom: 4 }}>
          古籍探索
        </Title>
        <Text type="secondary">
          从 CADAL 古籍库中探索与课本对应的古诗文，AI 帮你读懂每一篇
        </Text>
      </div>

      {/* 搜索与筛选栏 */}
      <Card
        className="explore-search-card"
        style={{
          marginBottom: 24,
          background: STYLE.cardBg,
          border: `1px solid ${STYLE.cardBorder}`,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(44,24,16,0.04)',
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} className="explore-search-col" style={{ position: 'relative' }}>
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
                  paddingRight: 12,
                  borderRadius: 8,
                  border: '1px solid #d9d9d9',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  background: '#fff',
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#b8860b';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#d9d9d9';
                }}
              />
            </AutoComplete>
            <SearchOutlined
              style={{
                position: 'absolute',
                left: 20,
                top: 18,
                zIndex: 1,
                color: STYLE.accentGold,
                fontSize: 16,
                pointerEvents: 'none',
              }}
            />
            {/* 语音搜书按钮 */}
            {speechSupported && (
              <Button
                type="text"
                icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={handleVoiceClick}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 6,
                  zIndex: 1,
                  color: isListening ? '#c43a31' : STYLE.accentGold,
                  fontSize: 16,
                  animation: isListening ? 'voicePulse 1s infinite' : 'none',
                }}
              />
            )}
          </Col>
          <Col xs={12} sm={12} md={4}>
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
          <Col xs={12} sm={12} md={4}>
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
          <Col xs={24} md={8}>
            <Text type="secondary">
              共找到 <Text strong>{filteredTexts.length}</Text> 篇古籍
            </Text>
          </Col>
        </Row>
      </Card>

      {/* 星图来源提示 */}
      {(queryDynasty || queryStage || queryGenre) && (
        <div style={{
          marginBottom: 16, padding: '10px 16px',
          background: 'linear-gradient(135deg, rgba(46,89,132,0.1), rgba(184,134,11,0.1))',
          border: '1px solid #e8d5b8', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Text style={{ color: STYLE.titleColor, fontSize: 14 }}>
            🌌 来自文化星图：
            <Text strong style={{ color: STYLE.accentGold }}>
              {queryDynasty ? `${queryDynasty}代` : queryStage === 'primary' ? '小学古诗词' : queryStage === 'junior' ? '初中文言文' : queryStage === 'senior' ? '高中文言文' : queryGenre === 'wenyan' ? '文言文' : '古诗词'}
            </Text>
            ，共 {filteredTexts.length} 篇
          </Text>
          <Button type="link" size="small" onClick={() => navigate('/student/galaxy')}>
            返回星图
          </Button>
        </div>
      )}

      {/* 古籍列表 */}
      {filteredTexts.length === 0 && recommendedTexts.length === 0 ? (
        <Empty description="没有找到匹配的古籍" style={{ marginTop: 80 }} />
      ) : filteredTexts.length === 0 ? (
        /* 无精确结果时展示相似古籍推荐 */
        <div>
          <Card
            style={{
              marginBottom: 24,
              background: STYLE.subtleBg,
              border: `1px solid ${STYLE.cardBorder}`,
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <SearchOutlined style={{ color: STYLE.accentGold, fontSize: 16 }} />
              <Text style={{ color: STYLE.titleColor, fontSize: 15, fontWeight: 500 }}>
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
          </Card>
          <Row gutter={[16, 16]}>
            {recommendedTexts.map((text, idx) => renderTextCard(text, idx))}
          </Row>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTexts.map((text, idx) => renderTextCard(text, idx))}
        </Row>
      )}

      {/* 移动端响应式样式 */}
      <style>{`
        @keyframes voicePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        @media (max-width: 768px) {
          .explore-page {
            padding: 16px 12px !important;
          }
          .explore-search-card .ant-card-body {
            padding: 16px !important;
          }
          .explore-autocomplete-dropdown {
            min-width: 280px !important;
            max-width: calc(100vw - 32px) !important;
          }
        }
      `}</style>

      {/* 为你推荐 */}
      {filteredTexts.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ marginBottom: 16 }}>
            <Text style={{ color: STYLE.titleColor, fontSize: 18, fontWeight: 600 }}>
              ✨ 为你推荐
            </Text>
          </div>
          <Row gutter={[16, 16]}>
            {mockTexts
              .sort(() => Math.random() - 0.5)
              .slice(0, 3)
              .map((text, idx) => renderTextCard(text, idx))}
          </Row>
        </div>
      )}
    </div>
  );
}
