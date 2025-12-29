import { useState, useEffect } from 'react';
import CandlestickChart from './components/CandlestickChart';
import ExecutionPlan from './components/ExecutionPlan';
import { SMCLegend } from './components/SMCTooltip';
import './App.css';

function App() {
    const [stockList, setStockList] = useState([]);
    const [stocksData, setStocksData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 載入股票列表和數據
    useEffect(() => {
        async function loadAllStocks() {
            try {
                setLoading(true);
                setError(null);

                // 1. 載入索引
                const indexResponse = await fetch('/index.json');
                if (!indexResponse.ok) throw new Error('無法載入股票列表');

                const indexData = await indexResponse.json();
                const successStocks = indexData.stocks.filter(s => s.status === 'success');
                setStockList(successStocks);

                // 2. 批量載入所有股票數據
                const dataPromises = successStocks.map(async (stock) => {
                    try {
                        const response = await fetch(`/${stock.code}.json`);
                        if (response.ok) {
                            const data = await response.json();
                            return { code: stock.code, data };
                        }
                    } catch (err) {
                        console.error(`載入 ${stock.code} 失敗:`, err);
                    }
                    return null;
                });

                const results = await Promise.all(dataPromises);
                const dataMap = {};
                results.forEach(result => {
                    if (result) {
                        dataMap[result.code] = result.data;
                    }
                });

                setStocksData(dataMap);
                setLoading(false);
            } catch (err) {
                console.error('載入失敗:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        loadAllStocks();
    }, []);

    return (
        <div className="app">
            {/* 頂部標題 */}
            <header className="header">
                <div className="header-left">
                    <h1 className="logo">SMC Stock Analysis</h1>
                    <span className="subtitle">當日跌幅排行</span>
                </div>
                <div className="header-right">
                    <span className="system-status">
                        <span className="status-dot"></span>
                        {loading ? '載入中...' : `${stockList.length} 支股票`}
                    </span>
                </div>
            </header>

            {/* 主內容區 */}
            <main className="main-grid">
                {loading && (
                    <div className="loading-full">
                        <div className="spinner"></div>
                        <span>載入股票數據中...</span>
                    </div>
                )}

                {error && (
                    <div className="error-full">
                        <span>❌ 錯誤: {error}</span>
                        <button onClick={() => window.location.reload()}>重試</button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="stocks-grid">
                        {stockList.map((stock) => {
                            const smcData = stocksData[stock.code];
                            if (!smcData) return null;

                            const executionPlan = {
                                direction: smcData.setup.direction,
                                entry: smcData.setup.entry_zone,
                                sl: smcData.setup.sl,
                                tp: smcData.setup.tp,
                                riskReward: smcData.setup.rr
                            };

                            const latestPrice = smcData.candles[smcData.candles.length - 1]?.close || 0;
                            const prevClose = smcData.candles[smcData.candles.length - 2]?.close || latestPrice;
                            const priceChange = ((latestPrice - prevClose) / prevClose * 100).toFixed(2);

                            return (
                                <div key={stock.code} className="stock-card">
                                    {/* 股票標題 */}
                                    <div className="stock-header">
                                        <div className="stock-info">
                                            <span className="stock-id">{stock.code}</span>
                                            <span className="stock-name">{stock.name}</span>
                                        </div>
                                        <div className="stock-price">
                                            <span className="current-price">${latestPrice.toFixed(2)}</span>
                                            <span className={`price-change ${parseFloat(priceChange) >= 0 ? 'positive' : 'negative'}`}>
                                                {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* 執行計劃 */}
                                    <ExecutionPlan
                                        stockId={stock.code}
                                        direction={executionPlan.direction}
                                        entryZone={executionPlan.entry}
                                        stopLoss={executionPlan.sl}
                                        takeProfit={executionPlan.tp}
                                        riskReward={executionPlan.riskReward}
                                    />

                                    {/* 圖表 */}
                                    <div className="chart-container-mini">
                                        <CandlestickChart
                                            data={smcData.candles}
                                            width={600}
                                            height={300}
                                            executionPlan={executionPlan}
                                            smcData={smcData}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* SMC 教學面板 */}
            <SMCLegend />
        </div>
    );
}

export default App;
