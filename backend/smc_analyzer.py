"""
簡化版 SMC 分析器
不依賴 smartmoneyconcepts 庫，直接實作核心演算法
"""
import json
import os
from datetime import datetime
import pandas as pd
from finmind_client import fetch_stock_price


def find_swing_points(df, lookback=5):
    """
    偵測 Swing Highs 和 Swing Lows
    
    Swing High: 當前高點是前後 lookback 根 K 線中最高的
    Swing Low: 當前低點是前後 lookback 根 K 線中最低的
    """
    swing_points = []
    
    for i in range(lookback, len(df) - lookback):
        # 檢查是否為 Swing High
        is_swing_high = all(
            df.iloc[i]['high'] >= df.iloc[j]['high'] 
            for j in range(i - lookback, i + lookback + 1) 
            if j != i
        )
        
        # 檢查是否為 Swing Low
        is_swing_low = all(
            df.iloc[i]['low'] <= df.iloc[j]['low'] 
            for j in range(i - lookback, i + lookback + 1) 
            if j != i
        )
        
        if is_swing_high:
            swing_points.append({
                'index': i,
                'date': str(df.index[i].date()),
                'type': 'swing_high',
                'level': float(df.iloc[i]['high'])
            })
        
        if is_swing_low:
            swing_points.append({
                'index': i,
                'date': str(df.index[i].date()),
                'type': 'swing_low',
                'level': float(df.iloc[i]['low'])
            })
    
    return swing_points


def find_fvg(df):
    """
    偵測 Fair Value Gap (公允價值缺口)
    
    看漲 FVG: 第一根 K 線的高點 < 第三根 K 線的低點
    看跌 FVG: 第一根 K 線的低點 > 第三根 K 線的高點
    """
    fvg_list = []
    
    for i in range(2, len(df)):
        candle_1 = df.iloc[i-2]
        candle_2 = df.iloc[i-1]
        candle_3 = df.iloc[i]
        
        # 看漲 FVG
        if candle_1['high'] < candle_3['low']:
            fvg_list.append({
                'index': i,
                'date': str(df.index[i].date()),
                'type': 'bullish',
                'top': float(candle_3['low']),
                'bottom': float(candle_1['high']),
                'start_index': i - 2
            })
        
        # 看跌 FVG
        if candle_1['low'] > candle_3['high']:
            fvg_list.append({
                'index': i,
                'date': str(df.index[i].date()),
                'type': 'bearish',
                'top': float(candle_1['low']),
                'bottom': float(candle_3['high']),
                'start_index': i - 2
            })
    
    return fvg_list


def find_bos_choch(df, swing_points):
    """
    偵測 BOS (Break of Structure) 和 CHoCH (Change of Character)
    
    簡化邏輯：
    - BOS: 價格突破前一個 Swing High/Low，趨勢延續
    - CHoCH: 價格突破關鍵結構，趨勢反轉
    """
    signals = []
    
    swing_highs = [p for p in swing_points if p['type'] == 'swing_high']
    swing_lows = [p for p in swing_points if p['type'] == 'swing_low']
    
    # 簡化：只標記最近的幾個突破
    if len(swing_highs) >= 2:
        last_high = swing_highs[-1]
        prev_high = swing_highs[-2]
        
        # 找到突破點
        for i in range(last_high['index'], len(df)):
            if df.iloc[i]['close'] > last_high['level']:
                signals.append({
                    'index': i,
                    'date': str(df.index[i].date()),
                    'type': 'BOS',
                    'direction': 'bullish',
                    'level': last_high['level']
                })
                break
    
    if len(swing_lows) >= 2:
        last_low = swing_lows[-1]
        prev_low = swing_lows[-2]
        
        for i in range(last_low['index'], len(df)):
            if df.iloc[i]['close'] < last_low['level']:
                signals.append({
                    'index': i,
                    'date': str(df.index[i].date()),
                    'type': 'BOS',
                    'direction': 'bearish',
                    'level': last_low['level']
                })
                break
    
    return signals


def calculate_setup(df, swing_points, fvg_list):
    """
    根據 SMC 分析計算交易設定
    """
    latest_close = float(df.iloc[-1]['close'])
    
    swing_highs = [p for p in swing_points if p['type'] == 'swing_high']
    swing_lows = [p for p in swing_points if p['type'] == 'swing_low']
    
    # 判斷趨勢方向
    if len(swing_highs) >= 2 and len(swing_lows) >= 2:
        recent_high = swing_highs[-1]['level']
        prev_high = swing_highs[-2]['level']
        recent_low = swing_lows[-1]['level']
        prev_low = swing_lows[-2]['level']
        
        # 上升趨勢：Higher Highs and Higher Lows
        if recent_high > prev_high and recent_low > prev_low:
            direction = "LONG"
        # 下降趨勢：Lower Highs and Lower Lows
        elif recent_high < prev_high and recent_low < prev_low:
            direction = "SHORT"
        else:
            direction = "WAIT"
    else:
        direction = "WAIT"
    
    # 計算 Entry/SL/TP
    if direction == "LONG":
        # Entry Zone: 最近的 Swing Low 附近
        if swing_lows:
            entry_base = swing_lows[-1]['level']
            entry = [entry_base * 0.995, entry_base * 1.005]
        else:
            entry = [latest_close * 0.97, latest_close * 0.99]
        
        # Stop Loss: 更低的 Swing Low
        sl = min([p['level'] for p in swing_lows[-3:]]) if len(swing_lows) >= 3 else latest_close * 0.95
        
        # Take Profit: 最近的 Swing High
        tp = max([p['level'] for p in swing_highs[-2:]]) if len(swing_highs) >= 2 else latest_close * 1.10
        
    elif direction == "SHORT":
        # Entry Zone: 最近的 Swing High 附近
        if swing_highs:
            entry_base = swing_highs[-1]['level']
            entry = [entry_base * 0.995, entry_base * 1.005]
        else:
            entry = [latest_close * 1.01, latest_close * 1.03]
        
        # Stop Loss: 更高的 Swing High
        sl = max([p['level'] for p in swing_highs[-3:]]) if len(swing_highs) >= 3 else latest_close * 1.05
        
        # Take Profit: 最近的 Swing Low
        tp = min([p['level'] for p in swing_lows[-2:]]) if len(swing_lows) >= 2 else latest_close * 0.90
        
    else:
        entry = [latest_close * 0.98, latest_close * 1.02]
        sl = latest_close * 0.95
        tp = latest_close * 1.10
    
    # 計算風險回報比
    entry_mid = (entry[0] + entry[1]) / 2
    risk = abs(entry_mid - sl)
    reward = abs(tp - entry_mid)
    rr = round(reward / risk, 1) if risk > 0 else 0
    
    return {
        'direction': direction,
        'entry_zone': [round(entry[0], 2), round(entry[1], 2)],
        'sl': round(sl, 2),
        'tp': round(tp, 2),
        'rr': rr,
        'latest_close': round(latest_close, 2)
    }


def analyze_stock(stock_id, days=120):
    """主分析函數"""
    print(f"\n{'='*50}")
    print(f"開始分析 {stock_id}")
    print(f"{'='*50}")
    
    # 1. 獲取數據
    df = fetch_stock_price(stock_id, days)
    
    # 2. 計算指標
    print("計算 Swing Points...")
    swing_points = find_swing_points(df, lookback=5)
    
    print("計算 FVG...")
    fvg_list = find_fvg(df)
    
    print("計算 BOS/CHoCH...")
    bos_choch = find_bos_choch(df, swing_points)
    
    print("計算交易設定...")
    setup = calculate_setup(df, swing_points, fvg_list)
    
    # 3. 準備輸出
    result = {
        'symbol': stock_id,
        'generated_at': datetime.now().isoformat(),
        'data_range': {
            'start': str(df.index[0].date()),
            'end': str(df.index[-1].date()),
            'count': len(df)
        },
        'candles': [
            {
                'date': str(date.date()),
                'open': float(row['open']),
                'high': float(row['high']),
                'low': float(row['low']),
                'close': float(row['close']),
                'volume': int(row['volume']) if pd.notna(row['volume']) else 0
            }
            for date, row in df.iterrows()
        ],
        'swing_points': swing_points,
        'fvg': fvg_list,
        'bos_choch': bos_choch,
        'setup': setup
    }
    
    # 4. 輸出摘要
    print(f"\n{'='*50}")
    print(f"分析完成 - {stock_id}")
    print(f"{'='*50}")
    print(f"數據範圍: {result['data_range']['start']} ~ {result['data_range']['end']}")
    print(f"K 線數量: {result['data_range']['count']}")
    print(f"Swing Points: {len(swing_points)}")
    print(f"FVG: {len(fvg_list)}")
    print(f"BOS/CHoCH: {len(bos_choch)}")
    print(f"\n交易設定:")
    print(f"  Direction: {setup['direction']}")
    print(f"  Entry Zone: {setup['entry_zone']}")
    print(f"  Stop Loss: {setup['sl']}")
    print(f"  Take Profit: {setup['tp']}")
    print(f"  Risk:Reward: {setup['rr']}R")
    print(f"  最新收盤: {setup['latest_close']}")
    
    # 5. 儲存結果
    os.makedirs('output', exist_ok=True)
    output_path = f'output/{stock_id}.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n結果已儲存至: {output_path}")
    
    return result


if __name__ == '__main__':
    analyze_stock('1513', days=120)
