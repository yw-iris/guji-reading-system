// 跨页通用组件：统一设计语言下的「返」印章、水墨加载、成功印章、淡墨空状态
import type { CSSProperties, ReactNode } from 'react';

/** 篆书「返」印章 —— 替代标准返回箭头，呼应古书批注 */
export function ReturnSeal({
  onClick, title = '返回', style, size = 40,
}: { onClick?: () => void; title?: string; style?: CSSProperties; size?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, borderRadius: 8, cursor: 'pointer',
        background: 'transparent', border: '2px solid var(--vermilion)', color: 'var(--vermilion)',
        fontFamily: '"Noto Serif SC", serif', fontWeight: 700, fontSize: size * 0.45,
        transform: 'rotate(-5deg)', transition: 'all .25s var(--gj-ease)',
        flexShrink: 0, ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(-5deg) scale(1.08)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(-5deg) scale(1)'; }}
    >
      返
    </button>
  );
}

/** 水墨晕染加载 */
export function InkLoader({ size = 16 }: { size?: number }) {
  return (
    <span className="gj-loader" role="status" aria-label="加载中"
      style={{ transform: `scale(${size / 16})` }}>
      <span /><span /><span />
    </span>
  );
}

/** 成功反馈：朱红印章盖下动画（父组件控制显隐，约 1.5s 后移除） */
export function SuccessSeal({ message }: { message: string }) {
  return (
    <div
      className="gj-success-seal"
      style={{
        position: 'fixed', top: 24, right: 24, zIndex: 2000,
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'rgba(253,250,243,0.96)', border: '1px solid var(--vermilion)',
        borderRadius: 10, padding: '10px 16px', boxShadow: 'var(--shadow-2)',
        animation: 'gj-note-in .35s var(--gj-ease) both',
      }}
    >
      <span
        className="gj-stamp"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, border: '2px solid var(--vermilion)', borderRadius: 6,
          color: 'var(--vermilion)', fontWeight: 700, fontSize: 14,
        }}
      >
        印
      </span>
      <span style={{ fontWeight: 600, color: 'var(--ink-black)' }}>{message}</span>
    </div>
  );
}

/** 淡墨山水空状态 + 书法体提示 */
export function EmptyState({
  text = '暂无内容，何不添一卷？', art, children,
}: { text?: string; art?: ReactNode; children?: ReactNode }) {
  return (
    <div className="gj-empty">
      {art ?? (
        <svg className="gj-empty-art" viewBox="0 0 160 96" fill="none" aria-hidden>
          <path d="M8 72 Q40 42 72 60 T154 56" stroke="#5c4a3a" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M0 82 Q52 56 92 74 T160 70" stroke="#8b7355" strokeWidth="1.5" fill="none" opacity="0.5" />
          <circle cx="122" cy="30" r="10" fill="#c43a31" opacity="0.22" />
        </svg>
      )}
      <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 15, letterSpacing: 2, color: 'var(--ink-gray)' }}>
        {text}
      </div>
      {children}
    </div>
  );
}

/** 装饰印章（用于卡片角标，如「已读」「热门」） */
export function SealMark({
  text, color = 'var(--vermilion)', bg = 'transparent', size = 44,
}: { text: string; color?: string; bg?: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, border: `2px solid ${color}`, borderRadius: 6,
        color, background: bg, fontFamily: '"Noto Serif SC", serif', fontWeight: 700,
        fontSize: size * 0.34, lineHeight: 1.1, textAlign: 'center',
        transform: 'rotate(-5deg)', flexShrink: 0,
      }}
    >
      {text}
    </span>
  );
}
