# SMC Stock Analysis 📈

一個基於 Smart Money Concepts (SMC) 的股票技術分析工具,自動分析當日跌幅排行股票並提供交易建議。

![SMC Analysis](https://img.shields.io/badge/Analysis-SMC-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Python](https://img.shields.io/badge/Python-3.x-3776ab)

## 📋 目錄

- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [系統需求](#系統需求)
- [安裝指南](#安裝指南)
- [使用說明](#使用說明)
- [專案結構](#專案結構)
- [SMC 概念說明](#smc-概念說明)

## ✨ 功能特色

### 📊 智能分析
- **自動化 SMC 分析**: 自動識別市場結構、擺動高低點、公平價值缺口 (FVG)
- **趨勢線視覺化**: 連接擺動點形成趨勢線,清晰展示市場結構
- **交易計劃生成**: 自動計算進場區、停損點、獲利目標及風險報酬比

### 🎯 互動式圖表
- **K線圖表**: 完整的蠟燭圖顯示,包含價格走勢
- **教學提示**: 滑鼠懸停顯示 SMC 概念說明
- **縮放功能**: 點擊圖表可放大查看細節
- **即時數據**: 顯示最新價格及漲跌幅

### 📱 現代化介面
- **響應式設計**: 適配各種螢幕尺寸
- **卡片式布局**: 清晰展示多支股票分析結果
- **深色主題**: 專業的深色配色,減少眼睛疲勞

## 🏗️ 技術架構

### 前端 (Frontend)
- **框架**: React 18.2.0
- **建置工具**: Vite 5.0.8
- **樣式**: CSS Modules + Google Fonts (Inter)
- **圖表**: 自製 Canvas 繪圖引擎

### 後端 (Backend)
- **語言**: Python 3.x
- **資料來源**: FinMind API
- **分析引擎**: smartmoneyconcepts 套件
- **資料處理**: Pandas

### 資料流程
```
API (股票列表) → Python 分析器 → JSON 輸出 → React 前端顯示
```

## 💻 系統需求

### 前端開發
- Node.js 16.x 或更高版本
- npm 或 pnpm 套件管理器

### 後端分析
- Python 3.8 或更高版本
- pip 套件管理器

## 🚀 安裝指南

### 1. 克隆專案

```bash
git clone <repository-url>
cd smc-stock
```

### 2. 安裝前端依賴

使用 npm:
```bash
npm install
```

或使用 pnpm:
```bash
pnpm install
```

### 3. 安裝後端依賴

```bash
cd backend
pip install -r requirements.txt
```

**requirements.txt 包含:**
- `smartmoneyconcepts` - SMC 技術分析套件
- `pandas` - 資料處理
- `requests` - HTTP 請求

## 📖 使用說明

### 步驟 1: 生成股票分析數據

執行 Python 批量分析器,從 API 獲取當日跌幅排行並進行 SMC 分析:

```bash
cd backend
python batch_analyzer.py
```

**分析器功能:**
- 從 API 獲取當日跌幅排行股票列表
- 對每支股票進行 SMC 技術分析 (預設 120 天數據)
- 生成 JSON 格式的分析結果
- 輸出到 `backend/output/` 目錄

**輸出檔案:**
- `output/index.json` - 股票列表索引
- `output/{股票代碼}.json` - 個別股票分析結果

### 步驟 2: 複製數據到前端

將生成的 JSON 檔案複製到前端 public 目錄:

```bash
# Windows PowerShell
Copy-Item backend\output\*.json public\

# Linux/Mac
cp backend/output/*.json public/
```

### 步驟 3: 啟動開發伺服器

```bash
npm run dev
```

或使用 pnpm:
```bash
pnpm dev
```

應用程式將在 `http://localhost:5173` 啟動

### 步驟 4: 瀏覽分析結果

開啟瀏覽器訪問 `http://localhost:5173`,您將看到:
- 所有分析股票的卡片列表
- 每張卡片包含:
  - 股票代碼與名稱
  - 當前價格與漲跌幅
  - 交易執行計劃 (進場/停損/獲利)
  - 互動式 K線圖表
- 右下角 SMC 教學圖例

### 建置生產版本

```bash
npm run build
```

建置完成的檔案將輸出到 `dist/` 目錄

## � 部署到 Vercel

### 前置準備

1. **生成並提交股票數據**

```bash
# 1. 執行分析器生成數據
cd backend
python batch_analyzer.py

# 2. 複製到 public 目錄
cd ..
Copy-Item backend\output\*.json public\

# 3. 提交到 Git
git add public/*.json
git commit -m "Add stock analysis data"
git push
```

### 部署步驟

1. **登入 Vercel**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "Add New Project"
   - 選擇您的 GitHub repository
   - Vercel 會自動偵測 Vite 框架

3. **配置設定** (通常自動偵測,無需修改)
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **部署**
   - 點擊 "Deploy"
   - 等待建置完成 (約 1-2 分鐘)

### 自動更新數據

如果您想定期更新股票數據,可以:

1. **本地更新並推送**
```bash
# 每日執行
cd backend
python batch_analyzer.py
cd ..
Copy-Item backend\output\*.json public\ -Force
git add public/*.json
git commit -m "Update stock data $(Get-Date -Format 'yyyy-MM-dd')"
git push
```

2. **Vercel 自動部署**
   - 推送到 GitHub 後,Vercel 會自動重新部署
   - 約 1-2 分鐘後新數據就會上線

### 環境變數 (可選)

如果需要設定環境變數:
- 在 Vercel Dashboard → Settings → Environment Variables
- 目前此專案不需要額外環境變數

### 注意事項

⚠️ **重要**: 
- `public/*.json` 檔案**必須**提交到 Git,否則 Vercel 部署後會沒有數據
- `backend/output/*.json` 不需要提交 (已在 .gitignore 中排除)
- 每次更新數據都需要重新提交並推送

### 🤖 自動化更新 (GitHub Actions)

本專案已配置 GitHub Actions,可以自動更新股票數據!

**自動執行時間:**
- 週一到週五 早上 09:15 (台灣時間)
- 自動獲取當日跌幅排行
- 執行 SMC 分析
- 更新 `public/*.json` 檔案
- 自動提交並推送到 GitHub
- Vercel 自動重新部署

**手動觸發:**
1. 前往 GitHub repository
2. 點擊 "Actions" 標籤
3. 選擇 "Update Stock Data" 工作流程
4. 點擊 "Run workflow" 按鈕

**查看執行記錄:**
- 在 GitHub Actions 頁面可以查看每次執行的詳細日誌
- 如果執行失敗會收到通知

**注意事項:**
- GitHub Actions 使用 UTC 時間,已自動轉換為台灣時間
- 只在股票交易日執行 (週一到週五)
- 如果數據沒有變化,不會產生新的提交

> 📖 **詳細說明**: 查看 [.github/AUTOMATION.md](.github/AUTOMATION.md) 了解完整的自動化工作流程、故障排除和最佳實踐。

## �📁 專案結構

```
smc-stock/
├── backend/                    # Python 後端分析器
│   ├── batch_analyzer.py      # 批量分析主程式
│   ├── smc_analyzer.py        # SMC 分析核心邏輯
│   ├── finmind_client.py      # FinMind API 客戶端
│   ├── verify_data.py         # 數據驗證工具
│   ├── requirements.txt       # Python 依賴
│   └── output/                # 分析結果輸出目錄
│       ├── index.json         # 股票索引
│       └── {code}.json        # 個別股票數據
│
├── src/                       # React 前端源碼
│   ├── App.jsx               # 主應用組件
│   ├── App.css               # 主樣式
│   ├── components/           # React 組件
│   │   ├── CandlestickChart.jsx    # K線圖表組件
│   │   ├── ExecutionPlan.jsx       # 交易計劃組件
│   │   ├── SMCTooltip.jsx          # SMC 教學提示組件
│   │   ├── StockSelector.jsx       # 股票選擇器
│   │   └── ZoomModal.jsx           # 圖表放大模態框
│   └── api/                  # API 相關
│
├── public/                    # 靜態資源
│   ├── index.json            # 從 backend 複製的索引
│   └── *.json                # 從 backend 複製的股票數據
│
├── index.html                # HTML 入口
├── vite.config.js           # Vite 配置
└── package.json             # 前端依賴配置
```

## 📚 SMC 概念說明

### Smart Money Concepts (SMC)

SMC 是一種技術分析方法,專注於識別機構投資者 (Smart Money) 的交易行為。

#### 核心概念

1. **市場結構 (Market Structure)**
   - **HH (Higher High)**: 更高的高點
   - **HL (Higher Low)**: 更高的低點
   - **LH (Lower High)**: 更低的高點
   - **LL (Lower Low)**: 更低的低點

2. **擺動點 (Swing Points)**
   - **Swing High**: 局部最高點
   - **Swing Low**: 局部最低點
   - 用於識別趨勢變化

3. **公平價值缺口 (Fair Value Gap, FVG)**
   - 價格快速移動留下的未成交區域
   - 通常會被回測填補
   - 可作為潛在的進場區域

4. **市場結構突破 (Break of Structure, BOS)**
   - 突破前一個擺動高點或低點
   - 確認趨勢延續

5. **市場結構改變 (Change of Character, CHoCH)**
   - 市場結構的反轉訊號
   - 可能預示趨勢轉變

### 圖表元素說明

- 🟢 **綠色區域**: 看漲 FVG / 進場區
- 🔴 **紅色區域**: 看跌 FVG / 進場區
- 🔵 **藍色虛線**: 停損位置
- 🟡 **黃色虛線**: 獲利目標
- 📈 **趨勢線**: 連接擺動點的斜線

## 🔧 自訂配置

### 修改分析參數

編輯 `backend/batch_analyzer.py`:

```python
# 修改數據天數 (預設 120 天)
batch_analyze(API_URL, days=180)
```

### 修改 API 來源

編輯 `backend/batch_analyzer.py`:

```python
# 修改 API URL
API_URL = "your-custom-api-url"
```

### 修改圖表尺寸

編輯 `src/App.jsx`:

```javascript
<CandlestickChart
    width={800}   // 修改寬度
    height={400}  // 修改高度
    // ...
/>
```

## 🐛 常見問題

### Q1: 前端顯示「無法載入股票列表」

**解決方案:**
- 確認已執行 `python batch_analyzer.py`
- 確認已將 `backend/output/*.json` 複製到 `public/`
- 檢查 `public/index.json` 是否存在

### Q2: Python 分析器執行失敗

**解決方案:**
- 確認已安裝所有依賴: `pip install -r requirements.txt`
- 檢查網路連線 (需要訪問 FinMind API)
- 確認 Python 版本 >= 3.8

### Q3: 圖表無法顯示

**解決方案:**
- 檢查瀏覽器控制台是否有錯誤
- 確認 JSON 數據格式正確
- 嘗試清除瀏覽器快取並重新整理

## 📝 授權

本專案僅供學習與研究使用。

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request!

---

**注意**: 本工具提供的分析結果僅供參考,不構成投資建議。投資有風險,請謹慎決策。