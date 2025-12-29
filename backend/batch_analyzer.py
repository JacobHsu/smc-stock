"""
批量 SMC 分析器
從 API 獲取股票列表，批量生成 SMC 分析
"""
import json
import requests
import os
from smc_analyzer import analyze_stock

def fetch_stock_list(api_url):
    """從 API 獲取股票列表"""
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        return data.get('stocks', [])
    except Exception as e:
        print(f"❌ 獲取股票列表失敗: {e}")
        return []

def batch_analyze(api_url, days=120):
    """批量分析股票"""
    print("=" * 60)
    print("批量 SMC 分析器")
    print("=" * 60)
    
    # 1. 獲取股票列表
    print(f"\n📡 從 API 獲取股票列表...")
    print(f"API: {api_url}")
    stocks = fetch_stock_list(api_url)
    
    if not stocks:
        print("❌ 沒有獲取到股票數據")
        return
    
    print(f"✅ 獲取到 {len(stocks)} 支股票\n")
    
    # 2. 顯示股票列表
    print("股票列表:")
    for stock in stocks:
        print(f"  {stock['code']} {stock['name']} - {stock['change_percent']:+.2f}% (${stock['price']})")
    
    # 3. 批量分析
    print(f"\n開始批量分析 (數據範圍: 最近 {days} 天)...")
    print("=" * 60)
    
    results = []
    for i, stock in enumerate(stocks, 1):
        stock_id = stock['code']
        stock_name = stock['name']
        
        print(f"\n[{i}/{len(stocks)}] 分析 {stock_id} {stock_name}...")
        
        try:
            result = analyze_stock(stock_id, days)
            results.append({
                'code': stock_id,
                'name': stock_name,
                'status': 'success',
                'file': f'output/{stock_id}.json'
            })
        except Exception as e:
            print(f"❌ 分析失敗: {e}")
            results.append({
                'code': stock_id,
                'name': stock_name,
                'status': 'failed',
                'error': str(e)
            })
    
    # 4. 生成索引文件
    print("\n" + "=" * 60)
    print("生成索引文件...")
    
    index = {
        'source': api_url,
        'total': len(stocks),
        'success': len([r for r in results if r['status'] == 'success']),
        'failed': len([r for r in results if r['status'] == 'failed']),
        'stocks': results
    }
    
    index_path = 'output/index.json'
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 索引文件已儲存: {index_path}")
    
    # 5. 總結
    print("\n" + "=" * 60)
    print("批量分析完成")
    print("=" * 60)
    print(f"總計: {index['total']} 支")
    print(f"成功: {index['success']} 支")
    print(f"失敗: {index['failed']} 支")
    
    if index['failed'] > 0:
        print("\n失敗的股票:")
        for r in results:
            if r['status'] == 'failed':
                print(f"  {r['code']} {r['name']}: {r.get('error', 'Unknown error')}")
    
    return results


if __name__ == '__main__':
    # API URL
    API_URL = "https://stock-replay-production.up.railway.app/api/stocks/day-trading/losers"
    
    # 執行批量分析
    batch_analyze(API_URL, days=120)
