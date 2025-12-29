/**
 * 股票選擇器組件
 */
import { useState, useEffect } from 'react';

export default function StockSelector({ currentStock, onStockChange }) {
    const [stocks, setStocks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // 載入股票列表
    useEffect(() => {
        async function loadStockList() {
            try {
                const response = await fetch('/index.json');
                if (response.ok) {
                    const data = await response.json();
                    setStocks(data.stocks || []);
                }
            } catch (error) {
                console.error('載入股票列表失敗:', error);
            }
        }
        loadStockList();
    }, []);

    const handleSelect = (stockCode) => {
        onStockChange(stockCode);
        setIsOpen(false);
    };

    const currentStockInfo = stocks.find(s => s.code === currentStock);

    return (
        <div className="stock-selector">
            <button
                className="selector-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="selector-current">
                    <span className="stock-code">{currentStock}</span>
                    {currentStockInfo && (
                        <span className="stock-name">{currentStockInfo.name}</span>
                    )}
                </div>
                <span className="selector-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="selector-dropdown">
                    <div className="dropdown-header">
                        <h4>選擇股票</h4>
                        <span className="stock-count">{stocks.length} 支</span>
                    </div>
                    <div className="dropdown-list">
                        {stocks.map((stock) => (
                            <button
                                key={stock.code}
                                className={`stock-item ${stock.code === currentStock ? 'active' : ''}`}
                                onClick={() => handleSelect(stock.code)}
                            >
                                <div className="stock-info">
                                    <span className="code">{stock.code}</span>
                                    <span className="name">{stock.name}</span>
                                </div>
                                {stock.status === 'success' && (
                                    <span className="status-badge success">✓</span>
                                )}
                                {stock.status === 'failed' && (
                                    <span className="status-badge failed">✗</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
        .stock-selector {
          position: relative;
          z-index: 50;
        }

        .selector-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: rgba(31, 41, 55, 0.8);
          border: 1px solid rgba(75, 85, 99, 0.5);
          border-radius: 8px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 200px;
        }

        .selector-button:hover {
          background: rgba(31, 41, 55, 1);
          border-color: rgba(99, 102, 241, 0.5);
        }

        .selector-current {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stock-code {
          font-size: 16px;
          font-weight: 700;
          color: #f3f4f6;
        }

        .stock-name {
          font-size: 13px;
          color: #9ca3af;
        }

        .selector-arrow {
          font-size: 10px;
          color: #6b7280;
        }

        .selector-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 300px;
          max-height: 400px;
          background: rgba(17, 24, 39, 0.95);
          border: 1px solid rgba(75, 85, 99, 0.5);
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(75, 85, 99, 0.3);
        }

        .dropdown-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .stock-count {
          font-size: 12px;
          color: #6b7280;
          background: rgba(75, 85, 99, 0.3);
          padding: 2px 8px;
          border-radius: 12px;
        }

        .dropdown-list {
          max-height: 340px;
          overflow-y: auto;
        }

        .stock-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 1px solid rgba(75, 85, 99, 0.2);
          cursor: pointer;
          transition: background 0.2s ease;
          text-align: left;
        }

        .stock-item:hover {
          background: rgba(99, 102, 241, 0.1);
        }

        .stock-item.active {
          background: rgba(99, 102, 241, 0.2);
        }

        .stock-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stock-info .code {
          font-size: 14px;
          font-weight: 700;
          color: #f3f4f6;
          min-width: 60px;
        }

        .stock-info .name {
          font-size: 13px;
          color: #d1d5db;
        }

        .status-badge {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .status-badge.success {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .status-badge.failed {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* 滾動條樣式 */
        .dropdown-list::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-list::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }

        .dropdown-list::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 3px;
        }

        .dropdown-list::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
        </div>
    );
}
