/**
 * 圖表頂部執行計劃顯示組件
 * 模仿 DailyDip 的 EXECUTION PLAN 區塊
 */
export default function ExecutionPlan({
  stockId = '1513',
  direction = 'LONG',
  entryZone = [144.5, 147.0],
  stopLoss = 142.5,
  takeProfit = 168.5,
  riskReward = 5.4
}) {
  const directionColor = direction === 'LONG' ? 'var(--bull)' : 'var(--bear)';

  return (
    <div className="execution-plan">
      <div className="plan-grid">
        <div className="plan-item">
          <span className="plan-label">DIRECTION</span>
          <span className="plan-value" style={{ color: directionColor }}>
            {direction}
          </span>
        </div>

        <div className="plan-item">
          <span className="plan-label">ENTRY ZONE</span>
          <span className="plan-value">
            {entryZone[0]} - {entryZone[1]}
          </span>
        </div>

        <div className="plan-item">
          <span className="plan-label">STOP LOSS</span>
          <span className="plan-value" style={{ color: 'var(--bear)' }}>
            {stopLoss}
          </span>
        </div>

        <div className="plan-item">
          <span className="plan-label">TAKE PROFIT</span>
          <span className="plan-value" style={{ color: 'var(--bull)' }}>
            {takeProfit}
          </span>
        </div>

        <div className="plan-item">
          <span className="plan-label">RISK:REWARD</span>
          <span className="plan-value" style={{ color: 'var(--accent-blue)' }}>
            {riskReward}R
          </span>
        </div>
      </div>

      <style>{`
        .execution-plan {
          background: var(--bg-secondary);
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 12px;
        }
        
        .plan-grid {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        
        .plan-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .plan-label {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.3px;
        }
        
        .plan-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
