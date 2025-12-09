# 旅遊套票平台 - 功能需求檢查清單

## ✅ 已完成項目

### 1. ✅ 除了「圖片網址」以外的欄位皆需必填
- **位置**: `index.html` 表單欄位
- **實作**: 所有 input/select/textarea 都加上 `required` 屬性（圖片網址除外）
- **驗證**: `script.js` 的 `validateForm()` 函數逐一檢查必填欄位

### 2. ✅ 上方表單的地區跟下方篩選的地區都寫死選項（依照 JSON data area 欄位）
- **位置**: 
  - 表單地區選單: `index.html` line 73-77
  - 篩選地區選單: `index.html` line 171-176
- **選項**: 台北、台中、高雄（與 JSON data 的 area 欄位一致）

### 3. ✅ 地區的篩選需要有『全部地區』option
- **位置**: `index.html` line 172
- **實作**: `<option value="">全部地區</option>`
- **邏輯**: `script.js` 的 `handleRegionFilter()` 會將空值視為顯示全部資料

### 4. ✅ 不需要有「清除資料」的按鈕
- **確認**: 整個專案中沒有清除資料按鈕

### 5. ✅ 預設資料為 3 筆（內容需依照 JSON data）
- **位置**: `script.js` 的 `fetchTickets()` 函數
- **實作**: 使用 fetch 從遠端 API 取得 JSON，初始包含 3 筆資料
- **資料來源**: `https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json`

### 6. ✅ 篩選後會顯示『搜尋資料為 ? 筆』
- **位置**: `script.js` 的 `updateResultCount()` 函數
- **顯示元素**: `#search-result-text`
- **觸發時機**: 每次 `renderTickets()` 執行時自動更新

### 7. ✅ 使用 fetch 取得 JSON 資料，存於本地端
- **位置**: `script.js` 的 `fetchTickets()` 函數
- **本地變數**: `data` 陣列
- **後續處理**: 所有篩選、新增、渲染都操作本地 `data` 變數

---

## 技術實作補充

- **圖表**: 使用 C3.js（基於 D3.js）繪製甜甜圈圖
- **驗證**: 前端即時驗證 + HTML5 `required` 屬性雙重保護
- **資料流**: 遠端 → 本地 `data` → 篩選 → 渲染 → UI
