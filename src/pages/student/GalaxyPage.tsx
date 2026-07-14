import { useState, useMemo, useRef, useEffect, useCallback, Fragment } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { Segmented } from 'antd';
import {
  GlobalOutlined, CompassOutlined,
  ArrowLeftOutlined, ReadOutlined, BookOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../stores/appStore';
import { mockTexts } from '../../utils/mockData';
import type { AncientText } from '../../types';

// 朝代时间顺序（星图沿"时间线"排布）
const DYNASTY_ORDER: Record<string, number> = {
  '先秦': 0, '春秋': 1, '战国': 2, '秦': 3, '汉': 4, '三国': 5, '晋': 6,
  '南北朝': 7, '隋': 8, '唐': 9, '五代': 10, '宋': 11, '元': 12, '明': 13, '清': 14,
};

const dynastyColors: Record<string, string> = {
  '唐': '#c43a31', '宋': '#5b8c5a', '春秋': '#b8860b',
  '战国': '#8b6914', '先秦': '#9c6b3f', '三国': '#7a4b9c',
  '晋': '#2e5984', '汉': '#c97b2c',
};

// 朝代归并到"章"（长廊分章隔断用）
const ERA_OF: Record<string, string> = {
  '春秋': '先秦', '战国': '先秦',
  '汉': '两汉',
  '三国': '魏晋南北朝', '东晋': '魏晋南北朝', '南朝': '魏晋南北朝',
  '唐': '大唐',
  '宋': '两宋',
  '清': '明清',
};
const ERA_ORDER = ['先秦', '两汉', '魏晋南北朝', '大唐', '两宋', '明清'];
const ERA_META: Record<string, { years: string; note: string }> = {
  '先秦': { years: '前770–前221', note: '百家争鸣' },
  '两汉': { years: '前202–220', note: '大赋恢弘' },
  '魏晋南北朝': { years: '220–589', note: '文采风流' },
  '大唐': { years: '618–907', note: '诗歌盛世' },
  '两宋': { years: '960–1279', note: '词韵婉约' },
  '明清': { years: '1368–1912', note: '小说鼎盛' },
};

type GalaxyDim = 'dynasty' | 'stage' | 'genre';

const dimMeta: Record<GalaxyDim, { label: string; icon: React.ReactNode }> = {
  dynasty: { label: '朝代', icon: <CompassOutlined /> },
  stage: { label: '学段', icon: <ReadOutlined /> },
  genre: { label: '文体', icon: <BookOutlined /> },
};

function stageLabel(s: string): string {
  return s === 'primary' ? '小学古诗词' : s === 'junior' ? '初中文言文' : s === 'senior' ? '高中文言文' : s;
}

// 顶部中央圆环导航
function RingNav({ dim, onChange }: { dim: GalaxyDim; onChange: (d: GalaxyDim) => void }) {
  const items: { key: GalaxyDim; label: string }[] = [
    { key: 'dynasty', label: '朝' },
    { key: 'stage', label: '段' },
    { key: 'genre', label: '体' },
  ];
  const R = 52;
  return (
    <div style={{ position: 'relative', width: 132, height: 132, margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1px solid rgba(158,197,240,0.28)',
        boxShadow: '0 0 30px rgba(158,197,240,0.12) inset',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 60, height: 60, borderRadius: '50%',
        background: 'radial-gradient(circle, #1b2b5c 0%, #0c1430 100%)',
        border: '1px solid rgba(158,197,240,0.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#eaf2ff', boxShadow: '0 0 18px rgba(158,197,240,0.25)',
      }}>
        {dimMeta[dim].icon}
        <span style={{ fontSize: 10, marginTop: 2, letterSpacing: '0.1em' }}>{dimMeta[dim].label}</span>
      </div>
      {items.map((it, i) => {
        const a = ((-90 + i * 120) * Math.PI) / 180;
        const x = 66 + R * Math.cos(a);
        const y = 66 + R * Math.sin(a);
        const active = it.key === dim;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            title={dimMeta[it.key].label}
            style={{
              position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)',
              width: active ? 34 : 28, height: active ? 34 : 28, borderRadius: '50%',
              background: active
                ? 'radial-gradient(circle, #cfe3ff 0%, #3a6ea5 100%)'
                : 'rgba(158,197,240,0.12)',
              border: active ? '2px solid #eaf2ff' : '1px solid rgba(158,197,240,0.3)',
              color: active ? '#fff' : '#9ec5f0', cursor: 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: active ? '0 0 16px rgba(158,197,240,0.8)' : 'none', transition: 'all 0.2s',
            }}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export default function GalaxyPage() {
  const navigate = useNavigate();
  const startWarp = useAppStore((s) => s.startWarp);

  const [view, setView] = useState<'galaxy' | 'chronicle'>('galaxy');
  const [dim, setDim] = useState<GalaxyDim>('dynasty');
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  // 动态统计分组
  const groups = useMemo(() => {
    const map = new Map<string, AncientText[]>();
    mockTexts.forEach((t) => {
      let key = '';
      if (dim === 'dynasty') key = t.dynasty;
      else if (dim === 'stage') key = t.schoolStage[0] || 'primary';
      else key = t.tags.includes('文言文') ? '文言文' : '古诗词';
      const arr = map.get(key) || [];
      arr.push(t);
      map.set(key, arr);
    });
    return Array.from(map.entries())
      .map(([name, texts]) => ({
        name,
        texts,
        count: texts.length,
        order: dim === 'dynasty' ? DYNASTY_ORDER[name] ?? 99 : 0,
      }))
      .sort((a, b) => a.order - b.order || b.count - a.count);
  }, [dim]);

  const N = Math.max(groups.length, 1);
  const planets = useMemo(
    () =>
      groups.map((g, i) => {
        const lon = (i / N) * Math.PI * 2;
        const lat = ((i % 2 === 0 ? 1 : -1) * 0.34) + (i % 3 === 0 ? 0.12 : 0);
        return { ...g, lon, lat };
      }),
    [groups, N]
  );

  // 空闲自转
  useEffect(() => {
    let raf = 0;
    let lastT = performance.now();
    const tick = (t: number) => {
      const dt = t - lastT;
      lastT = t;
      if (!dragging.current) setRotation((r) => r + dt * 0.00018);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    setRotation((r) => r + dx * 0.006);
    setTilt((v) => Math.max(-0.55, Math.min(0.55, v + dy * 0.004)));
  };
  const onUp = () => { dragging.current = false; };

  const enterGroup = useCallback(
    (name: string, color: string) => {
      if (moved.current) return;
      startWarp({ name, color });
      setTimeout(() => {
        if (dim === 'dynasty') navigate(`/student/explore?dynasty=${encodeURIComponent(name)}`);
        else if (dim === 'stage') {
          const stage = name.includes('小学') ? 3 : name.includes('初中') ? 8 : 9;
          navigate(`/student/explore?stage=${stage}`);
        } else navigate(`/student/explore?genre=${name === '文言文' ? 'wenyan' : 'poem'}`);
      }, 1150);
    },
    [dim, navigate, startWarp]
  );

  const openText = useCallback(
    (t: AncientText) => {
      startWarp({ name: t.title, color: '#9ec5f0' });
      setTimeout(() => navigate(`/student/reading/${t.id}`), 1150);
    },
    [navigate, startWarp]
  );

  const projected = planets.map((p) => {
    const effLon = p.lon + rotation;
    const cl = Math.cos(p.lat);
    const sl = Math.sin(p.lat);
    const x = 50 + 38 * cl * Math.cos(effLon);
    const y = 50 - 38 * sl + tilt * 26;
    const z = cl * Math.sin(effLon);
    return { ...p, x, y, z };
  });

  const colorOf = (name: string) =>
    dim === 'dynasty'
      ? dynastyColors[name] || '#9c8b6b'
      : name.includes('初中') || name.includes('高中')
        ? '#2e5984'
        : name.includes('小学')
          ? '#c43a31'
          : name === '文言文'
            ? '#5b8c5a'
            : '#b8860b';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#05070f' }}>
      {/* 顶部导航条（两种视图共用） */}
      <div style={{
        background: '#2c1810', borderBottom: '1px solid #5c4a3a',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => { startWarp({ name: '探索页', color: '#9ec5f0' }); setTimeout(() => navigate('/student/explore'), 1150); }}
            style={{
              background: 'rgba(245,230,211,0.1)', border: '1px solid rgba(245,230,211,0.25)',
              color: '#f5e6d3', borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <ArrowLeftOutlined /> 返回探索
          </button>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#f5e6d3', letterSpacing: '0.04em' }}>
            🌌 文化星图
          </span>
        </div>
        <Segmented
          value={view}
          onChange={(v) => setView(v as 'galaxy' | 'chronicle')}
          options={[
            { label: '🌌 星图探索', value: 'galaxy' },
            { label: '📜 时间线长廊', value: 'chronicle' },
          ]}
        />
      </div>

      {view === 'galaxy' ? (
        /* ===== 星图视图 ===== */
        <div style={{
          position: 'relative', flex: 1, overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 42%, #1a2b5c 0%, #0c1430 48%, #05070f 100%)',
          color: '#f5e6d3', userSelect: 'none',
        }}>
          <StarField />
          {/* 中心放射线层 */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 780, height: 780, marginLeft: -390, marginTop: -390,
            background: 'repeating-conic-gradient(from 0deg, rgba(158,197,240,0.16) 0deg 0.6deg, transparent 0.6deg 5deg)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 22%, #000 55%, transparent 78%)',
            maskImage: 'radial-gradient(circle, transparent 22%, #000 55%, transparent 78%)',
            animation: 'galaxyRays 120s linear infinite', pointerEvents: 'none', zIndex: 1,
          }} />

          {/* 顶部中央圆环导航 */}
          <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
            <RingNav dim={dim} onChange={setDim} />
          </div>

          {/* 星图主区 */}
          <div
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
            style={{ position: 'absolute', inset: 0, cursor: dragging.current ? 'grabbing' : 'grab', touchAction: 'none', zIndex: 10 }}
          >
            <div
              onClick={() => { if (moved.current) return; startWarp({ name: '全部古籍', color: '#cfe3ff' }); setTimeout(() => navigate('/student/explore'), 1150); }}
              style={{
                position: 'absolute', left: '50%', top: '50%', width: 92, height: 92, marginLeft: -46, marginTop: -46,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffe9a8 0%, #f0b429 45%, #b8860b 100%)',
                boxShadow: '0 0 50px rgba(240,180,41,0.6), inset 0 0 22px rgba(255,255,255,0.45)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 20, transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <GlobalOutlined style={{ fontSize: 26, color: '#fff' }} />
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 700, marginTop: 2 }}>全部</div>
            </div>

            {projected.map((p) => {
              const size = 40 + Math.sqrt(p.count) * 7;
              const scale = 0.55 + ((p.z + 1) / 2) * 0.75;
              const opacity = 0.35 + ((p.z + 1) / 2) * 0.65;
              const color = colorOf(p.name);
              const isBack = p.z < -0.15;
              return (
                <div
                  key={p.name}
                  onClick={() => enterGroup(p.name, color)}
                  title={`${stageLabel(p.name)} · ${p.count} 篇`}
                  style={{
                    position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                    transform: `translate(-50%, -50%) scale(${scale})`, transformStyle: 'preserve-3d',
                    width: size, height: size, borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 30%, #ffffffaa 0%, ${color} 55%, ${color}88 100%)`,
                    boxShadow: `0 0 ${16 + p.count * 1.6}px ${color}aa, 0 0 46px rgba(234,242,255,0.14), inset -6px -6px 12px rgba(0,0,0,0.3)`,
                    cursor: 'pointer', zIndex: Math.round((p.z + 1) * 10),
                    opacity: isBack ? opacity * 0.45 : opacity,
                    border: '1px solid rgba(255,255,255,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: dragging.current ? 'none' : 'opacity 0.3s',
                  }}
                >
                  <div style={{
                    position: 'absolute', inset: -9, borderRadius: '50%',
                    border: '1.5px solid rgba(234,242,255,0.32)', transform: 'rotateX(74deg)',
                    pointerEvents: 'none', boxShadow: '0 0 10px rgba(234,242,255,0.12)',
                  }} />
                  <span style={{
                    fontSize: 11, color: '#fff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    pointerEvents: 'none', whiteSpace: 'nowrap',
                  }}>
                    {dim === 'stage' ? stageLabel(p.name).replace('古诗词', '').replace('文言文', '文言') : p.name}
                  </span>
                  <span style={{
                    position: 'absolute', bottom: -8, right: -6, background: '#fdfaf3', color: '#2c1810',
                    fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '0 6px',
                    border: '1px solid #d4c5b2', pointerEvents: 'none', opacity: isBack ? 0 : 1,
                  }}>
                    {p.count}
                  </span>
                </div>
              );
            })}

            <div style={{
              position: 'absolute', left: '50%', top: '50%', width: '76%', height: '76%',
              marginLeft: '-38%', marginTop: '-38%', borderRadius: '50%',
              border: '1px dashed rgba(158,197,240,0.14)', transform: `rotateX(60deg) rotate(${rotation}rad)`,
              pointerEvents: 'none',
            }} />
          </div>

          {/* 图例 */}
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 30,
            color: '#a89880', fontSize: 12, textAlign: 'center', background: 'rgba(10,14,39,0.5)',
            padding: '8px 18px', borderRadius: 20, border: '1px solid rgba(158,197,240,0.12)', whiteSpace: 'nowrap',
          }}>
            共 {groups.length} 个星区 · {mockTexts.length} 篇古籍 &nbsp;|&nbsp; 🖱 拖动旋转星图，✨ 点击星球穿越
          </div>
        </div>
      ) : (
        /* ===== 时间线长廊视图 ===== */
        <TimelineGallery onOpen={openText} />
      )}

      <style>{`
        @keyframes galaxyRays {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ===== 时间线长廊（参考「千载一瞬 · THE CHRONICLE」）=====

// 国风书影封面：CADAL 提供真实书影则用图，否则本地渲染 国风 书影
function GujiCover({ text, color }: { text: AncientText; color: string }) {
  const isReal = !!text.cadalImageUrl && !text.cadalImageUrl.includes('placehold.co');
  if (isReal) {
    return (
      <img
        src={text.cadalImageUrl}
        alt={`${text.title} 古籍书影`}
        style={{ width: '100%', height: 152, objectFit: 'cover', borderTopLeftRadius: 14, borderTopRightRadius: 14, display: 'block' }}
      />
    );
  }
  return (
    <div style={{
      position: 'relative', height: 152, overflow: 'hidden',
      borderTopLeftRadius: 14, borderTopRightRadius: 14,
      background: `linear-gradient(155deg, ${color}2e 0%, #f7efe0 72%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* 双线书衣边框 */}
      <div style={{ position: 'absolute', inset: 10, border: `1px solid ${color}66`, borderRadius: 6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 14, border: `1px solid ${color}33`, borderRadius: 4, pointerEvents: 'none' }} />
      {/* 水墨远山 */}
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 64, opacity: 0.55 }}>
        <path d="M0,80 L0,52 Q34,26 66,50 T128,44 T200,56 L200,80 Z" fill={color} opacity={0.22} />
        <path d="M0,80 L0,60 Q44,46 86,58 T168,54 T200,62 L200,80 Z" fill={color} opacity={0.4} />
      </svg>
      {/* 竖排书名 */}
      <div style={{
        writingMode: 'vertical-rl', textOrientation: 'upright',
        fontFamily: '"Noto Serif SC", serif', fontWeight: 800, fontSize: 25,
        color: '#2c1810', letterSpacing: '0.12em', zIndex: 1, textShadow: '0 1px 0 #fff', maxHeight: 116,
      }}>
        {text.title}
      </div>
      {/* 朝代印章 */}
      <div style={{
        position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 4,
        background: color, color: '#fff', fontSize: 11, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,0.2)', writingMode: 'vertical-rl',
      }}>
        {text.dynasty}
      </div>
    </div>
  );
}

// 朝代分章立牌（横向长廊中的章节隔断）
function EraDivider({ era, years, note, count }: { era: string; years: string; note: string; count: number }) {
  return (
    <div style={{
      flex: '0 0 92px', alignSelf: 'stretch', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, margin: '0 6px',
    }}>
      <div style={{ position: 'absolute', top: 28, bottom: 28, width: 1, background: 'linear-gradient(180deg, transparent, #b8860b66, transparent)' }} />
      <div style={{
        writingMode: 'vertical-rl', fontSize: 32, fontWeight: 800, color: '#8b4513',
        fontFamily: '"Noto Serif SC", serif', letterSpacing: '0.12em', textShadow: '0 1px 0 #fff',
        zIndex: 1, background: 'linear-gradient(180deg,#f7efe0,#efe2c8)', padding: '6px 0',
      }}>
        {era}
      </div>
      <div style={{ writingMode: 'vertical-rl', fontSize: 11, color: '#b8860b', marginTop: 10, letterSpacing: '0.05em' }}>{note}</div>
      <div style={{ fontSize: 11, color: '#a89880', marginTop: 6 }}>{count} 篇</div>
      <div style={{ fontSize: 10, color: '#c9b48f', marginTop: 2, letterSpacing: '0.05em' }}>{years}</div>
    </div>
  );
}

function TimelineGallery({ onOpen }: { onOpen: (t: AncientText) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, left: 0, down: false });

  const ordered = useMemo(
    () => [...mockTexts].sort((a, b) => (DYNASTY_ORDER[a.dynasty] ?? 99) - (DYNASTY_ORDER[b.dynasty] ?? 99)),
    []
  );

  // 按朝代归并成"章"
  const eras = useMemo(() => {
    const map = new Map<string, AncientText[]>();
    ordered.forEach((t) => {
      const era = ERA_OF[t.dynasty] || '其他';
      const arr = map.get(era) || [];
      arr.push(t);
      map.set(era, arr);
    });
    return ERA_ORDER.filter((e) => map.has(e)).map((e) => ({ era: e, meta: ERA_META[e], texts: map.get(e)! }));
  }, [ordered]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, left: trackRef.current?.scrollLeft || 0, down: true };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down || !trackRef.current) return;
    trackRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => { drag.current.down = false; };
  const onWheel = (e: React.WheelEvent) => {
    if (trackRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      trackRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(180deg, #f7efe0 0%, #efe2c8 100%)', color: '#2c1810' }}>
      {/* 标题区 */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', color: '#b8860b', fontWeight: 600 }}>THE CHRONICLE</div>
        <h2 style={{ fontSize: 30, color: '#2c1810', margin: '6px 0', fontWeight: 800, fontFamily: '"Noto Serif SC", serif' }}>
          古籍长廊
        </h2>
        <p style={{ color: '#8b7355', fontSize: 14, margin: 0 }}>
          沿时间线分章漫遊，邂逅每一篇传世名作 · 共 {ordered.length} 篇 / {eras.length} 章
        </p>
      </div>

      {/* 横向滚动轨道（章节立牌 + 书影卡片） */}
      <div
        ref={trackRef}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
        onWheel={onWheel}
        style={{
          display: 'flex', gap: 18, overflowX: 'auto', padding: '28px 24px 48px',
          cursor: 'grab', scrollSnapType: 'x proximity', position: 'relative', alignItems: 'stretch',
        }}
        className="chronicle-track"
      >
        {/* 时间轴横线（环境底纹） */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', height: 2,
          background: 'linear-gradient(90deg, transparent, #b8860b 8%, #b8860b 92%, transparent)',
          opacity: 0.16, zIndex: 0, pointerEvents: 'none',
        }} />
        {(() => {
          let gi = 0;
          return eras.map((sec) => (
          <Fragment key={sec.era}>
            <EraDivider era={sec.era} years={sec.meta.years} note={sec.meta.note} count={sec.texts.length} />
            {sec.texts.map((t) => {
              const color = dynastyColors[t.dynasty] || '#9c8b6b';
              const idx = (gi += 1);
              return (
                <div
                  key={t.id}
                  onClick={() => onOpen(t)}
                  style={{
                    flex: '0 0 210px', scrollSnapAlign: 'start', position: 'relative', zIndex: 1,
                    background: '#fffef9', border: '1px solid #e0d2b8', borderRadius: 14, overflow: 'hidden',
                    cursor: 'pointer', boxShadow: '0 4px 16px rgba(44,24,16,0.06)', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(44,24,16,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,24,16,0.06)'; }}
                >
                  {/* 顶部朝代色条 */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, zIndex: 2 }} />
                  <GujiCover text={t} color={color} />
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 12, color: '#b8860b' }}>{t.dynasty} · {t.author}</span>
                      <span style={{ fontSize: 11, color: '#c9b48f' }}>No.{String(idx).padStart(2, '0')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 12px', minHeight: 22 }}>
                      {t.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ fontSize: 11, color: '#8b7355', background: '#f0e6d3', borderRadius: 6, padding: '2px 8px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#8b7355' }}>适配 {t.gradeLevel.join('/')} 年级</span>
                      <span style={{ fontSize: 12, color: '#c43a31', fontWeight: 600 }}>阅读 →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Fragment>
          ));
        })()}
      </div>

      {/* 底部引导 */}
      <div style={{ textAlign: 'center', padding: '0 24px 32px', color: '#a89880', fontSize: 12 }}>
        🖱 横向拖动 / 滚动浏览整条时间线 · 点击书影穿越到对应古籍
      </div>
    </div>
  );
}

// 背景星点（柔和低噪点）
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 1.6 + 0.4,
        delay: Math.random() * 3,
        dur: Math.random() * 3 + 2.5,
      })),
    []
  );
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute', left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size, borderRadius: '50%',
            background: '#dbe7ff', opacity: 0.5,
            animation: `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
