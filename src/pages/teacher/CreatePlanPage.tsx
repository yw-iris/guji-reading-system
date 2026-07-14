import { useState, useMemo } from 'react';
import type { ReactNode, DragEvent } from 'react';
import {
  Typography, Row, Col, Button, Space, Steps, Tag, Input, Select, Divider, Alert, Badge,
} from 'antd';
import {
  ExperimentOutlined, ThunderboltOutlined,
  CheckCircleOutlined, ArrowRightOutlined, ReloadOutlined,
  BookOutlined, BulbOutlined, DownloadOutlined, StarOutlined,
  FileImageOutlined, FileTextOutlined, ApartmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockTexts, mockTieredContent, mockStudyPoints } from '../../utils/mockData';
import type { AncientText } from '../../types';
import { ReturnSeal, SuccessSeal, SealMark, EmptyState, InkLoader } from '../../components/common';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const steps = [
  { title: '选择古籍与年级', description: '确定备课内容' },
  { title: 'AI 生成教案', description: '自动匹配课标' },
  { title: '调整与确认', description: '个性化修改' },
];

/* ---------- 类型 ---------- */
interface Note {
  id: string;
  label: string;
  anchors: string[];
  content: string;
}
interface Material {
  id: string;
  name: string;
  kind: string;
  thumb?: string;
  desc: string;
  icon: ReactNode;
}
interface TierExercise {
  tier: string;
  paper: 'plain' | 'gold' | 'red';
  exercises: { q: string; a: string }[];
}
interface GenStep {
  order: number;
  title: string;
  duration: number;
  content: string;
  tier?: string;
}

/* ---------- 辅助函数 ---------- */
function gradeStage(grade: number): string {
  if (grade <= 6) return '小学';
  if (grade <= 9) return '初中';
  return '高中';
}

/** 从原文中挑出若干不重复的汉字，作为原文区可点击的锚点 */
function pickHanChars(original: string, count: number, startIdx: number): string[] {
  const han = [...original].filter((ch) => /[一-鿿]/.test(ch));
  const out: string[] = [];
  for (let i = startIdx; i < han.length && out.length < count; i++) {
    if (!out.includes(han[i])) out.push(han[i]);
  }
  let j = 0;
  while (out.length < count && j < han.length) {
    if (!out.includes(han[j])) out.push(han[j]);
    j++;
  }
  return out;
}

function buildNotes(text: AncientText, original: string): Note[] {
  const notes: Note[] = [];
  const sp = mockStudyPoints[text.id];
  if (sp && sp.length) {
    const top = sp.slice(0, 4);
    notes.push({
      id: 'words',
      label: '字词',
      anchors: top.map((s) => s.char),
      content: top.map((s) => `${s.char}（${s.pinyin}）：${s.explanation}`).join('；'),
    });
  }
  const kp = text.textbookMatch[0]?.knowledgePoints ?? [];
  notes.push({
    id: 'main',
    label: '主旨',
    anchors: pickHanChars(original, 2, 4),
    content: kp.length
      ? `核心知识点：${kp.join('、')}。体会文章主旨与情感。`
      : `体会《${text.title}》的主旨与情感。`,
  });
  notes.push({
    id: 'bg',
    label: '背景',
    anchors: pickHanChars(original, 2, 10),
    content: `${text.dynasty}·${text.author}。《${text.title}》${
      text.textbookMatch[0] ? `选自 ${text.textbookMatch[0].grade}年级 ${text.textbookMatch[0].unit}` : ''
    }，CADAL 编号 ${text.cadalId}。`,
  });
  notes.push({
    id: 'skill',
    label: '技法',
    anchors: pickHanChars(original, 2, 16),
    content:
      text.tags.includes('唐诗') || text.tags.includes('宋诗')
        ? '意象营造、情景交融、对仗工整，注意朗读节奏与韵脚。'
        : '叙事层次清晰、对比衬托，关注文言虚词与古今异义。',
  });
  return notes;
}

function buildMaterials(text: AncientText): Material[] {
  const sp = mockStudyPoints[text.id] ?? [];
  const tm = text.textbookMatch[0];
  return [
    {
      id: 'cadal',
      name: '古籍原图',
      kind: '古画',
      thumb: text.cadalImageUrl,
      desc: `CADAL ${text.cadalId}`,
      icon: <FileImageOutlined />,
    },
    {
      id: 'zi',
      name: '生字笺',
      kind: '字卡',
      desc: sp.slice(0, 3).map((s) => s.char).join('、') || '生字',
      icon: <FileTextOutlined />,
    },
    {
      id: 'kebiao',
      name: '课标对照',
      kind: '图谱',
      desc: tm ? `${tm.grade}年级·${tm.unit}` : '课标',
      icon: <ApartmentOutlined />,
    },
    {
      id: 'sanceng',
      name: '三层文本',
      kind: '文本',
      desc: '原版 / 简化 / 白话',
      icon: <FileTextOutlined />,
    },
  ];
}

function buildExercises(text: AncientText): TierExercise[] {
  const sp = mockStudyPoints[text.id] ?? [];
  const kp = text.textbookMatch[0]?.knowledgePoints ?? [];
  const word = sp[0]?.char ?? '之';
  return [
    {
      tier: '基础',
      paper: 'plain',
      exercises: [
        { q: `朗读并背诵《${text.title}》，圈出本课生字（如「${word}」）。`, a: '正确流利，读准字音' },
        { q: `《${text.title}》的作者是谁？属于哪个朝代？`, a: `${text.author}（${text.dynasty}）` },
      ],
    },
    {
      tier: '进阶',
      paper: 'gold',
      exercises: [
        {
          q: `解释重点字词：${sp.slice(0, 2).map((s) => `「${s.char}」${s.explanation}`).join('；') || '结合注释理解文意'}。`,
          a: '结合注释疏通文意',
        },
        { q: `说说你对「${kp[0] ?? text.title}」的理解。`, a: '言之成理即可' },
      ],
    },
    {
      tier: '挑战',
      paper: 'red',
      exercises: [
        {
          q: `以「${text.title}」为题，写一段 100 字左右的赏析，品析其${
            text.tags.includes('唐诗') || text.tags.includes('宋诗') ? '意象与意境' : '写法与主旨'
          }。`,
          a: '观点明确，结合原文',
        },
      ],
    },
  ];
}

function buildObjectives(text: AncientText) {
  const isPoem = text.tags.includes('唐诗') || text.tags.includes('宋诗');
  return [
    { label: '知识与能力', content: `理解《${text.title}》基本内容，掌握重点字词含义。` },
    { label: '过程与方法', content: `通过${isPoem ? '诵读' : '研读'}与讨论，体会${isPoem ? '诗歌' : '文章'}的表达技巧。` },
    {
      label: '情感态度',
      content: text.textbookMatch[0]?.knowledgePoints.slice(-1)[0] ?? '体会古典文学之美。',
    },
  ];
}

function buildProcessSteps(text: AncientText, req: string): GenStep[] {
  return [
    {
      order: 1,
      title: '情境导入',
      duration: 5,
      content: `展示《${text.title}》相关图片/视频，创设情境，激发兴趣。${req ? `（按教师需求：${req}）` : ''}`,
    },
    {
      order: 2,
      title: '初读感知',
      duration: 10,
      content: '教师范读 → 学生跟读 → 借助简化版文本自主阅读，标记疑难字词。',
      tier: 'adapted',
    },
    {
      order: 3,
      title: '精读研析',
      duration: 15,
      content: `逐句讲解重点字词和句式。结合白话解读版理解文意，分析${
        text.textbookMatch[0]?.knowledgePoints.slice(0, 2).join('、') ?? '核心知识点'
      }等。`,
      tier: 'vernacular',
    },
    {
      order: 4,
      title: '拓展延伸',
      duration: 8,
      content: `展示 CADAL 古籍原图（编号：${text.cadalId}），感受古籍原貌。讨论：这篇文章/诗歌在今天的意义。`,
    },
    {
      order: 5,
      title: '课堂总结',
      duration: 5,
      content: '回顾本课重点，布置课后练习。',
    },
  ];
}

function buildGeneratedPlanText(
  text: AncientText,
  grade: number,
  req: string,
  objectives: { label: string; content: string }[],
  steps: GenStep[],
  exercises: TierExercise[],
): string {
  const lines: string[] = [];
  lines.push(`《${text.title}》教学设计`);
  lines.push(`年级：${grade}年级 · ${gradeStage(grade)}语文`);
  lines.push(`作者：${text.author} · ${text.dynasty}    CADAL：${text.cadalId}`);
  if (req) lines.push(`特殊需求：${req}`);
  lines.push('');
  lines.push('一、教学目标');
  objectives.forEach((o) => lines.push(`  · ${o.label}：${o.content}`));
  lines.push('');
  lines.push('二、教学流程');
  steps.forEach((s) => {
    lines.push(`  ${s.order}. ${s.title}（${s.duration}分钟）`);
    lines.push(`     ${s.content}`);
  });
  lines.push('');
  lines.push('三、分层习题');
  exercises.forEach((t) => {
    lines.push(`  【${t.tier}】`);
    t.exercises.forEach((ex, i) => {
      lines.push(`    ${i + 1}. ${ex.q}`);
      lines.push(`       参考答案：${ex.a}`);
    });
  });
  return lines.join('\n');
}

/** 竖排原文渲染：锚点字可点击，被选中时以朱红圈点标记 */
function renderOriginalChars(
  original: string,
  charToNote: Record<string, string>,
  markedChars: Set<string>,
  onChar: (ch: string) => void,
) {
  return [...original].map((ch, i) => {
    if (ch === '\n') return <br key={`b${i}`} />;
    const isHan = /[一-鿿]/.test(ch);
    if (!isHan) return <span key={i} className="gj-punct">{ch}</span>;
    const noteId = charToNote[ch];
    const marked = markedChars.has(ch);
    return (
      <span
        key={i}
        className={`gj-char${noteId ? ' is-link' : ''}${marked ? ' is-marked' : ''}`}
        onClick={noteId ? () => onChar(ch) : undefined}
      >
        {ch}
      </span>
    );
  });
}

export default function CreatePlanPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [targetGrade, setTargetGrade] = useState<number | null>(null);
  const [customRequirement, setCustomRequirement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(false);

  // 生成成功印章
  const [genSeal, setGenSeal] = useState(false);
  // 原文与要点联动
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [markedChars, setMarkedChars] = useState<Set<string>>(new Set());
  // 素材拖拽
  const [addedMaterials, setAddedMaterials] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropRipple, setDropRipple] = useState(false);
  // 导出装订
  const [bookbinding, setBookbinding] = useState(false);
  const [exportSeal, setExportSeal] = useState(false);

  const selectedTextObj = mockTexts.find((t) => t.id === selectedText) ?? null;
  const tiered = selectedText ? mockTieredContent[selectedText] : undefined;

  const notes = useMemo(
    () => (selectedTextObj && tiered ? buildNotes(selectedTextObj, tiered.original) : []),
    [selectedTextObj, tiered],
  );
  const charToNote = useMemo(() => {
    const map: Record<string, string> = {};
    notes.forEach((n) => n.anchors.forEach((c) => { if (!(c in map)) map[c] = n.id; }));
    return map;
  }, [notes]);
  const materials = useMemo(
    () => (selectedTextObj ? buildMaterials(selectedTextObj) : []),
    [selectedTextObj],
  );
  const exercises = useMemo(
    () => (selectedTextObj ? buildExercises(selectedTextObj) : []),
    [selectedTextObj],
  );
  const objectives = useMemo(
    () => (selectedTextObj ? buildObjectives(selectedTextObj) : []),
    [selectedTextObj],
  );
  const processSteps = useMemo(
    () => (selectedTextObj ? buildProcessSteps(selectedTextObj, customRequirement) : []),
    [selectedTextObj, customRequirement],
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenSeal(false);
    window.setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPlan(true);
      setCurrentStep(2);
      setGenSeal(true);
      window.setTimeout(() => setGenSeal(false), 1600);
    }, 2500);
  };

  const resetAll = () => {
    setCurrentStep(0);
    setGeneratedPlan(false);
    setActiveNoteId(null);
    setMarkedChars(new Set());
    setAddedMaterials([]);
  };

  const onCharClick = (ch: string) => {
    const noteId = charToNote[ch];
    if (noteId) setActiveNoteId(noteId);
  };
  const onSelectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setMarkedChars(new Set(note.anchors));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id && !addedMaterials.includes(id)) {
      setAddedMaterials((prev) => [...prev, id]);
      setDropRipple(true);
      window.setTimeout(() => setDropRipple(false), 600);
    }
  };

  const handleExport = () => {
    if (!selectedTextObj || !targetGrade) return;
    setBookbinding(true);
    window.setTimeout(() => {
      downloadText(
        `《${selectedTextObj.title}》备课包.txt`,
        buildGeneratedPlanText(selectedTextObj, targetGrade, customRequirement, objectives, processSteps, exercises),
      );
      setBookbinding(false);
      setExportSeal(true);
      window.setTimeout(() => setExportSeal(false), 1600);
    }, 650);
  };

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const stageOf = (t: AncientText) =>
    t.schoolStage.includes('primary') ? '小学' : t.schoolStage.includes('junior') ? '初中' : '高中';

  return (
    <div className="gj-studio-bg gj-fade-up" style={{ minHeight: '100vh', padding: 24, maxWidth: 1080, margin: '0 auto' }}>
      <style>{`
        .gj-desk-head { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
        .gj-scroll-field { background: rgba(253,250,243,0.7); border:1px solid var(--border-ink);
          border-radius:10px; padding:12px 14px; }
        .gj-field-label { display:flex; align-items:center; gap:8px; font-weight:700; color:var(--ink-black); margin-bottom:8px; }
        .gj-text-chip { background:#fdfaf3; border:1px solid var(--border-ink); border-radius:10px;
          padding:8px 12px; min-width:128px; cursor:pointer; transition: all .3s var(--gj-ease); }
        .gj-text-chip:hover { transform: translateY(-3px); box-shadow: var(--shadow-2); border-color: var(--jade); }
        .gj-text-chip.is-on { border:2px solid var(--jade); background: var(--jade-soft); }
        .gj-seal-btn { background: var(--vermilion) !important; border-color: var(--vermilion) !important;
          height:48px; padding:0 40px; font-size:16px; font-family:'Noto Serif SC',serif; }
        .gj-seal-btn.gj-bookbind { animation: gj-bookbind .65s var(--gj-ease); }

        .gj-original-scroll { height: 440px; overflow:auto; padding:16px; line-height: 2.1;
          font-size:20px; letter-spacing:2px; background:
            repeating-linear-gradient(0deg, rgba(139,115,85,0.05) 0 1px, transparent 1px 30px),
            linear-gradient(180deg,#fdfaf3,#f5e6d3);
          border:1px solid var(--border-ink); border-radius:10px; }
        .gj-char { border-radius:6px; padding:0 1px; transition: all .2s var(--gj-ease); }
        .gj-char.is-link { cursor:pointer; }
        .gj-char.is-link:hover { color: var(--vermilion); background: var(--vermilion-soft); }
        .gj-char.is-marked { background: var(--vermilion-soft); border:1px solid var(--vermilion); }
        .gj-punct { color: var(--warm-brown); }

        .gj-note-card { position:relative; display:flex; gap:12px; align-items:flex-start;
          background:#faf3e3; border:1px solid rgba(196,58,49,0.35); border-radius:10px;
          padding:12px 14px 12px 14px; transition: all .3s var(--gj-ease); cursor:pointer; overflow:hidden; }
        .gj-note-card:hover { box-shadow: var(--shadow-2); }
        .gj-note-card.is-active { border:1.5px solid var(--jade); box-shadow: var(--shadow-2);
          animation: gj-note-pop .4s var(--gj-ease); }
        .gj-note-card .gj-seal-wm { position:absolute; top:8px; right:8px; opacity:.5; }
        .gj-note-label { font-weight:700; color: var(--vermilion); margin-bottom:4px; font-family:'Noto Serif SC',serif; }
        .gj-note-content { font-size:13px; color: var(--ink-gray); line-height:1.7; }

        .gj-material-shelf { display:flex; flex-wrap:wrap; gap:14px; }
        .gj-material { width:130px; background:linear-gradient(180deg,#f3e7cf,#e9d8b8);
          border:1px solid #b9925e; border-radius:8px; padding:8px; cursor:grab;
          transition: transform .3s var(--gj-ease), box-shadow .3s var(--gj-ease); position:relative; }
        .gj-material:hover { transform: translateY(-4px); box-shadow: var(--shadow-2); }
        .gj-material.is-dragging { opacity:.4; }
        .gj-axle { height:8px; border-radius:4px; background:linear-gradient(90deg,#7a5a36,#a87c45,#7a5a36);
          transform-origin:center; transition: transform .4s var(--gj-ease); }
        .gj-material:hover .gj-axle { transform: scaleX(1.06); }
        .gj-material-frame { margin-top:6px; height:78px; border-radius:4px; overflow:hidden;
          background:#fdfaf3; border:3px solid #cdb389; display:flex; align-items:center; justify-content:center;
          color: var(--warm-brown); font-size:26px; }
        .gj-material-frame img { width:100%; height:100%; object-fit:cover; }
        .gj-material-cap { text-align:center; margin-top:6px; font-size:12px; color: var(--ink-black); font-weight:600; }
        .gj-material-kind { text-align:center; font-size:10px; color: var(--warm-brown); }

        .gj-dropzone { position:relative; min-height:160px; border:2px dashed var(--border-ink);
          border-radius:12px; padding:16px; background: rgba(253,250,243,0.55); transition: all .3s var(--gj-ease); }
        .gj-dropzone.is-over { border-color: var(--vermilion); background: var(--vermilion-soft); }
        .gj-added-chip { display:inline-flex; align-items:center; gap:6px; background:#faf3e3;
          border:1px solid rgba(196,58,49,0.4); border-radius:20px; padding:4px 12px; font-size:13px; color:var(--ink-black); }
        .gj-added-chip b { cursor:pointer; color: var(--vermilion); font-weight:700; }
        .gj-ripple { position:absolute; left:50%; top:50%; width:60px; height:60px; margin:-30px 0 0 -30px;
          border-radius:50%; background: var(--vermilion-soft); border:1px solid var(--vermilion);
          animation: gj-ripple .6s var(--gj-ease) forwards; pointer-events:none; }

        .gj-exercise-paper { border-radius:10px; padding:14px; min-height:200px; }
        .gj-paper-plain { background:#fdfaf3; border:1px solid var(--border-ink); }
        .gj-paper-gold { background:
            radial-gradient(circle at 20% 30%, rgba(184,134,11,0.18), transparent 18%),
            radial-gradient(circle at 70% 60%, rgba(184,134,11,0.16), transparent 16%),
            radial-gradient(circle at 45% 85%, rgba(184,134,11,0.14), transparent 14%),
            #fbf3e0; border:1px solid var(--gold); }
        .gj-paper-red { background:
            repeating-linear-gradient(90deg, rgba(196,58,49,0.28) 0 1px, transparent 1px 26px), #fbf3e0;
          border:1px solid var(--vermilion); }
        .gj-exercise-head { font-weight:700; color: var(--ink-black); margin-bottom:8px;
          font-family:'Noto Serif SC',serif; border-bottom:1px solid rgba(44,24,16,0.12); padding-bottom:6px; }
        .gj-exercise-item { font-size:13px; color: var(--ink-black); margin-bottom:10px; line-height:1.6; }
        .gj-exercise-ans { color: var(--jade); font-size:12px; margin-top:2px; }

        .gj-objective { background:#faf5eb; border:1px solid rgba(184,134,11,0.3); border-radius:8px; padding:10px 12px; height:100%; }
        .gj-step-card { background:#fdfaf3; border:1px solid var(--border-ink); border-radius:8px; padding:10px 12px; margin-bottom:8px; }

        @keyframes gj-note-pop { from { opacity:0; transform: translateX(-16px) scale(.96); } to { opacity:1; transform: translateX(0) scale(1); } }
        @keyframes gj-bookbind { 0% { transform: perspective(600px) rotateY(0deg); } 50% { transform: perspective(600px) rotateY(-22deg); } 100% { transform: perspective(600px) rotateY(0deg); } }
        @keyframes gj-ripple { from { transform: scale(0); opacity:.5; } to { transform: scale(2.6); opacity:0; } }
      `}</style>

      {/* 顶部：返回 + 标题 */}
      <div className="gj-desk-head">
        <ReturnSeal onClick={() => navigate('/teacher/plans')} title="返回教案列表" />
        <div>
          <div className="gj-section-title" style={{ fontSize: 22 }}>
            <ExperimentOutlined style={{ color: 'var(--vermilion)' }} /> AI 智能备课助手
          </div>
          <Text type="secondary">选择古籍、设定年级，AI 自动生成匹配课标的完整教案。</Text>
        </div>
      </div>

      <Steps current={currentStep} items={steps} style={{ marginBottom: 28 }} />

      {/* 步骤 1：选择古籍 */}
      {currentStep === 0 && (
        <div className="gj-fade-up">
          <div className="gj-card" style={{ padding: 22, marginBottom: 20 }}>
            <div className="gj-section-title" style={{ marginBottom: 4 }}>第一步 · 择卷定级</div>
            <Text type="secondary">选定古籍与年级，AI 即刻在案头铺开备课长卷。</Text>
            <Divider style={{ borderColor: 'var(--border-ink)' }} />
            <Row gutter={[20, 20]}>
              <Col xs={24} lg={14}>
                <Text strong>选择古籍</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {mockTexts.map((text) => (
                    <div
                      key={text.id}
                      className={`gj-text-chip${selectedText === text.id ? ' is-on' : ''}`}
                      onClick={() => setSelectedText(text.id)}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--ink-black)' }}>{text.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-gray)' }}>{text.author} · {text.dynasty}</div>
                      <Tag color="orange" style={{ marginTop: 4 }}>{stageOf(text)}</Tag>
                    </div>
                  ))}
                </div>
              </Col>
              <Col xs={24} lg={10}>
                <div className="gj-scroll-field">
                  <div className="gj-field-label">
                    <SealMark text="级" size={28} color="var(--vermilion)" bg="transparent" /> 目标年级
                  </div>
                  <Select
                    placeholder="选择年级"
                    style={{ width: '100%' }}
                    value={targetGrade ?? undefined}
                    onChange={(v) => setTargetGrade(v as number)}
                    options={Array.from({ length: 12 }, (_, i) => ({
                      label: `${i + 1}年级（${i < 6 ? '小学' : i < 9 ? '初中' : '高中'}）`,
                      value: i + 1,
                    }))}
                  />
                </div>
                <div className="gj-scroll-field" style={{ marginTop: 16 }}>
                  <div className="gj-field-label">
                    <SealMark text="需" size={28} color="var(--vermilion)" bg="transparent" /> 特殊需求（可选）
                  </div>
                  <TextArea
                    placeholder="例如：侧重朗读教学 / 需要小组讨论环节 / 适合独立教师一对一辅导场景…"
                    style={{ marginTop: 0 }}
                    rows={3}
                    value={customRequirement}
                    onChange={(e) => setCustomRequirement(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button
              size="large"
              type="primary"
              icon={<ThunderboltOutlined />}
              disabled={!selectedText || !targetGrade}
              onClick={() => { setCurrentStep(1); handleGenerate(); }}
              className="gj-seal-btn"
            >
              生成备课包
            </Button>
          </div>
        </div>
      )}

      {/* 步骤 2：AI 生成中 */}
      {currentStep === 1 && (
        <div className="gj-fade-up" style={{ textAlign: 'center', padding: '60px 0' }}>
          {isGenerating ? (
            <div>
              <div style={{ color: 'var(--vermilion)', display: 'flex', justifyContent: 'center' }}>
                <InkLoader size={48} />
              </div>
              <Title level={4} style={{ marginTop: 24, color: 'var(--jade)' }}>AI 正在研磨教案…</Title>
              <div style={{ maxWidth: 500, margin: '16px auto', textAlign: 'left' }}>
                {[
                  { icon: <CheckCircleOutlined style={{ color: 'var(--jade)' }} />, text: '正在匹配课标知识点…', done: true },
                  { icon: <CheckCircleOutlined style={{ color: 'var(--jade)' }} />, text: '正在提取古籍三层文本…', done: true },
                  { icon: <CheckCircleOutlined style={{ color: 'var(--jade)' }} />, text: '正在生成教学目标和流程…', done: true },
                  { icon: <InkLoader size={16} />, text: '正在优化课堂活动设计…', done: false },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.icon}
                    <Text>{item.text}</Text>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <CheckCircleOutlined style={{ fontSize: 64, color: 'var(--jade)' }} />
              <Title level={3} style={{ color: 'var(--jade)', marginTop: 16 }}>教案生成完成！</Title>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => setCurrentStep(2)}
                style={{ background: 'var(--jade)', marginTop: 16, borderColor: 'var(--jade)' }}
              >
                查看并调整教案
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 步骤 3：案头备课工作台 */}
      {currentStep === 2 && generatedPlan && selectedTextObj && tiered && (
        <div className="gj-fade-up">
          {genSeal && <SuccessSeal message="备课包已生成" />}

          {/* 教案头 */}
          <div className="gj-card" style={{ padding: 18, marginBottom: 16 }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              《{selectedTextObj.title}》教学设计
            </Title>
            <Space wrap>
              <Tag color="green">{targetGrade}年级 · {gradeStage(targetGrade!)}语文</Tag>
              <Tag>{selectedTextObj.author} · {selectedTextObj.dynasty}</Tag>
              <Tag color="orange">CADAL: {selectedTextObj.cadalId}</Tag>
            </Space>
          </div>

          <Alert
            message="AI 教案已生成"
            description="以下是基于课标和古籍内容自动生成的教案，轻点文中朱字可联动右侧笺纸，拖入素材即可成册。"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          {/* 原文区 + 教学要点 */}
          <Row gutter={[16, 16]} align="top">
            <Col xs={24} lg={9}>
              <div className="gj-card" style={{ padding: 16 }}>
                <div className="gj-section-title" style={{ marginBottom: 8 }}>
                  <BookOutlined style={{ color: 'var(--vermilion)' }} /> 原文 · 竖排
                </div>
                <div className="gj-original-scroll vertical-text">
                  {renderOriginalChars(tiered.original, charToNote, markedChars, onCharClick)}
                </div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 8 }}>
                  轻点文中朱色可点之字，右侧对应笺纸即被抽出；点笺纸则原文随之圈点。
                </Text>
              </div>
            </Col>
            <Col xs={24} lg={15}>
              <div className="gj-section-title" style={{ marginBottom: 8 }}>
                <StarOutlined style={{ color: 'var(--vermilion)' }} /> 教学要点 · 笺
              </div>
              <Space direction="vertical" style={{ width: '100%' }} size={10}>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`gj-note-card${activeNoteId === note.id ? ' is-active' : ''}`}
                    onClick={() => onSelectNote(note)}
                  >
                    <span className="gj-seal-wm"><SealMark text="笺" size={34} color="var(--vermilion)" bg="rgba(196,58,49,0.06)" /></span>
                    <div style={{ flex: 1 }}>
                      <div className="gj-note-label">{note.label}</div>
                      <div className="gj-note-content">{note.content}</div>
                    </div>
                  </div>
                ))}
              </Space>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'var(--border-ink)' }} />

          {/* 素材库 + 备课包 */}
          <Row gutter={[16, 16]} align="top">
            <Col xs={24} lg={13}>
              <div className="gj-section-title" style={{ marginBottom: 10 }}>
                <FileImageOutlined style={{ color: 'var(--vermilion)' }} /> 素材库 · 古画装裱
              </div>
              <div className="gj-material-shelf">
                {materials.map((m) => (
                  <div
                    key={m.id}
                    className={`gj-material${draggingId === m.id ? ' is-dragging' : ''}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', m.id);
                      e.dataTransfer.effectAllowed = 'copy';
                      setDraggingId(m.id);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                  >
                    <div className="gj-axle" />
                    <div className="gj-material-frame">
                      {m.thumb ? <img src={m.thumb} alt={m.name} /> : m.icon}
                    </div>
                    <div className="gj-material-cap">{m.name}</div>
                    <div className="gj-material-kind">{m.kind} · {m.desc}</div>
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={24} lg={11}>
              <div className="gj-section-title" style={{ marginBottom: 10 }}>
                <FileTextOutlined style={{ color: 'var(--vermilion)' }} /> 备课包 · 拖入成册
              </div>
              <div
                className={`gj-dropzone${dragOver ? ' is-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {addedMaterials.length === 0 ? (
                  <EmptyState text="将左侧素材拖入此处，装订成册" />
                ) : (
                  <Space wrap>
                    {addedMaterials.map((id) => {
                      const m = materials.find((x) => x.id === id);
                      if (!m) return null;
                      return (
                        <span className="gj-added-chip" key={id}>
                          {m.icon} {m.name}
                          <b onClick={() => setAddedMaterials((prev) => prev.filter((x) => x !== id))}>×</b>
                        </span>
                      );
                    })}
                  </Space>
                )}
                {dropRipple && <span className="gj-ripple" />}
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'var(--border-ink)' }} />

          {/* 教学目标 + 教学流程 */}
          <div className="gj-section-title" style={{ marginBottom: 10 }}>
            <BulbOutlined style={{ color: 'var(--vermilion)' }} /> 教学目标与流程
          </div>
          <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
            {objectives.map((o) => (
              <Col xs={24} sm={8} key={o.label}>
                <div className="gj-objective">
                  <Text strong style={{ color: 'var(--gold)' }}>{o.label}</Text>
                  <Paragraph style={{ marginTop: 4, fontSize: 13, marginBottom: 0 }}>{o.content}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
          {processSteps.map((step) => (
            <div className="gj-step-card" key={step.order}>
              <Space>
                <Badge count={step.order} style={{ backgroundColor: 'var(--jade)' }} />
                <Text strong>{step.title}</Text>
                <Tag>{step.duration}分钟</Tag>
                {step.tier && (
                  <Tag color="blue">
                    {step.tier === 'adapted' ? '简化版文本' : '白话解读版'}
                  </Tag>
                )}
              </Space>
              <Paragraph style={{ marginTop: 6, fontSize: 13, marginBottom: 0 }}>{step.content}</Paragraph>
            </div>
          ))}

          <Divider style={{ borderColor: 'var(--border-ink)' }} />

          {/* 习题区：三档难度 */}
          <div className="gj-section-title" style={{ marginBottom: 10 }}>
            <BulbOutlined style={{ color: 'var(--vermilion)' }} /> 习题 · 三档难度
          </div>
          <Row gutter={[16, 16]}>
            {exercises.map((tier) => (
              <Col xs={24} md={8} key={tier.tier}>
                <div className={`gj-exercise-paper gj-paper-${tier.paper}`}>
                  <div className="gj-exercise-head">{tier.tier}（{tier.paper === 'plain' ? '素白宣纸' : tier.paper === 'gold' ? '洒金宣' : '朱丝栏'}）</div>
                  {tier.exercises.map((ex, i) => (
                    <div className="gj-exercise-item" key={i}>
                      <b>题{i + 1}.</b> {ex.q}
                      <div className="gj-exercise-ans">参考答案：{ex.a}</div>
                    </div>
                  ))}
                </div>
              </Col>
            ))}
          </Row>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Space size="large" wrap>
              <Button icon={<ReloadOutlined />} onClick={resetAll}>
                重新生成
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                className={`gj-seal-btn${bookbinding ? ' gj-bookbind' : ''}`}
                onClick={handleExport}
              >
                装订成册并导出
              </Button>
            </Space>
          </div>
        </div>
      )}

      {exportSeal && <SuccessSeal message="已装订成册" />}
    </div>
  );
}
