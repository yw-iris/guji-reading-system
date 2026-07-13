// ===== PDF 异步导出工具 =====
// 使用 window.open + document.write 创建打印友好的国风样式窗口，触发浏览器打印

interface ExportOptions {
  tier?: string;
}

/**
 * 异步导出古籍内容为 PDF（通过浏览器打印）
 * 返回一个可取消的 Promise
 */
export function exportToPDF(
  title: string,
  content: string,
  options?: ExportOptions
): { promise: Promise<void>; cancel: () => void } {
  let cancelled = false;
  let printWindow: Window | null = null;

  const promise = new Promise<void>((resolve, reject) => {
    // 使用 requestAnimationFrame 做异步处理，避免 UI 卡顿
    requestAnimationFrame(() => {
      if (cancelled) {
        reject(new Error('导出已取消'));
        return;
      }

      setTimeout(() => {
        if (cancelled) {
          reject(new Error('导出已取消'));
          return;
        }

        try {
          const tier = options?.tier || '简化适配版';
          const paragraphs = content.split('\n').filter((p) => p.trim());

          printWindow = window.open('', '_blank', 'width=800,height=600');
          if (!printWindow) {
            reject(new Error('弹窗被浏览器拦截，请允许弹出窗口后重试'));
            return;
          }

          const html = buildPrintHtml(title, tier, paragraphs);
          printWindow.document.write(html);
          printWindow.document.close();

          // 等待资源加载完成后触发打印
          printWindow.onload = () => {
            if (cancelled) {
              printWindow?.close();
              reject(new Error('导出已取消'));
              return;
            }

            setTimeout(() => {
              if (cancelled) {
                printWindow?.close();
                reject(new Error('导出已取消'));
                return;
              }

              printWindow?.print();

              // 监听打印完成或窗口关闭
              const checkClosed = setInterval(() => {
                if (printWindow?.closed) {
                  clearInterval(checkClosed);
                  resolve();
                }
              }, 500);

              // 兜底：20 秒后自动 resolve
              setTimeout(() => {
                clearInterval(checkClosed);
                if (!printWindow?.closed) {
                  printWindow?.close();
                }
                resolve();
              }, 20000);
            }, 500);
          };
        } catch (err) {
          reject(err);
        }
      }, 0);
    });
  });

  const cancel = () => {
    cancelled = true;
    if (printWindow && !printWindow.closed) {
      printWindow.close();
    }
  };

  return { promise, cancel };
}

/**
 * 构建打印友好的 HTML 页面（国风样式）
 */
function buildPrintHtml(title: string, tier: string, paragraphs: string[]): string {
  const contentHtml = paragraphs
    .map((p) => `<p class="verse">${escapeHtml(p)}</p>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)} - PDF导出</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Noto Serif SC", "STSong", "SimSun", "KaiTi", serif;
      background: #fdfaf3;
      color: #2c1810;
      line-height: 2.2;
      letter-spacing: 0.04em;
      padding: 60px 80px;
    }

    @media print {
      body {
        background: #fff;
        padding: 40px 60px;
      }
      @page {
        size: A4;
        margin: 2cm;
      }
      .no-print {
        display: none !important;
      }
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e8d5b8;
    }

    .header .icon {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .header .title {
      font-size: 28px;
      font-weight: 700;
      color: #2c1810;
      margin-bottom: 8px;
    }

    .header .meta {
      font-size: 14px;
      color: #8b6914;
    }

    .header .meta .tier-tag {
      display: inline-block;
      background: #faf5eb;
      border: 1px solid #c4a96a;
      border-radius: 4px;
      padding: 2px 10px;
      margin-left: 8px;
      font-size: 12px;
    }

    .content {
      max-width: 640px;
      margin: 0 auto;
    }

    .verse {
      font-size: 18px;
      padding: 12px 0;
      text-indent: 2em;
      border-bottom: 1px dotted #f0e6d3;
    }

    .verse:last-child {
      border-bottom: none;
    }

    .footer {
      text-align: center;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 2px solid #e8d5b8;
      font-size: 12px;
      color: #999;
    }

    .no-print {
      text-align: center;
      padding: 12px;
      margin-bottom: 16px;
      background: #faf5eb;
      border: 1px solid #e8d5b8;
      border-radius: 8px;
      font-size: 13px;
      color: #8b6914;
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 24px;">
    请使用浏览器打印功能（Ctrl+P / Cmd+P），选择「另存为 PDF」保存
  </div>

  <div class="header">
    <div class="icon">📜</div>
    <div class="title">${escapeHtml(title)}</div>
    <div class="meta">
      版本：${escapeHtml(tier)}
      <span class="tier-tag">古籍阅读系统</span>
    </div>
  </div>

  <div class="content">
    ${contentHtml}
  </div>

  <div class="footer">
    由「古籍阅读系统」生成 · ${new Date().toLocaleDateString('zh-CN')}
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (ch) => map[ch] || ch);
}
