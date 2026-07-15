// ===== 学生端 · 闯关式阅读 =====
// 四关递进：读通（点击查字 + 古今对照）→ 读懂（古今对照 + 理解检测）
// → 读活（三个假设 + 角色扮演 + 录音）→ 读深（思辨开放题 + 笔记）。
// 过关记录进度、解锁成就、发放积分。

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Modal, Steps, Button, Space, Tag, Divider, Input, message, Tooltip, Row, Col, Alert, Typography,
} from 'antd';
import {
  AudioOutlined, AudioMutedOutlined, CheckCircleOutlined, TrophyOutlined,
  RightOutlined, BookOutlined, SwapOutlined, BulbOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import { mockTieredContent, mockStudyPoints, mockTexts } from '../../utils/mockData';
import type { AncientText } from '../../types';
import { buildThreeAssumptions, isPoem } from '../../utils/teachingHelpers';
import { SealMark, SuccessSeal } from '../common';

const { Text } = Typography;

const STAGES = [
  { key: 1, title: '读通', desc: '朗读 · 查字' },
  { key: 2, title: '读懂', desc: '对照 · 理解' },
  { key: 3, title: '读活', desc: '演绎 · 表达' },
  { key: 4, title: '读深', desc: '思辨 · 笔记' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 生成理解检测题（基于 mock 数据，确定性可答） */
function buildQuiz(text: AncientText) {
  const otherAuthors = shuffle(mockTexts.filter((t) => t.author !== text.author).map((t) => t.author)).slice(0, 2);
  const authorQ = {
    q: `《${text.title}》的作者是？`,
    options: shuffle([text.author, ...otherAuthors]),
    answer: text.author,
  };
  const otherDyn = shuffle([...new Set(mockTexts.map((t) => t.dynasty))].filter((d) => d !== text.dynasty)).slice(0, 2);
  const dynQ = {
    q: `《${text.title}》创作于哪个朝代？`,
    options: shuffle([text.dynasty, ...otherDyn]),
    answer: text.dynasty,
  };
  const kp = text.textbookMatch[0]?.knowledgePoints ?? [];
  const right = kp.slice(-1)[0] ?? `体会《${text.title}》的情感与主旨`;
  const wrongPool = shuffle(mockTexts.flatMap((t) => t.textbookMatch[0]?.knowledgePoints ?? [])).filter((x) => x !== right).slice(0, 2);
  const themeQ = {
    q: `关于《${text.title}》的内容，下列说法最贴切的是？`,
    options: shuffle([right, ...wrongPool]),
    answer: right,
  };
  return [authorQ, dynQ, themeQ];
}

export default function ChallengeReading({
  text,
  open,
  onClose,
}: {
  text: AncientText | null;
  open: boolean;
  onClose: () => void;
}) {
  const { challengeProgress, setChallengeStage, readingNotes, setReadingNote, addPoints } = useAppStore();

  const [currentStage, setCurrentStage] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);
  const [marked, setMarked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [roleText, setRoleText] = useState('');
  const [justFinished, setJustFinished] = useState(false);

  // 录音
  const [recording, setRecording] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const recSupported =
    typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const tiered = text ? mockTieredContent[text.id] : undefined;
  const study = text ? mockStudyPoints[text.id] ?? [] : [];

  const charToNote = useMemo(() => {
    const map: Record<string, { pinyin: string; explanation: string }> = {};
    study.forEach((s) => { map[s.char] = { pinyin: s.pinyin, explanation: s.explanation }; });
    return map;
  }, [study]);

  const quiz = useMemo(() => (text ? buildQuiz(text) : []), [text]);
  const assumptions = useMemo(() => (text ? buildThreeAssumptions(text) : []), [text]);

  const maxDone = text ? challengeProgress[text.id] ?? 0 : 0;
  const allDone = maxDone >= 4;

  // 每打开一篇，定位到下一未过关卡
  useEffect(() => {
    if (text && open) {
      setCurrentStage(Math.min((challengeProgress[text.id] ?? 0) + 1, 4));
      setShowOriginal(false);
      setMarked(null);
      setAnswers({});
      setRoleText('');
      setRecSec(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text?.id, open]);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  if (!text) return null;

  const completeStage = (stage: number) => {
    const prev = challengeProgress[text.id] ?? 0;
    if (prev < stage) {
      setChallengeStage(text.id, stage);
      addPoints(5);
    }
    if (stage < 4) {
      setCurrentStage(stage + 1);
    } else {
      setJustFinished(true);
      window.setTimeout(() => setJustFinished(false), 1800);
    }
  };

  const quizAllCorrect = quiz.every((q, i) => answers[i] === q.answer);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
      setRecSec(0);
      timerRef.current = window.setInterval(() => setRecSec((s) => s + 1), 1000);
    } catch {
      message.error('无法访问麦克风，可继续用文字作答');
    }
  };
  const stopRec = () => {
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRecording(false);
  };

  const renderBoard = (content: string) => (
    <div className="gj-char-board">
      {[...content].map((ch, i) => {
        if (ch === '\n') return <br key={i} />;
        const isHan = /[一-鿿]/.test(ch);
        if (!isHan) return <span key={i} className="gj-punct">{ch}</span>;
        const note = charToNote[ch];
        const isMarked = marked === ch;
        return (
          <span
            key={i}
            className={`gj-char${note ? ' is-link' : ''}${isMarked ? ' is-marked' : ''}`}
            onClick={note ? () => setMarked(ch) : undefined}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );

  return (
    <>
      {justFinished && <SuccessSeal message="闯关成功 · 成就解锁" />}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={860}
        destroyOnClose
        title={
          <Space>
            <TrophyOutlined style={{ color: 'var(--gold)' }} />
            <span style={{ fontFamily: '"Noto Serif SC", serif' }}>闯关式阅读 · 《{text.title}》</span>
            {allDone && <SealMark text="闯" size={28} color="var(--jade)" bg="var(--jade-soft)" />}
          </Space>
        }
      >
        <Steps
          current={currentStage - 1}
          onChange={(k) => {
            if (k + 1 <= Math.max(maxDone + 1, 1)) setCurrentStage(k + 1);
          }}
          items={STAGES.map((s) => ({
            title: s.title,
            description: s.desc,
            status: maxDone >= s.key ? 'finish' : currentStage === s.key ? 'process' : 'wait',
          }))}
          style={{ marginBottom: 18 }}
        />

        {/* ===== 读通 ===== */}
        {currentStage === 1 && (
          <div className="gj-fade-up">
            <Space wrap style={{ marginBottom: 10 }}>
              <Button
                size="small"
                icon={<SwapOutlined />}
                onClick={() => setShowOriginal((v) => !v)}
              >
                {showOriginal ? '隐藏原文（繁体）' : '显示原文（繁体）'}
              </Button>
              <Text type="secondary" style={{ fontSize: 12 }}>
                轻点文中朱色可点之字，下方即显注释
              </Text>
            </Space>
            {showOriginal && tiered?.original && (
              <div style={{ marginBottom: 10 }}>{renderBoard(tiered.original)}</div>
            )}
            {tiered?.adapted && renderBoard(tiered.adapted)}
            {marked && charToNote[marked] && (
              <div className="gj-note" style={{ marginTop: 12 }}>
                <b style={{ color: 'var(--vermilion)' }}>{marked}</b>
                <span style={{ marginLeft: 8 }}>（{charToNote[marked].pinyin}）：{charToNote[marked].explanation}</span>
              </div>
            )}
            <Divider style={{ borderColor: 'var(--border-ink)' }} />
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<RightOutlined />}
                style={{ background: 'var(--jade)', borderColor: 'var(--jade)' }}
                onClick={() => completeStage(1)}
              >
                我已读通
              </Button>
            </div>
          </div>
        )}

        {/* ===== 读懂 ===== */}
        {currentStage === 2 && (
          <div className="gj-fade-up">
            <div className="gj-section-title" style={{ marginBottom: 8, fontSize: 15 }}>
              <BookOutlined style={{ color: 'var(--vermilion)' }} /> 古今对照
            </div>
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12}>
                <div className="gj-exercise-head">简化版</div>
                <div className="gj-char-board" style={{ fontSize: 16 }}>{tiered?.adapted}</div>
              </Col>
              <Col xs={24} md={12}>
                <div className="gj-exercise-head">白话解读</div>
                <div className="gj-paper-plain gj-exercise-paper" style={{ fontSize: 13, lineHeight: 1.8 }}>
                  {tiered?.vernacular}
                </div>
              </Col>
            </Row>

            <div className="gj-section-title" style={{ margin: '16px 0 8px', fontSize: 15 }}>
              <CheckCircleOutlined style={{ color: 'var(--vermilion)' }} /> 理解检测
            </div>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {quiz.map((q, i) => (
                <div key={i}>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>{i + 1}. {q.q}</div>
                  <Space wrap>
                    {q.options.map((opt) => {
                      const chosen = answers[i] === opt;
                      const correct = q.answer === opt;
                      const showWrong = chosen && !correct;
                      return (
                        <Button
                          key={opt}
                          size="small"
                          type={chosen ? 'primary' : 'default'}
                          danger={showWrong}
                          style={correct && chosen ? { background: 'var(--jade)', borderColor: 'var(--jade)' } : undefined}
                          onClick={() => setAnswers((prev) => ({ ...prev, [i]: opt }))}
                        >
                          {opt}
                        </Button>
                      );
                    })}
                  </Space>
                  {answers[i] && (
                    <span style={{ marginLeft: 10, fontSize: 12, color: answers[i] === q.answer ? 'var(--jade)' : 'var(--vermilion)' }}>
                      {answers[i] === q.answer ? '✓ 正确' : '✗ 再想想'}
                    </span>
                  )}
                </div>
              ))}
            </Space>

            <Divider style={{ borderColor: 'var(--border-ink)' }} />
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<RightOutlined />}
                disabled={!quizAllCorrect}
                style={{ background: 'var(--jade)', borderColor: 'var(--jade)' }}
                onClick={() => completeStage(2)}
              >
                我已读懂
              </Button>
            </div>
            {!quizAllCorrect && (
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>答对全部题目即可进入下一关</Text>
              </div>
            )}
          </div>
        )}

        {/* ===== 读活 ===== */}
        {currentStage === 3 && (
          <div className="gj-fade-up">
            <div className="gj-section-title" style={{ marginBottom: 8, fontSize: 15 }}>
              <BulbOutlined style={{ color: 'var(--vermilion)' }} /> 三个假设 · 思辨演绎
            </div>
            <div className="gj-card" style={{ padding: 14, marginBottom: 12, borderColor: 'rgba(196,58,49,0.3)' }}>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.9, color: 'var(--ink-black)' }}>
                {assumptions.slice(0, 2).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>

            <div className="gj-section-title" style={{ margin: '4px 0 8px', fontSize: 15 }}>
              <AudioOutlined style={{ color: 'var(--vermilion)' }} /> 角色扮演 + 录音表达
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-gray)', marginBottom: 8 }}>
              任选文中角色（{isPoem(text) ? '诗人 / 意象 / 知音读者' : '叙述者 / 主角 / 旁观者'}），
              就上面的「假设」即兴演绎或发言：
            </div>
            <Input.TextArea
              rows={3}
              placeholder="写下你的台词或想法……"
              value={roleText}
              onChange={(e) => setRoleText(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Space wrap>
              {recSupported ? (
                <Button
                  icon={recording ? <AudioMutedOutlined /> : <AudioOutlined />}
                  danger={recording}
                  onClick={recording ? stopRec : startRec}
                >
                  {recording ? `停止录音（${recSec}s）` : '开始录音'}
                </Button>
              ) : (
                <Tooltip title="当前浏览器不支持麦克风录音">
                  <Button icon={<AudioOutlined />} disabled>录音（不支持）</Button>
                </Tooltip>
              )}
              {recSec > 0 && !recording && (
                <Tag color="green">已录制 {recSec} 秒</Tag>
              )}
            </Space>

            <Divider style={{ borderColor: 'var(--border-ink)' }} />
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<RightOutlined />}
                style={{ background: 'var(--jade)', borderColor: 'var(--jade)' }}
                onClick={() => completeStage(3)}
              >
                我已读活
              </Button>
            </div>
          </div>
        )}

        {/* ===== 读深 ===== */}
        {currentStage === 4 && (
          <div className="gj-fade-up">
            <div className="gj-section-title" style={{ marginBottom: 8, fontSize: 15 }}>
              <BulbOutlined style={{ color: 'var(--vermilion)' }} /> 思辨探究
            </div>
            <div className="gj-card" style={{ padding: 14, marginBottom: 12, borderColor: 'rgba(184,134,11,0.35)' }}>
              <div style={{ fontWeight: 600, color: 'var(--gold)', marginBottom: 4 }}>深度之问</div>
              <div style={{ fontSize: 14, color: 'var(--ink-black)', lineHeight: 1.8 }}>
                {assumptions[2] ?? `读罢《${text.title}》，它最打动你的是哪一点？为什么？`}
              </div>
            </div>

            <div className="gj-section-title" style={{ margin: '4px 0 8px', fontSize: 15 }}>
              <BookOutlined style={{ color: 'var(--vermilion)' }} /> 我的读书笔记
            </div>
            <Input.TextArea
              rows={4}
              placeholder="写下你对这篇古文的思考与收获……"
              value={readingNotes[text.id] ?? ''}
              onChange={(e) => setReadingNote(text.id, e.target.value)}
            />

            <Divider style={{ borderColor: 'var(--border-ink)' }} />
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={allDone ? <TrophyOutlined /> : <CheckCircleOutlined />}
                style={{ background: 'var(--vermilion)', borderColor: 'var(--vermilion)' }}
                onClick={() => completeStage(4)}
              >
                {allDone ? '温习完成' : '完成闯关'}
              </Button>
            </div>
          </div>
        )}

        {allDone && (
          <Alert
            type="success"
            showIcon
            style={{ marginTop: 14 }}
            message="四关已通 · 成就达成"
            description="你已完整通关《${text.title}》的读通→读懂→读活→读深，积分已收入囊中。"
          />
        )}
      </Modal>
    </>
  );
}
