import { useState } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import {
  CalendarOutlined,
  BookOutlined,
  PlusOutlined,
  DeleteOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { mockTexts } from '../../utils/mockData';
import type { AncientText } from '../../types';

const { Text } = Typography;

// 今日可拖拽的候选古文（取前 12 篇，可按需扩展）
const CANDIDATES: AncientText[] = mockTexts.slice(0, 12);

/**
 * 学生端 · 今日学习计划
 * - 进入学生端时的提醒：「先来制定今日的学习计划」
 * - 左侧古文素材可拖拽，右侧「今日学习栏目」承接，落点带涟漪动效（复用教师端交互）
 * - 制定的计划存入全局 store，跨学生端页面持久可见，作为任务式学习的入口
 */
export default function TodayStudyPlan() {
  const navigate = useNavigate();
  const todayPlan = useAppStore((s) => s.todayPlan);
  const addTodayPlan = useAppStore((s) => s.addTodayPlan);
  const removeTodayPlan = useAppStore((s) => s.removeTodayPlan);

  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropRipple, setDropRipple] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id && !todayPlan.includes(id)) {
      addTodayPlan(id);
      setDropRipple(true);
      window.setTimeout(() => setDropRipple(false), 600);
    }
  };

  const plannedTexts = todayPlan
    .map((id) => mockTexts.find((t) => t.id === id))
    .filter((t): t is AncientText => Boolean(t));

  return (
    <div className="gj-today-plan">
      {/* 提醒横幅 */}
      <div className="gj-today-banner">
        <CalendarOutlined className="gj-today-banner-icon" />
        <div className="gj-today-banner-text">
          <Text strong style={{ fontSize: 15, color: 'var(--ink-black)' }}>
            {todayPlan.length === 0 ? '先来制定今日的学习计划' : `今日已安排 ${todayPlan.length} 篇古文`}
          </Text>
          <div style={{ fontSize: 13, color: '#8a7a66', marginTop: 2 }}>
            {todayPlan.length === 0
              ? '把今天想学的古文拖进右侧「今日学习栏目」，开启任务式学习 →'
              : '点击「开始学习」进入阅读，读完后从栏目中移除即可'}
          </div>
        </div>
        {todayPlan.length > 0 && (
          <Button
            size="small"
            type="primary"
            icon={<RightOutlined />}
            onClick={() => navigate('/student/reading')}
          >
            去学习
          </Button>
        )}
      </div>

      <Row gutter={[16, 16]}>
        {/* 左：可拖拽古文素材 */}
        <Col xs={24} lg={13}>
          <div className="gj-section-title" style={{ marginBottom: 10 }}>
            <BookOutlined style={{ color: 'var(--vermilion)' }} /> 今日可读 · 古文素材
          </div>
          <div className="gj-plan-shelf">
            {CANDIDATES.map((t) => {
              const planned = todayPlan.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`gj-plan-card${draggingId === t.id ? ' is-dragging' : ''}${planned ? ' is-planned' : ''}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', t.id);
                    e.dataTransfer.effectAllowed = 'copy';
                    setDraggingId(t.id);
                  }}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <div className="gj-plan-card-title">{t.title}</div>
                  <div className="gj-plan-card-meta">
                    {t.dynasty} · {t.author}
                  </div>
                  {planned && <span className="gj-plan-card-done">已加入</span>}
                </div>
              );
            })}
          </div>
        </Col>

        {/* 右：今日学习栏目（拖拽落点 + 涟漪） */}
        <Col xs={24} lg={11}>
          <div className="gj-section-title" style={{ marginBottom: 10 }}>
            <PlusOutlined style={{ color: 'var(--vermilion)' }} /> 今日学习栏目
          </div>
          <div
            className={`gj-plan-dropzone${dragOver ? ' is-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {plannedTexts.length === 0 ? (
              <div className="gj-plan-empty">
                <CalendarOutlined style={{ fontSize: 28, color: 'var(--gold)' }} />
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  将左侧古文拖到这里，制定今日任务
                </div>
              </div>
            ) : (
              <div className="gj-plan-chips">
                {plannedTexts.map((t) => (
                  <div className="gj-plan-chip" key={t.id}>
                    <div>
                      <div className="gj-plan-chip-title">{t.title}</div>
                      <div className="gj-plan-chip-meta">
                        {t.dynasty} · {t.author}
                      </div>
                    </div>
                    <div className="gj-plan-chip-actions">
                      <Button
                        size="small"
                        type="link"
                        onClick={() => navigate(`/student/reading/${t.id}`)}
                      >
                        开始学习
                      </Button>
                      <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeTodayPlan(t.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {dropRipple && <span className="gj-ripple" />}
          </div>
        </Col>
      </Row>
    </div>
  );
}
