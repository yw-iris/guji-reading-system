import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Typography, Row, Col, Segmented, Progress } from 'antd';
import {
  TeamOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  FireOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { mockLearningStats } from '../../utils/mockData';
import { EmptyState, InkLoader, SealMark } from '../../components/common';

const { Title, Text } = Typography;

/* ============ 工具函数（确定性派生，仅作装饰用） ============ */
type Range = '7d' | '30d' | 'term';

const WEAK_POOL = ['文言虚词', '古今异义', '通假字', '背诵默写', '文意理解', '论证方法', '比喻辨析'];

/** 由年级与人数确定性派生「模型掌握度」（42-97），用于山势图高度 */
function gradeMastery(grade: number, count: number): number {
  const h = (grade * 37 + count * 13) % 55;
  return 42 + h;
}
function weakPoints(grade: number): string[] {
  const start = grade % WEAK_POOL.length;
  return [0, 1, 2].map((i) => WEAK_POOL[(start + i) % WEAK_POOL.length]);
}
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A[0] + (B[0] - A[0]) * t);
  const g = Math.round(A[1] + (B[1] - A[1]) * t);
  const bl = Math.round(A[2] + (B[2] - A[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
/** 掌握度 -> 朱红(低) 到 青绿(高) */
function masteryColor(m: number): string {
  const t = Math.min(1, Math.max(0, (m - 40) / 55));
  return mix('#c43a31', '#5b8c5a', t);
}

/** 由 7 日真实种子派生不同时间窗趋势（保持交互可用，非大段 mock） */
function buildTrend(base: { date: string; readingCount: number }[], mode: Range) {
  if (mode === '7d') return base;
  if (mode === '30d') {
    return Array.from({ length: 30 }, (_, i) => {
      const t = base[i % base.length];
      const wobble = Math.round(Math.sin(i * 1.3 + 1) * 18 + Math.cos(i * 0.7) * 10);
      return { date: `D${i + 1}`, readingCount: Math.max(20, t.readingCount + wobble) };
    });
  }
  return Array.from({ length: 12 }, (_, i) => {
    const t = base[i % base.length];
    const v = Math.max(60, Math.round(t.readingCount * 3 + Math.sin(i * 0.9) * 40 + 120));
    return { date: `第${i + 1}周`, readingCount: v };
  });
}

/* ============ 中式牌匾指标卡 ============ */
function Plaque({
  title, value, unit, icon, delay,
}: { title: string; value: string | number; unit?: string; icon: ReactNode; delay: number }) {
  return (
    <div className="gj-plaque gj-lift" style={{ animationDelay: `${delay}ms` }}>
      <div className="gj-plaque-cloud" aria-hidden />
      <div className="gj-plaque-hang" aria-hidden />
      <div className="gj-plaque-row">
        <span className="gj-plaque-ico">{icon}</span>
        <span className="gj-plaque-title">{title}</span>
      </div>
      <div className="gj-plaque-value gj-flip">
        {value}
        {unit && <span className="gj-plaque-unit">{unit}</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const stats = mockLearningStats;
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>('7d');
  const [hover, setHover] = useState<number | null>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [activeGrade, setActiveGrade] = useState<number | null>(null);
  const [open, setOpen] = useState<Set<number>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 360);
    return () => clearTimeout(t);
  }, []);

  const grades = stats.gradeDistribution;
  const popular = stats.popularTexts.map((t, i) => ({ ...t, rank: i + 1, key: t.textId }));

  const trend = useMemo(() => buildTrend(stats.weeklyTrend, range), [range, stats.weeklyTrend]);
  const maxCount = Math.max(...trend.map((t) => t.readingCount), 1);
  const avgCount = Math.round(trend.reduce((s, t) => s + t.readingCount, 0) / trend.length);

  const readingHours = Math.round(stats.totalReadingTime / 3600);
  const activeRate = Math.round((stats.activeStudents / stats.totalStudents) * 100);

  const maxGradeCount = Math.max(...grades.map((g) => g.count), 1);

  const toggle = (grade: number) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(grade)) n.delete(grade);
      else n.add(grade);
      return n;
    });

  /* ----- 趋势图 SVG 坐标 ----- */
  const VW = 760;
  const VH = 260;
  const PADL = 44;
  const PADR = 16;
  const PADT = 24;
  const PADB = 42;
  const plotW = VW - PADL - PADR;
  const plotH = VH - PADT - PADB;
  const baseY = VH - PADB;
  const px = (i: number) =>
    PADL + (trend.length === 1 ? plotW / 2 : (i * plotW) / (trend.length - 1));
  const py = (v: number) => PADT + plotH * (1 - v / maxCount);

  const linePts = trend.map((t, i) => `${px(i)},${py(t.readingCount)}`).join(' L ');
  const linePath = `M ${linePts}`;
  const areaPath = `${linePath} L ${px(trend.length - 1)},${baseY} L ${px(0)},${baseY} Z`;

  const tipPct = hover !== null
    ? { left: `${(px(hover) / VW) * 100}%`, top: `${(py(trend[hover].readingCount) / VH) * 100}%` }
    : null;

  /* ----- 山势热力图 SVG 坐标 ----- */
  const MW = 760;
  const MH = 260;
  const MBASE = 232;
  const SLOT = MW / grades.length;
  const mountainPath = (grade: number, count: number) => {
    const i = grades.findIndex((g) => g.grade === grade);
    const m = gradeMastery(grade, count);
    const cx = SLOT * (i + 0.5);
    const w = (count / maxGradeCount) * (SLOT * 0.82);
    const h = (m / 100) * (MH - 78);
    const peakY = MBASE - h;
    return {
      cx,
      w,
      h,
      peakY,
      d: `M ${cx - w / 2} ${MBASE} Q ${cx - w / 6} ${MBASE - h * 0.82} ${cx} ${peakY} Q ${cx + w / 6} ${MBASE - h * 0.82} ${cx + w / 2} ${MBASE} Z`,
      color: masteryColor(m),
      mastery: m,
    };
  };

  return (
    <div className="gj-ink-bg gj-dash">
      <style>{`
        .gj-dash { min-height: 100%; padding: 28px 24px 48px; }
        .gj-dash .gj-wrap { max-width: 1180px; margin: 0 auto; }

        /* 牌匾 */
        .gj-plaque {
          position: relative; border-radius: 10px; padding: 16px 16px 18px;
          background: linear-gradient(180deg, #3a2418 0%, #2c1810 100%);
          border: 1px solid var(--gold);
          box-shadow: 0 8px 20px rgba(44,24,16,.28), inset 0 0 0 1px rgba(184,134,11,.25);
          overflow: hidden; cursor: default;
        }
        .gj-plaque:hover { animation: gj-plaque-sway .9s var(--gj-ease); }
        @keyframes gj-plaque-sway {
          0%{transform:rotate(0)} 25%{transform:rotate(-1.4deg)}
          50%{transform:rotate(1deg)} 75%{transform:rotate(-.6deg)} 100%{transform:rotate(0)}
        }
        .gj-plaque-cloud {
          position: absolute; top: 0; left: 0; right: 0; height: 6px;
          background: linear-gradient(90deg, transparent, var(--gold) 50%, transparent);
          opacity: .55;
        }
        .gj-plaque-hang {
          position: absolute; top: -10px; left: 50%; width: 2px; height: 12px;
          background: var(--gold); transform: translateX(-50%); opacity: .5;
        }
        .gj-plaque-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .gj-plaque-ico {
          display: inline-flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 6px;
          background: rgba(184,134,11,.18); color: var(--gold); font-size: 14px;
        }
        .gj-plaque-title { color: #e9d9b8; font-size: 14px; letter-spacing: 1px; }
        .gj-plaque-value {
          font-size: 34px; font-weight: 800; line-height: 1.1;
          background: linear-gradient(180deg, #f3d27a 0%, #b8860b 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .gj-plaque-unit { font-size: 15px; margin-left: 4px; color: var(--gold); -webkit-text-fill-color: var(--gold); }
        @keyframes gj-flip { from { transform: rotateX(90deg); opacity: 0; } to { transform: none; opacity: 1; } }
        .gj-flip { display: inline-block; transform-origin: bottom; animation: gj-flip .55s var(--gj-ease) both; }

        /* 区块外框 */
        .gj-panel {
          position: relative; margin-top: 22px; padding: 20px;
          background: rgba(253,250,243,.9); border: 1px solid rgba(44,24,16,.1);
          border-radius: 14px; box-shadow: var(--shadow-1);
        }
        .gj-seg .ant-segmented-thumb { background: var(--vermilion) !important; }
        .gj-seg .ant-segmented-item-selected { color: #fff !important; font-weight: 600; }

        /* 趋势数据点 hover */
        .gj-trend-dot { cursor: pointer; transition: r .18s var(--gj-ease); }
        .gj-tip {
          position: absolute; transform: translate(-50%, -130%);
          pointer-events: none; white-space: nowrap; z-index: 5;
        }
        .gj-drill { margin-top: 14px; }

        /* 山势 */
        .gj-mtn { cursor: pointer; transition: filter .2s var(--gj-ease); }
        .gj-mtn:hover { filter: brightness(1.08); }
        @keyframes gj-grow { from { opacity: 0; transform: translateY(10px) scaleY(.7); transform-origin: top; } to { opacity: 1; transform: none; } }
        .gj-grow { animation: gj-grow .4s var(--gj-ease) both; }
        .gj-mtn-detail {
          margin-top: 16px; padding: 16px 18px; border-radius: 12px;
          background: rgba(91,140,90,.1); border: 1px solid rgba(91,140,90,.35);
        }

        /* 班级书函 */
        .gj-cases { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
        .gj-case {
          border-radius: 10px; overflow: hidden;
          background: linear-gradient(135deg, #fdfaf3 0%, #f5e6d3 100%);
          border: 1px solid var(--border-ink); box-shadow: var(--shadow-1);
          transition: transform .3s var(--gj-ease), box-shadow .3s var(--gj-ease), border-color .3s;
        }
        .gj-case:hover { transform: translateY(-3px); box-shadow: var(--shadow-3); border-color: var(--vermilion); }
        .gj-case-spine {
          width: 100%; text-align: left; cursor: pointer; border: none; background: transparent;
          display: flex; align-items: center; gap: 10px; padding: 12px 12px;
          font-family: inherit;
        }
        .gj-case-tag {
          flex-shrink: 0; writing-mode: vertical-rl; text-orientation: upright;
          background: var(--vermilion); color: #fff; font-size: 11px; font-weight: 700;
          padding: 6px 3px; border-radius: 4px; letter-spacing: 1px;
        }
        .gj-case-label { font-size: 15px; font-weight: 700; color: var(--ink-black); flex: 1; }
        .gj-case-pull { font-size: 12px; color: var(--warm-brown); }
        .gj-case-drawer { max-height: 0; overflow: hidden; transition: max-height .38s var(--gj-ease); }
        .gj-case-inner { padding: 4px 14px 14px; border-top: 1px dashed var(--border-ink); }
        .gj-case-inner .gj-cw { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .gj-cw-tag {
          font-size: 12px; padding: 2px 8px; border-radius: 10px;
          background: var(--vermilion-soft); color: var(--vermilion); border: 1px solid rgba(196,58,49,.3);
        }
      `}</style>

      <div className="gj-wrap">
        {/* 页头 */}
        <div className="gj-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SealMark text="览" color="var(--vermilion)" size={46} />
              <div>
                <Title level={2} style={{ color: 'var(--ink-black)', margin: 0, letterSpacing: 2 }}>
                  观园览胜 · 数据如画
                </Title>
                <Text type="secondary">学生古籍阅读学情数据总览</Text>
              </div>
            </div>
          </div>
          <Segmented
            className="gj-seg"
            value={range}
            onChange={(v) => setRange(v as Range)}
            options={[
              { label: '近七日', value: '7d' },
              { label: '近三十日', value: '30d' },
              { label: '本学期', value: 'term' },
            ]}
          />
        </div>

        {/* 加载态 */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <InkLoader size={40} />
          </div>
        ) : (
          <>
            {/* 牌匾指标卡 */}
            <Row gutter={[16, 16]} style={{ marginTop: 22 }}>
              <Col xs={12} sm={6}>
                <Plaque title="学生总数" value={stats.totalStudents} icon={<TeamOutlined />} delay={0} />
              </Col>
              <Col xs={12} sm={6}>
                <Plaque title="活跃学生" value={stats.activeStudents} icon={<RiseOutlined />} delay={80} />
              </Col>
              <Col xs={12} sm={6}>
                <Plaque title="总阅读时长" value={readingHours} unit="时" icon={<ClockCircleOutlined />} delay={160} />
              </Col>
              <Col xs={12} sm={6}>
                <Plaque title="平均正确率" value={stats.avgAccuracy} unit="%" icon={<TrophyOutlined />} delay={240} />
              </Col>
            </Row>

            {/* 学子活跃长卷 */}
            <div className="gj-panel gj-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="gj-section-title">学子活跃长卷</span>
                <Text type="secondary">{stats.activeStudents}/{stats.totalStudents} 人 · {activeRate}%</Text>
              </div>
              <div className="gj-scroll-progress">
                <i style={{ width: `${activeRate}%` }} />
              </div>
            </div>

            {/* 趋势图 */}
            <div className="gj-panel gj-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <FireOutlined style={{ color: 'var(--jade)' }} />
                <span className="gj-section-title">阅览趋势 · 青绿山脉线</span>
              </div>
              <div style={{ position: 'relative' }}>
                <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: '100%', display: 'block' }} role="img" aria-label="阅览趋势图">
                  <defs>
                    <linearGradient id="gjArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(91,140,90,0.4)" />
                      <stop offset="100%" stopColor="rgba(91,140,90,0.02)" />
                    </linearGradient>
                    <linearGradient id="gjLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3f6f4a" />
                      <stop offset="100%" stopColor="#5b8c5a" />
                    </linearGradient>
                  </defs>

                  {/* 横向网格 */}
                  {[0.25, 0.5, 0.75].map((g) => (
                    <line key={g} x1={PADL} x2={VW - PADR} y1={PADT + plotH * g} y2={PADT + plotH * g}
                      stroke="rgba(44,24,16,0.08)" strokeDasharray="3 4" />
                  ))}
                  <line x1={PADL} x2={VW - PADR} y1={baseY} y2={baseY} stroke="rgba(44,24,16,0.25)" />

                  {/* 面积 + 山脉线 */}
                  <path d={areaPath} fill="url(#gjArea)" />
                  <path d={linePath} fill="none" stroke="url(#gjLine)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />

                  {/* 数据点（朱红印章） */}
                  {trend.map((t, i) => (
                    <g key={t.date}>
                      <circle
                        className="gj-trend-dot"
                        cx={px(i)} cy={py(t.readingCount)} r={hover === i ? 8 : 6}
                        fill="var(--vermilion)" stroke="var(--gold)" strokeWidth={2}
                        onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                        onClick={() => setActivePoint(activePoint === i ? null : i)}
                      />
                      <text x={px(i)} y={baseY + 22} textAnchor="middle" fontSize="12" fill="var(--ink-gray)">
                        {t.date}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* 悬停笺纸 tooltip */}
                {tipPct && (
                  <div className="gj-tip gj-note" style={tipPct}>
                    <div style={{ fontSize: 12, color: 'var(--warm-brown)' }}>{trend[hover!].date}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink-black)' }}>
                      {trend[hover!].readingCount} <span style={{ fontSize: 11 }}>阅</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 下钻详情 */}
              {activePoint !== null && (
                <div className="gj-drill gj-note gj-fade-up">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <strong style={{ color: 'var(--ink-black)' }}>{trend[activePoint].date} 阅览详情</strong>
                    <Text type="secondary">
                      共 {trend[activePoint].readingCount} 次 · 较均值
                      {trend[activePoint].readingCount - avgCount >= 0 ? ' 高出 ' : ' 低 '}
                      {Math.abs(trend[activePoint].readingCount - avgCount)} 次
                    </Text>
                  </div>
                  <div className="gj-scroll-progress" style={{ marginTop: 8 }}>
                    <i style={{ width: `${(trend[activePoint].readingCount / maxCount) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* 山势热力图 */}
            <div className="gj-panel gj-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <EnvironmentOutlined style={{ color: 'var(--jade)' }} />
                <span className="gj-section-title">年级掌握 · 山势热力图</span>
                <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12 }}>
                  山高=掌握度 · 山宽=学子数
                </Text>
              </div>
              <svg viewBox={`0 0 ${MW} ${MH}`} style={{ width: '100%', display: 'block' }} role="img" aria-label="年级掌握热力图">
                <line x1={0} x2={MW} y1={MBASE} y2={MBASE} stroke="rgba(44,24,16,0.2)" />
                {grades.map((g) => {
                  const m = mountainPath(g.grade, g.count);
                  return (
                    <g key={g.grade} className="gj-mtn" onClick={() => setActiveGrade(activeGrade === g.grade ? null : g.grade)}>
                      <path d={m.d} fill={m.color} fillOpacity={0.88} stroke="rgba(44,24,16,0.18)" strokeWidth={1} />
                      <circle cx={m.cx} cy={m.peakY} r={3} fill="#fff" fillOpacity={0.8} />
                      <text x={m.cx} y={MBASE + 20} textAnchor="middle" fontSize="11" fill="var(--ink-gray)">
                        {g.grade}年级
                      </text>
                      <text x={m.cx} y={m.peakY - 8} textAnchor="middle" fontSize="10" fill="var(--ink-black)">
                        {Math.round(m.mastery)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {activeGrade !== null && (() => {
                const g = grades.find((x) => x.grade === activeGrade)!;
                const m = mountainPath(g.grade, g.count);
                return (
                  <div className="gj-mtn-detail gj-grow">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <strong style={{ color: 'var(--ink-black)', fontSize: 16 }}>{g.grade}年级 · 学情详览</strong>
                      <SealMark text={Math.round(m.mastery) >= 75 ? '优' : Math.round(m.mastery) >= 60 ? '良' : '勉'} size={40} />
                    </div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 10 }}>
                      <div>
                        <Text type="secondary">学子数</Text>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--jade)' }}>{g.count} 人</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <Text type="secondary">平均掌握度</Text>
                        <Progress percent={Math.round(m.mastery)} strokeColor="var(--jade)" size="small" />
                      </div>
                    </div>
                    <Text type="secondary">薄弱点 TOP3</Text>
                    <div className="gj-cw" style={{ marginTop: 6 }}>
                      {weakPoints(g.grade).map((w) => (
                        <span key={w} className="gj-cw-tag">{w}</span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 班级书函 */}
            <div className="gj-panel gj-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <AppstoreOutlined style={{ color: 'var(--jade)' }} />
                <span className="gj-section-title">班级书函 · 抽函览情</span>
                <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12 }}>点击「抽出」展开</Text>
              </div>
              <div className="gj-cases">
                {grades.map((g) => {
                  const isOpen = open.has(g.grade);
                  const m = gradeMastery(g.grade, g.count);
                  return (
                    <div key={g.grade} className="gj-case">
                      <button type="button" className="gj-case-spine" onClick={() => toggle(g.grade)}>
                        <span className="gj-case-tag">第{g.grade}函</span>
                        <span className="gj-case-label">{g.grade}年级</span>
                        <span className="gj-case-pull">{isOpen ? '收起' : '抽出'}</span>
                      </button>
                      <div className="gj-case-drawer" style={{ maxHeight: isOpen ? 320 : 0 }}>
                        <div className="gj-case-inner gj-grow">
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">学子</Text>
                            <strong style={{ color: 'var(--jade)' }}>{g.count} 人</strong>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">平均掌握度</Text>
                            <Progress percent={Math.round(m)} strokeColor="var(--jade)" size="small" />
                          </div>
                          <Text type="secondary">薄弱点 TOP3</Text>
                          <div className="gj-cw">
                            {weakPoints(g.grade).map((w) => (
                              <span key={w} className="gj-cw-tag">{w}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 热门古籍榜单 */}
            <div className="gj-panel gj-fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <BookOutlined style={{ color: 'var(--gold)' }} />
                <span className="gj-section-title">热门古籍 · 阅览榜</span>
              </div>
              {popular.length === 0 ? (
                <EmptyState text="暂无热门古籍，何不添一卷？" />
              ) : (
                popular.map((t) => {
                  const max = Math.max(...popular.map((p) => p.readCount));
                  return (
                    <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px dashed var(--border-ink)' }}>
                      <SealMark text={`第${t.rank}`} color={t.rank === 1 ? 'var(--gold)' : 'var(--vermilion)'} size={40} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: 'var(--ink-black)' }}>{t.title}</div>
                        <Progress percent={Math.round((t.readCount / max) * 100)} showInfo={false} strokeColor="var(--jade)" size="small" />
                      </div>
                      <strong style={{ color: 'var(--jade)', fontSize: 18 }}>{t.readCount}</strong>
                      <Text type="secondary" style={{ fontSize: 12 }}>阅</Text>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
