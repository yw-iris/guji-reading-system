// ===== 教师端 · 一键生成备课方案 =====
// 选定古籍 + 年级 + 教法变体（诵读 / 情境 / 思辨），一键生成结构化教案预览：
// 三维目标（语言/文学/文化）、教学流程、三个假设 + 角色扮演、分层作业。
// 可保存为教案（写入列表）或导出 txt。

import { useState, useMemo } from 'react';
import {
  Modal, Select, Button, Space, Tag, Tabs, Divider, Alert, message,
} from 'antd';
import {
  ThunderboltOutlined, FileTextOutlined, SaveOutlined, DownloadOutlined,
  BookOutlined, StarOutlined, BulbOutlined, ExperimentOutlined, CloseOutlined,
} from '@ant-design/icons';
import { mockTexts } from '../../utils/mockData';
import type { AncientText, GradeLevel, LessonPlan } from '../../types';
import {
  buildTripleObjectives, buildProcess, buildThreeAssumptions, buildHomework,
  buildLessonPlan, planToText, downloadPlanText, TEACH_VARIANTS, type TeachVariant,
  stageName, isPoem,
} from '../../utils/teachingHelpers';
import { SealMark, SuccessSeal, InkLoader } from '../common';

export default function LessonPlanGenerator({
  onSave,
}: {
  onSave?: (plan: LessonPlan) => void;
}) {
  const [open, setOpen] = useState(false);
  const [textId, setTextId] = useState<string | null>(null);
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const [variant, setVariant] = useState<TeachVariant>('诵读');
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [text, setText] = useState<AncientText | null>(null);
  const [savedSeal, setSavedSeal] = useState(false);

  const selectedText = useMemo(
    () => mockTexts.find((t) => t.id === textId) ?? null,
    [textId],
  );

  const generated = useMemo(() => {
    if (!plan || !text) return null;
    return {
      objectives: buildTripleObjectives(text, variant),
      process: buildProcess(text, variant),
      assumptions: buildThreeAssumptions(text),
      homework: buildHomework(text),
    };
  }, [plan, text, variant]);

  const openModal = () => {
    setOpen(true);
    setPlan(null);
    setText(null);
    setGenerating(false);
    setSavedSeal(false);
    setTextId(null);
    setGrade(null);
    setVariant('诵读');
  };

  const handleGenerate = () => {
    if (!selectedText) {
      message.warning('请先选择一篇古籍');
      return;
    }
    const g: GradeLevel = grade ?? selectedText.gradeLevel[0];
    setGrade(g);
    setText(selectedText);
    setGenerating(true);
    setPlan(null);
    window.setTimeout(() => {
      setPlan(buildLessonPlan(selectedText, g, variant));
      setGenerating(false);
    }, 1400);
  };

  const handleSave = () => {
    if (!plan || !text) return;
    onSave?.(plan);
    setSavedSeal(true);
    message.success('已保存为教案，可在教案列表查看');
    window.setTimeout(() => setSavedSeal(false), 1800);
  };

  const handleExport = () => {
    if (!plan || !text) return;
    downloadPlanText(`《${text.title}》备课方案.txt`, planToText(plan, text));
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ThunderboltOutlined />}
        style={{ background: 'var(--vermilion)', borderColor: 'var(--vermilion)' }}
        onClick={openModal}
      >
        一键生成备课方案
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={880}
        destroyOnClose
        title={
          <Space>
            <ExperimentOutlined style={{ color: 'var(--vermilion)' }} />
            <span style={{ fontFamily: '"Noto Serif SC", serif' }}>一键生成备课方案</span>
          </Space>
        }
      >
        {savedSeal && <SuccessSeal message="已存入教案库" />}

        {/* 选择区 */}
        <div className="gj-card" style={{ padding: 16, marginBottom: 16 }}>
          <Space wrap align="center" size={[16, 12]}>
            <div>
              <div className="gj-field-label" style={{ fontWeight: 700, marginBottom: 6 }}>
                <BookOutlined style={{ color: 'var(--vermilion)' }} /> 选择古籍
              </div>
              <Select
                showSearch
                placeholder="搜索篇目 / 作者"
                style={{ width: 240 }}
                value={textId ?? undefined}
                onChange={(v) => setTextId(v)}
                optionFilterProp="label"
                options={mockTexts.map((t) => ({
                  value: t.id,
                  label: `${t.title}（${t.author}·${t.dynasty}）`,
                }))}
              />
            </div>
            <div>
              <div className="gj-field-label" style={{ fontWeight: 700, marginBottom: 6 }}>
                <SealMark text="级" size={22} color="var(--vermilion)" bg="transparent" /> 目标年级
              </div>
              <Select
                placeholder={selectedText ? `默认 ${selectedText.gradeLevel[0]} 年级` : '选择年级'}
                style={{ width: 160 }}
                value={grade ?? undefined}
                onChange={(v) => setGrade(v as GradeLevel)}
                options={Array.from({ length: 12 }, (_, i) => ({
                  label: `${i + 1}年级（${i < 6 ? '小学' : i < 9 ? '初中' : '高中'}）`,
                  value: i + 1,
                }))}
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                loading={generating}
                onClick={handleGenerate}
                style={{ background: 'var(--vermilion)', borderColor: 'var(--vermilion)' }}
              >
                生成
              </Button>
            </div>
          </Space>
        </div>

        {/* 生成中 */}
        {generating && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ color: 'var(--vermilion)', display: 'flex', justifyContent: 'center' }}>
              <InkLoader size={40} />
            </div>
            <div style={{ marginTop: 16, color: 'var(--jade)' }}>AI 正在研磨备课长卷…</div>
          </div>
        )}

        {/* 结果预览 */}
        {!generating && plan && text && generated && (
          <div className="gj-fade-up">
            <Alert
              type="success"
              showIcon
              message="备课方案已生成"
              description="基于课标知识点与古籍三层文本自动生成，可按需调整教法变体后保存。"
              style={{ marginBottom: 14 }}
            />

            {/* 基本信息 */}
            <div className="gj-card" style={{ padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: 'var(--ink-black)', marginBottom: 8 }}>
                《{text.title}》教学设计
              </div>
              <Space wrap>
                <Tag color="green">{grade}年级 · {stageName(text)}语文</Tag>
                <Tag>{text.author} · {text.dynasty}</Tag>
                <Tag color="orange">CADAL: {text.cadalId}</Tag>
                {text.textbookMatch[0] && (
                  <Tag color="blue">
                    {text.textbookMatch[0].grade}年{text.textbookMatch[0].semester}《{text.textbookMatch[0].lessonName}》
                  </Tag>
                )}
              </Space>
            </div>

            {/* 三维目标 */}
            <div className="gj-section-title" style={{ marginBottom: 8 }}>
              <StarOutlined style={{ color: 'var(--vermilion)' }} /> 三维目标 · 语言 / 文学 / 文化
            </div>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 14 }} size={8}>
              {generated.objectives.map((o, i) => (
                <div key={i} className="gj-objective">
                  <span className="gj-step-no" style={{ background: 'var(--jade)', marginRight: 8 }}>{i + 1}</span>
                  {o}
                </div>
              ))}
            </Space>

            {/* 教法变体 */}
            <div className="gj-section-title" style={{ marginBottom: 8 }}>
              <BulbOutlined style={{ color: 'var(--vermilion)' }} /> 教法变体
            </div>
            <Tabs
              activeKey={variant}
              onChange={(k) => setVariant(k as TeachVariant)}
              style={{ marginBottom: 14 }}
              items={TEACH_VARIANTS.map((v) => ({
                key: v,
                label: v === '诵读' ? '📜 诵读为主' : v === '情境' ? '🎭 情境体验' : '💡 思辨探究',
                children: (
                  <div style={{ padding: '4px 2px' }}>
                    <div style={{ color: 'var(--ink-gray)', fontSize: 13, marginBottom: 8 }}>
                      {v === '诵读'
                        ? '以吟咏涵泳为主轴，在反复朗读中整体感知文意、体会韵味。'
                        : v === '情境'
                          ? '创设真实情境，通过角色扮演与画面再现，在体验中内化文本。'
                          : '以「三个假设」等思辨任务驱动，在追问与争鸣中深化理解。'}
                    </div>
                    <Space wrap>
                      {generated.process
                        .find((s) => s.title === (v === '诵读' ? '吟咏体会' : v === '情境' ? '情境演绎' : '思辨探究'))
                        ?.activities?.map((a) => (
                          <Tag key={a} color="green">{a}</Tag>
                        )) ?? <Tag>逐层推进</Tag>}
                    </Space>
                  </div>
                ),
              }))}
            />

            {/* 三个假设 + 角色扮演 */}
            <div className="gj-section-title" style={{ marginBottom: 8 }}>
              <ExperimentOutlined style={{ color: 'var(--vermilion)' }} /> 课堂活动 · 三个假设 + 角色扮演
            </div>
            <div className="gj-card" style={{ padding: 14, marginBottom: 14, borderColor: 'rgba(196,58,49,0.3)' }}>
              <div style={{ fontWeight: 600, color: 'var(--vermilion)', marginBottom: 6 }}>三个假设（思辨 / 情境核心）</div>
              <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--ink-black)', fontSize: 13, lineHeight: 1.9 }}>
                {generated.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
              <Divider style={{ margin: '12px 0', borderColor: 'var(--border-ink)' }} />
              <div style={{ fontSize: 13, color: 'var(--ink-gray)' }}>
                <b style={{ color: 'var(--jade)' }}>角色扮演：</b>
                分组认领文中角色（{isPoem(text) ? '诗人 / 意象 / 知音读者' : '叙述者 / 主角 / 旁观者'}），
                用现代或古文对话演绎关键情节，再回到「三个假设」分享感悟。
              </div>
            </div>

            {/* 教学流程 */}
            <div className="gj-section-title" style={{ marginBottom: 8 }}>
              <FileTextOutlined style={{ color: 'var(--vermilion)' }} /> 教学流程
            </div>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 14 }} size={8}>
              {generated.process.map((s) => (
                <div key={s.order} className="gj-step-card">
                  <Space wrap>
                    <span className="gj-step-no" style={{ background: 'var(--jade)' }}>{s.order}</span>
                    <b>{s.title}</b>
                    <Tag>{s.duration}分钟</Tag>
                    {s.tier && (
                      <Tag color="blue">{s.tier === 'adapted' ? '简化版文本' : '白话解读版'}</Tag>
                    )}
                  </Space>
                  <div style={{ fontSize: 13, color: 'var(--ink-gray)', marginTop: 4 }}>{s.content}</div>
                </div>
              ))}
            </Space>

            {/* 分层作业 */}
            <div className="gj-section-title" style={{ marginBottom: 8 }}>
              <BulbOutlined style={{ color: 'var(--vermilion)' }} /> 分层作业
            </div>
            <Space wrap size={[12, 12]} style={{ width: '100%', marginBottom: 8 }} align="start">
              <div className="gj-paper-plain gj-exercise-paper" style={{ flex: 1, minWidth: 200 }}>
                <div className="gj-exercise-head">基础（全体）</div>
                {generated.homework.base.map((q, i) => (
                  <div key={i} className="gj-exercise-item">{q}</div>
                ))}
              </div>
              <div className="gj-paper-gold gj-exercise-paper" style={{ flex: 1, minWidth: 200 }}>
                <div className="gj-exercise-head">提升（中等）</div>
                {generated.homework.lift.map((q, i) => (
                  <div key={i} className="gj-exercise-item">{q}</div>
                ))}
              </div>
              <div className="gj-paper-red gj-exercise-paper" style={{ flex: 1, minWidth: 200 }}>
                <div className="gj-exercise-head">拓展（学有余力）</div>
                {generated.homework.expand.map((q, i) => (
                  <div key={i} className="gj-exercise-item">{q}</div>
                ))}
              </div>
            </Space>

            {/* 操作 */}
            <Divider style={{ borderColor: 'var(--border-ink)' }} />
            <Space wrap style={{ justifyContent: 'center', width: '100%' }}>
              <Button icon={<SaveOutlined />} onClick={handleSave}>
                保存为教案
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出方案
              </Button>
              <Button icon={<CloseOutlined />} onClick={() => setOpen(false)}>
                关闭
              </Button>
            </Space>
          </div>
        )}
      </Modal>
    </>
  );
}
