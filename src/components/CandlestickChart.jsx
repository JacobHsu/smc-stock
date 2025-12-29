import { useMemo } from 'react';

/**
 * SVG K線圖表組件 - 純 React + SVG 實作
 * 模仿 DailyDip 的自研繪圖方式
 */
export default function CandlestickChart({
    data,
    width = 800,
    height = 400,
    executionPlan = null, // { entry: [low, high], tp: price, sl: price }
    smcData = null // SMC 分析數據 (swing_points, fvg, bos_choch)
}) {
    // 圖表邊距
    const margin = { top: 20, right: 60, bottom: 30, left: 10 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 計算價格和日期的範圍
    const { priceRange, dateRange, yScale, xScale, candleWidth } = useMemo(() => {
        if (!data || data.length === 0) {
            return { priceRange: [0, 100], dateRange: [], yScale: () => 0, xScale: () => 0, candleWidth: 8 };
        }

        // 找出價格範圍 (加上 5% 的 padding)
        const prices = data.flatMap(d => [d.high, d.low]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const pricePadding = (maxPrice - minPrice) * 0.05;
        const priceRange = [minPrice - pricePadding, maxPrice + pricePadding];

        // 日期範圍
        const dateRange = data.map(d => d.date);

        // Y 軸比例函數 (價格 -> Y座標)
        const yScale = (price) => {
            const ratio = (price - priceRange[0]) / (priceRange[1] - priceRange[0]);
            return chartHeight - (ratio * chartHeight);
        };

        // X 軸比例函數 (索引 -> X座標)
        const candleWidth = Math.max(4, Math.min(12, (chartWidth / data.length) * 0.7));
        const candleGap = chartWidth / data.length;
        const xScale = (index) => index * candleGap + candleGap / 2;

        return { priceRange, dateRange, yScale, xScale, candleWidth };
    }, [data, chartWidth, chartHeight]);

    // 生成價格軸刻度
    const priceLabels = useMemo(() => {
        const [min, max] = priceRange;
        const step = (max - min) / 5;
        const labels = [];
        for (let i = 0; i <= 5; i++) {
            const price = min + step * i;
            labels.push({
                price: price.toFixed(2),
                y: yScale(price)
            });
        }
        return labels;
    }, [priceRange, yScale]);

    // 生成日期軸刻度 (每 10 根 K 線顯示一個)
    const dateLabels = useMemo(() => {
        if (!data || data.length === 0) return [];
        const step = Math.max(1, Math.floor(data.length / 6));
        return data
            .filter((_, i) => i % step === 0)
            .map((d, i) => ({
                date: d.date.slice(5), // MM-DD
                x: xScale(data.indexOf(d))
            }));
    }, [data, xScale]);

    if (!data || data.length === 0) {
        return (
            <div style={{
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                borderRadius: '8px'
            }}>
                載入數據中...
            </div>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            className="candlestick-chart"
            style={{ background: 'var(--bg-card)', borderRadius: '8px' }}
        >
            {/* Pattern 定義 - FVG 斜線填充 */}
            <defs>
                <pattern id="hatch-fvg" patternUnits="userSpaceOnUse" width="8" height="8">
                    <line x1="0" y1="8" x2="8" y2="0" stroke="var(--fvg-color)" strokeWidth="1.5" />
                </pattern>
                <pattern id="hatch-fvg-bearish" patternUnits="userSpaceOnUse" width="8" height="8">
                    <line x1="0" y1="8" x2="8" y2="0" stroke="#ef4444" strokeWidth="1.5" />
                </pattern>
            </defs>

            <g transform={`translate(${margin.left}, ${margin.top})`}>

                {/* 橫向網格線 */}
                {priceLabels.map((label, i) => (
                    <line
                        key={`grid-${i}`}
                        x1={0}
                        y1={label.y}
                        x2={chartWidth}
                        y2={label.y}
                        stroke="var(--border-color)"
                        strokeWidth="0.5"
                        strokeDasharray="4,4"
                        opacity="0.3"
                    />
                ))}

                {/* TP 區域 (綠色) */}
                {executionPlan?.tp && (
                    <>
                        <rect
                            x={0}
                            y={yScale(executionPlan.tp + 2)}
                            width={chartWidth}
                            height={Math.abs(yScale(executionPlan.tp + 2) - yScale(executionPlan.tp - 2))}
                            fill="var(--tp-color)"
                        />
                        <line
                            x1={0}
                            y1={yScale(executionPlan.tp)}
                            x2={chartWidth}
                            y2={yScale(executionPlan.tp)}
                            stroke="var(--bull)"
                            strokeWidth="1"
                            strokeDasharray="8,4"
                        />
                        <line
                            x1={0}
                            y1={yScale(executionPlan.tp)}
                            x2={chartWidth}
                            y2={yScale(executionPlan.tp)}
                            stroke="var(--bull)"
                            strokeWidth="1.5"
                            strokeDasharray="8,4"
                        />
                        <text
                            x={chartWidth - 5}
                            y={yScale(executionPlan.tp) - 5}
                            fill="var(--bull)"
                            fontSize="10"
                            textAnchor="end"
                        >
                            TP {executionPlan.tp}
                        </text>
                    </>
                )}

                {/* SL 區域 (紅色) */}
                {executionPlan?.sl && (
                    <>
                        <rect
                            x={0}
                            y={Math.max(0, yScale(executionPlan.sl + 1))}
                            width={chartWidth}
                            height={Math.min(chartHeight - Math.max(0, yScale(executionPlan.sl + 1)), Math.abs(yScale(executionPlan.sl + 1) - yScale(executionPlan.sl - 3)))}
                            fill="var(--sl-color)"
                        />
                        <line
                            x1={0}
                            y1={yScale(executionPlan.sl)}
                            x2={chartWidth}
                            y2={yScale(executionPlan.sl)}
                            stroke="var(--bear)"
                            strokeWidth="1.5"
                            strokeDasharray="8,4"
                        />
                        <text
                            x={chartWidth - 5}
                            y={yScale(executionPlan.sl) + 12}
                            fill="var(--bear)"
                            fontSize="10"
                            textAnchor="end"
                        >
                            SL {executionPlan.sl}
                        </text>
                    </>
                )}

                {/* Entry Zone (灰色) */}
                {executionPlan?.entry && (
                    <>
                        <rect
                            x={0}
                            y={yScale(executionPlan.entry[1])}
                            width={chartWidth}
                            height={Math.abs(yScale(executionPlan.entry[1]) - yScale(executionPlan.entry[0]))}
                            fill="var(--entry-color)"
                        />
                        <text
                            x={chartWidth - 5}
                            y={yScale((executionPlan.entry[0] + executionPlan.entry[1]) / 2) + 4}
                            fill="var(--text-secondary)"
                            fontSize="10"
                            textAnchor="end"
                        >
                            ENTRY {executionPlan.entry[0]} - {executionPlan.entry[1]}
                        </text>
                    </>
                )}

                {/* K線繪製 */}
                {data.map((candle, index) => {
                    const x = xScale(index);
                    const isBullish = candle.close >= candle.open;
                    const color = isBullish ? 'var(--bull)' : 'var(--bear)';

                    const bodyTop = yScale(Math.max(candle.open, candle.close));
                    const bodyBottom = yScale(Math.min(candle.open, candle.close));
                    const bodyHeight = Math.max(1, bodyBottom - bodyTop);

                    const wickTop = yScale(candle.high);
                    const wickBottom = yScale(candle.low);

                    return (
                        <g key={`candle-${index}`}>
                            {/* 影線 (Wick) */}
                            <line
                                x1={x}
                                y1={wickTop}
                                x2={x}
                                y2={wickBottom}
                                stroke={color}
                                strokeWidth="1"
                            />
                            {/* 實體 (Body) */}
                            <rect
                                x={x - candleWidth / 2}
                                y={bodyTop}
                                width={candleWidth}
                                height={bodyHeight}
                                fill={color}
                                rx="1"
                            />
                        </g>
                    );
                })

                }

                {/* SMC 標註 - Swing Point 連線 */}
                {smcData?.swing_points && (() => {
                    const highs = smcData.swing_points.filter(p => p.type === 'swing_high');
                    const lows = smcData.swing_points.filter(p => p.type === 'swing_low');

                    return (
                        <>
                            {/* 連接 Swing Highs */}
                            {highs.map((point, idx) => {
                                if (idx === 0) return null;
                                const prev = highs[idx - 1];
                                return (
                                    <line
                                        key={`high-line-${idx}`}
                                        x1={xScale(prev.index)}
                                        y1={yScale(prev.level)}
                                        x2={xScale(point.index)}
                                        y2={yScale(point.level)}
                                        stroke="var(--bull)"
                                        strokeWidth="1.5"
                                        strokeDasharray="4,2"
                                        opacity="0.6"
                                    />
                                );
                            })}

                            {/* 連接 Swing Lows */}
                            {lows.map((point, idx) => {
                                if (idx === 0) return null;
                                const prev = lows[idx - 1];
                                return (
                                    <line
                                        key={`low-line-${idx}`}
                                        x1={xScale(prev.index)}
                                        y1={yScale(prev.level)}
                                        x2={xScale(point.index)}
                                        y2={yScale(point.level)}
                                        stroke="var(--bear)"
                                        strokeWidth="1.5"
                                        strokeDasharray="4,2"
                                        opacity="0.6"
                                    />
                                );
                            })}
                        </>
                    );
                })()}

                {/* SMC 標註 - Swing Points */}
                {smcData?.swing_points?.map((point, idx) => {
                    const x = xScale(point.index);
                    const y = yScale(point.level);
                    const isHigh = point.type === 'swing_high';

                    return (
                        <g key={`swing-${idx}`}>
                            {/* 圓點標記 */}
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill={isHigh ? 'var(--bull)' : 'var(--bear)'}
                                stroke="white"
                                strokeWidth="1"
                            />
                            {/* 文字標籤 */}
                            <text
                                x={x}
                                y={isHigh ? y - 10 : y + 15}
                                fill={isHigh ? 'var(--bull)' : 'var(--bear)'}
                                fontSize="9"
                                fontWeight="600"
                                textAnchor="middle"
                            >
                                {isHigh ? 'HH' : 'LL'}
                            </text>
                        </g>
                    );
                })}

                {/* SMC 標註 - FVG (Fair Value Gap) */}
                {smcData?.fvg?.map((gap, idx) => {
                    const startX = xScale(gap.start_index);
                    const endX = xScale(gap.index);
                    const topY = yScale(gap.top);
                    const bottomY = yScale(gap.bottom);
                    const isBullish = gap.type === 'bullish';

                    return (
                        <g key={`fvg-${idx}`}>
                            {/* FVG 區域 - 使用斜線填充 */}
                            <rect
                                x={startX}
                                y={topY}
                                width={endX - startX}
                                height={bottomY - topY}
                                fill={isBullish ? 'url(#hatch-fvg)' : 'url(#hatch-fvg-bearish)'}
                                opacity="0.3"
                            />
                            {/* FVG 邊框 */}
                            <rect
                                x={startX}
                                y={topY}
                                width={endX - startX}
                                height={bottomY - topY}
                                fill="none"
                                stroke={isBullish ? 'var(--fvg-color)' : '#ef4444'}
                                strokeWidth="1"
                                strokeDasharray="4,2"
                                opacity="0.5"
                            />
                        </g>
                    );
                })}

                {/* SMC 標註 - BOS/CHoCH */}
                {smcData?.bos_choch?.map((signal, idx) => {
                    const x = xScale(signal.index);
                    const y = yScale(signal.level);
                    const isBullish = signal.direction === 'bullish';
                    const isBOS = signal.type === 'BOS';

                    return (
                        <g key={`structure-${idx}`}>
                            {/* 結構突破線 */}
                            <line
                                x1={0}
                                y1={y}
                                x2={chartWidth}
                                y2={y}
                                stroke={isBullish ? 'var(--bull)' : 'var(--bear)'}
                                strokeWidth="1.5"
                                strokeDasharray="6,3"
                                opacity="0.6"
                            />
                            {/* 標籤 */}
                            <text
                                x={x + 10}
                                y={y - 5}
                                fill={isBullish ? 'var(--bull)' : 'var(--bear)'}
                                fontSize="10"
                                fontWeight="600"
                            >
                                {isBOS ? 'BOS' : 'CHoCH'}
                            </text>
                        </g>
                    );
                })}

                {/* Y軸價格標籤 */}
                {priceLabels.map((label, i) => (
                    <text
                        key={`price-${i}`}
                        x={chartWidth + 5}
                        y={label.y + 4}
                        fill="var(--text-secondary)"
                        fontSize="10"
                        textAnchor="start"
                    >
                        {label.price}
                    </text>
                ))}

                {/* X軸日期標籤 */}
                {dateLabels.map((label, i) => (
                    <text
                        key={`date-${i}`}
                        x={label.x}
                        y={chartHeight + 15}
                        fill="var(--text-secondary)"
                        fontSize="9"
                        textAnchor="middle"
                    >
                        {label.date}
                    </text>
                ))}

            </g>
        </svg>
    );
}
