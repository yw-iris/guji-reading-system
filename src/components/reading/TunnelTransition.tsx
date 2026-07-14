import { useEffect } from 'react';
import { useAppStore } from '../../stores/appStore';

// 全局隧道转场（蓝白同心圆 + 放射光线）
// 由 appStore.warp 控制显隐，跨页面路由切换时不被卸载，转场更连贯
export default function TunnelTransition() {
  const warp = useAppStore((s) => s.warp);
  const endWarp = useAppStore((s) => s.endWarp);

  // 动画结束后自动清除遮罩，避免全屏层永久遮挡目标页
  useEffect(() => {
    if (!warp) return;
    const t = setTimeout(() => endWarp(), 1150);
    return () => clearTimeout(t);
  }, [warp, endWarp]);

  if (!warp) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(circle, #0a1430 0%, #04060f 60%, #000 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* 蓝白同心圆环 */}
      {Array.from({ length: 15 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 44, height: 44, marginLeft: -22, marginTop: -22,
            borderRadius: '50%',
            border: '3px solid #9ec5f0',
            boxShadow: '0 0 24px rgba(158,197,240,0.8)',
            animation: `tunnelZoom 1.15s cubic-bezier(0.22,0.61,0.36,1) ${i * 0.035}s forwards`,
          }}
        />
      ))}
      {/* 放射光线 */}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={`r${i}`}
          style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 2, height: '55vh',
            background: 'linear-gradient(rgba(207,227,255,0.95), transparent)',
            transformOrigin: 'top center',
            transform: `translate(-50%, 0) rotate(${i * (360 / 28)}deg)`,
            animation: `rayZoom 1.15s cubic-bezier(0.22,0.61,0.36,1) ${i * 0.018}s forwards`,
            opacity: 0,
          }}
        />
      ))}
      {/* 中心文字 */}
      <div style={{
        position: 'relative', zIndex: 5, textAlign: 'center',
        animation: 'warpText 1.15s ease-out forwards',
      }}>
        <div style={{ color: '#eaf2ff', fontSize: 24, fontWeight: 800, letterSpacing: '0.04em' }}>
          穿越到「{warp.name}」
        </div>
        <div style={{ color: '#9ec5f0', fontSize: 14, marginTop: 8 }}>
          正在展开古籍星图…
        </div>
      </div>

      <style>{`
        @keyframes tunnelZoom {
          0% { transform: translate(-50%,-50%) scale(0.08); opacity: 0; }
          18% { opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(28); opacity: 0; }
        }
        @keyframes rayZoom {
          0% { opacity: 0; transform: translate(-50%, 0) scaleY(0.12); }
          30% { opacity: 0.65; }
          100% { opacity: 0; transform: translate(-50%, 0) scaleY(2.8); }
        }
        @keyframes warpText {
          0% { opacity: 0; transform: scale(0.6); }
          22% { opacity: 1; transform: scale(1); }
          78% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.35); }
        }
      `}</style>
    </div>
  );
}
