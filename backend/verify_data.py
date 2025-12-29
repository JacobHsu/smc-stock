import json

# 讀取數據
with open('output/1513.json', encoding='utf-8') as f:
    data = json.load(f)

candles = data['candles']

# 驗證 Index 46 (2025-11-10) 是否為 Swing Low
print("=" * 60)
print("驗證 Swing Low: Index 46 (2025-11-10)")
print("=" * 60)
print("\n前後 5 根 K 線的 Low 值:")
for i in range(41, 52):
    marker = " ← Swing Low!" if i == 46 else ""
    print(f"  Index {i}: {candles[i]['date']} Low={candles[i]['low']}{marker}")

target_low = candles[46]['low']
is_swing_low = all(candles[46]['low'] <= candles[i]['low'] for i in range(41, 52) if i != 46)

print(f"\n結論: {target_low} 是否為最低點? {is_swing_low}")
print("✅ 數據正確!" if is_swing_low else "❌ 數據錯誤!")

# 驗證一個 FVG
print("\n" + "=" * 60)
print("驗證 FVG: Index 19 (2025-09-26) Bearish FVG")
print("=" * 60)
c1 = candles[17]
c2 = candles[18]
c3 = candles[19]

print(f"\nK線 1 (Index 17): {c1['date']} High={c1['high']}, Low={c1['low']}")
print(f"K線 2 (Index 18): {c2['date']} High={c2['high']}, Low={c2['low']}")
print(f"K線 3 (Index 19): {c3['date']} High={c3['high']}, Low={c3['low']}")

is_bearish_fvg = c1['low'] > c3['high']
print(f"\nBearish FVG 條件: K1.Low ({c1['low']}) > K3.High ({c3['high']})")
print(f"結果: {is_bearish_fvg}")
print("✅ FVG 數據正確!" if is_bearish_fvg else "❌ FVG 數據錯誤!")
