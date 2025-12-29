/**
 * SMC 教學 Tooltip 組件
 */
import { useState } from 'react';

const SMC_EXPLANATIONS = {
    swing_high: {
        title: "Swing High (HH/LH)",
        description: "高點：價格在前後幾根K線中最高的位置",
        meaning: "HH (Higher High) = 上升趨勢\nLH (Lower High) = 可能反轉",
        color: "#10b981"
    },
    swing_low: {
        title: "Swing Low (LL/HL)",
        description: "低點：價格在前後幾根K線中最低的位置",
        meaning: "LL (Lower Low) = 下降趨勢\nHL (Higher Low) = 可能反轉",
        color: "#ef4444"
    },
    fvg_bullish: {
        title: "FVG - 看漲缺口",
        description: "Fair Value Gap：價格快速上漲留下的空白區域",
        meaning: "通常會回測填補這個缺口\n可作為支撐區域",
        color: "#eab308"
    },
    fvg_bearish: {
        title: "FVG - 看跌缺口",
        description: "Fair Value Gap：價格快速下跌留下的空白區域",
        meaning: "通常會回測填補這個缺口\n可作為阻力區域",
        color: "#ef4444"
    },
    bos: {
        title: "BOS - 結構突破",
        description: "Break of Structure：價格突破前一個高點/低點",
        meaning: "確認趨勢延續\n可以順勢交易",
        color: "#3b82f6"
    },
    choch: {
        title: "CHoCH - 趨勢改變",
        description: "Change of Character：市場結構改變",
        meaning: "可能趨勢反轉\n需要謹慎觀察",
        color: "#f59e0b"
    },
    entry_zone: {
        title: "進場區 (Entry Zone)",
        description: "建議的買入/賣出價格範圍",
        meaning: "在這個區間內進場\n風險回報比較好",
        color: "#6b7280"
    },
    stop_loss: {
        title: "止損 (Stop Loss)",
        description: "如果價格跌破這裡就停損出場",
        meaning: "保護你的資金\n避免虧損擴大",
        color: "#ef4444"
    },
    take_profit: {
        title: "止盈 (Take Profit)",
        description: "價格到達這裡就獲利了結",
        meaning: "達到目標價格\n鎖定利潤",
        color: "#10b981"
    }
};

export default function SMCTooltip({ type, position, onClose }) {
    if (!type || !position) return null;

    const info = SMC_EXPLANATIONS[type];
    if (!info) return null;

    return (
        <div
            className="smc-tooltip"
            style={{
                position: 'absolute',
                left: position.x + 10,
                top: position.y - 10,
                zIndex: 1000,
            }}
        >
            <div className="tooltip-content">
                <div className="tooltip-header" style={{ borderLeftColor: info.color }}>
                    <h4>{info.title}</h4>
                    <button onClick={onClose}>×</button>
                </div>
                <p className="tooltip-description">{info.description}</p>
                <div className="tooltip-meaning">
                    <strong>💡 交易意義：</strong>
                    <pre>{info.meaning}</pre>
                </div>
            </div>

            <style>{`
        .smc-tooltip {
          pointer-events: none;
        }
        
        .tooltip-content {
          background: rgba(17, 24, 39, 0.95);
          border: 1px solid rgba(75, 85, 99, 0.5);
          border-radius: 8px;
          padding: 12px;
          min-width: 280px;
          max-width: 350px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          pointer-events: auto;
        }
        
        .tooltip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          padding-left: 8px;
          border-left: 3px solid;
        }
        
        .tooltip-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #f3f4f6;
        }
        
        .tooltip-header button {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tooltip-header button:hover {
          color: #f3f4f6;
        }
        
        .tooltip-description {
          font-size: 12px;
          color: #d1d5db;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }
        
        .tooltip-meaning {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
          padding: 8px;
          font-size: 11px;
        }
        
        .tooltip-meaning strong {
          color: #fbbf24;
          display: block;
          margin-bottom: 4px;
        }
        
        .tooltip-meaning pre {
          margin: 0;
          color: #e5e7eb;
          white-space: pre-wrap;
          font-family: inherit;
          line-height: 1.6;
        }
      `}</style>
        </div>
    );
}

export function SMCLegend() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="smc-legend">
            <button
                className="legend-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                📚 SMC 教學
            </button>

            {isOpen && (
                <div className="legend-panel">
                    <div className="legend-header">
                        <h3>Smart Money Concepts 入門</h3>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="legend-section">
                        <h4>🎯 基本概念</h4>
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#10b981' }}></span>
                            <div>
                                <strong>Swing High (HH/LH)</strong>
                                <p>高點標記，綠色圓點。連續 HH = 上升趨勢</p>
                            </div>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#ef4444' }}></span>
                            <div>
                                <strong>Swing Low (LL/HL)</strong>
                                <p>低點標記，紅色圓點。連續 LL = 下降趨勢</p>
                            </div>
                        </div>
                    </div>

                    <div className="legend-section">
                        <h4>📊 進階標註</h4>
                        <div className="legend-item">
                            <span className="legend-box" style={{ background: 'repeating-linear-gradient(45deg, #eab308, #eab308 2px, transparent 2px, transparent 6px)' }}></span>
                            <div>
                                <strong>FVG (Fair Value Gap)</strong>
                                <p>黃色斜線區域，價格可能回測填補</p>
                            </div>
                        </div>
                    </div>

                    <div className="legend-section">
                        <h4>💰 交易設定</h4>
                        <div className="legend-item">
                            <span className="legend-box" style={{ background: 'rgba(107, 114, 128, 0.3)' }}></span>
                            <div>
                                <strong>Entry Zone</strong>
                                <p>灰色區域，建議進場價格範圍</p>
                            </div>
                        </div>
                        <div className="legend-item">
                            <span className="legend-box" style={{ background: 'rgba(239, 68, 68, 0.2)' }}></span>
                            <div>
                                <strong>Stop Loss (SL)</strong>
                                <p>紅色區域，止損價位</p>
                            </div>
                        </div>
                        <div className="legend-item">
                            <span className="legend-box" style={{ background: 'rgba(16, 185, 129, 0.2)' }}></span>
                            <div>
                                <strong>Take Profit (TP)</strong>
                                <p>綠色區域，止盈目標</p>
                            </div>
                        </div>
                    </div>

                    <div className="legend-tip">
                        💡 <strong>提示：</strong>滑鼠移到圖表標註上可查看詳細說明
                    </div>
                </div>
            )}

            <style>{`
        .smc-legend {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 100;
        }

        .legend-toggle {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 24px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
        }

        .legend-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
        }

        .legend-panel {
          position: absolute;
          bottom: 60px;
          right: 0;
          width: 380px;
          max-height: 600px;
          overflow-y: auto;
          background: rgba(17, 24, 39, 0.95);
          border: 1px solid rgba(75, 85, 99, 0.5);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .legend-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(75, 85, 99, 0.3);
        }

        .legend-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .legend-header button {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 28px;
          height: 28px;
        }

        .legend-header button:hover {
          color: #f3f4f6;
        }

        .legend-section {
          margin-bottom: 16px;
        }

        .legend-section h4 {
          margin: 0 0 8px 0;
          font-size: 13px;
          font-weight: 600;
          color: #fbbf24;
        }

        .legend-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 6px;
          background: rgba(31, 41, 55, 0.3);
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
          border: 2px solid white;
        }

        .legend-box {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .legend-item strong {
          display: block;
          font-size: 12px;
          color: #f3f4f6;
          margin-bottom: 2px;
        }

        .legend-item p {
          margin: 0;
          font-size: 11px;
          color: #d1d5db;
          line-height: 1.5;
        }

        .legend-tip {
          background: rgba(251, 191, 36, 0.1);
          border-left: 3px solid #fbbf24;
          padding: 10px;
          border-radius: 4px;
          font-size: 11px;
          color: #fde68a;
          line-height: 1.6;
        }

        .legend-tip strong {
          color: #fbbf24;
        }
      `}</style>
        </div>
    );
}
