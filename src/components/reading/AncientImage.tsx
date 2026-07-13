import { useState, useEffect } from 'react';
import { Card, Progress, Typography } from 'antd';

const { Paragraph } = Typography;

export function AncientImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setProgress(0);

    const img = new Image();

    // 模拟加载进度（因为原生 Image 无法获取真实加载进度）
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    img.onload = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    };

    img.onerror = () => {
      clearInterval(interval);
      setError(true);
      setLoading(false);
    };

    img.src = src;

    return () => clearInterval(interval);
  }, [src]);

  if (error) {
    return (
      <Card style={{ marginBottom: 20, borderRadius: 12, textAlign: 'center', borderColor: '#e8d5b8' }}>
        <div style={{
          padding: '40px 20px',
          background: '#f5e6d3',
          borderRadius: 8,
          color: '#8b4513',
          fontSize: 14,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📜</div>
          <div>古籍原图加载失败</div>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>请检查网络后重试</div>
        </div>
        <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 11 }}>
          {caption}
        </Paragraph>
      </Card>
    );
  }

  return (
    <Card style={{ marginBottom: 20, borderRadius: 12, textAlign: 'center', borderColor: '#e8d5b8' }}>
      {loading ? (
        <div style={{ padding: '40px 20px' }}>
          <div style={{ marginBottom: 16, color: '#8b6914', fontSize: 14 }}>📜 古籍原图加载中...</div>
          <Progress
            percent={progress}
            strokeColor={{
              '0%': '#c43a31',
              '50%': '#8b6914',
              '100%': '#c43a31',
            }}
            trailColor="#f0e6d3"
            strokeWidth={6}
            style={{ maxWidth: 300, margin: '0 auto' }}
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'contain',
            borderRadius: 8,
          }}
        />
      )}
      <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 11 }}>
        {caption}
      </Paragraph>
    </Card>
  );
}
