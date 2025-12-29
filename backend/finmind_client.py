"""
FinMind API 客戶端
用於獲取台股歷史價格數據
"""
import requests
import pandas as pd
from datetime import datetime, timedelta


API_URL = "https://api.finmindtrade.com/api/v4/data"


def fetch_stock_price(stock_id: str, days: int = 120) -> pd.DataFrame:
    """
    從 FinMind API 獲取股票日K線數據
    
    Args:
        stock_id: 股票代碼 (例如 "1513")
        days: 獲取最近幾天的數據
        
    Returns:
        DataFrame with columns: date, open, high, low, close, volume
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    params = {
        "dataset": "TaiwanStockPrice",
        "data_id": stock_id,
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d")
    }
    
    print(f"正在獲取 {stock_id} 的股價數據...")
    response = requests.get(API_URL, params=params)
    
    if response.status_code != 200:
        raise Exception(f"API 請求失敗: {response.status_code}")
    
    result = response.json()
    
    if result.get("status") != 200 or not result.get("data"):
        raise Exception(result.get("msg", "API 返回錯誤"))
    
    # 轉換為 DataFrame
    df = pd.DataFrame(result["data"])
    
    # 重命名欄位以符合 smartmoneyconcepts 的格式要求
    df = df.rename(columns={
        "date": "date",
        "open": "open",
        "max": "high",
        "min": "low",
        "close": "close",
        "Trading_Volume": "volume"
    })
    
    # 確保欄位為數值類型
    for col in ["open", "high", "low", "close", "volume"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    
    # 設定 date 為索引
    df["date"] = pd.to_datetime(df["date"])
    df = df.set_index("date")
    
    # 只保留需要的欄位
    df = df[["open", "high", "low", "close", "volume"]]
    
    print(f"成功獲取 {len(df)} 筆數據")
    return df


if __name__ == "__main__":
    # 測試
    df = fetch_stock_price("1513", days=90)
    print(df.head())
    print(df.tail())
