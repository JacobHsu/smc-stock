// FinMind API 整合
// 文件：https://finmind.github.io/

const API_URL = 'https://api.finmindtrade.com/api/v4/data';

/**
 * 獲取台股日K線數據
 * @param {string} stockId - 股票代碼 (例如 "1513")
 * @param {string} startDate - 開始日期 (YYYY-MM-DD)
 * @param {string} endDate - 結束日期 (YYYY-MM-DD)
 * @returns {Promise<Array>} OHLCV 數據陣列
 */
export async function fetchStockPrice(stockId, startDate, endDate) {
  const params = new URLSearchParams({
    dataset: 'TaiwanStockPrice',
    data_id: stockId,
    start_date: startDate,
    end_date: endDate
  });

  try {
    const response = await fetch(`${API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.status !== 200 || !result.data) {
      throw new Error(result.msg || 'API 返回錯誤');
    }
    
    // 轉換為統一的 OHLCV 格式
    return result.data.map(item => ({
      date: item.date,
      open: parseFloat(item.open),
      high: parseFloat(item.max),
      low: parseFloat(item.min),
      close: parseFloat(item.close),
      volume: parseInt(item.Trading_Volume, 10)
    }));
    
  } catch (error) {
    console.error('獲取股價數據失敗:', error);
    throw error;
  }
}

/**
 * 獲取股票基本資訊
 * @param {string} stockId - 股票代碼
 * @returns {Promise<Object>} 股票資訊
 */
export async function fetchStockInfo(stockId) {
  const params = new URLSearchParams({
    dataset: 'TaiwanStockInfo'
  });

  try {
    const response = await fetch(`${API_URL}?${params}`);
    const result = await response.json();
    
    if (result.data) {
      return result.data.find(item => item.stock_id === stockId);
    }
    return null;
  } catch (error) {
    console.error('獲取股票資訊失敗:', error);
    return null;
  }
}

/**
 * 獲取最近 N 個交易日的日期範圍
 * @param {number} days - 天數
 * @returns {Object} { startDate, endDate }
 */
export function getDateRange(days = 90) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
}
