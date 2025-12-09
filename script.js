// ✅ 遠端 JSON 資料來源
const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
// 預設圖片網址（當使用者未填寫圖片網址時使用）
const DEFAULT_IMAGE = "https://placehold.co/600x400?text=Travel";

// ✅ 地區設定（依照 JSON data area 欄位：台北、台中、高雄）
const REGION_SETTINGS = [
  { label: "台北", color: "#64C3BF" },
  { label: "台中", color: "#4F63D2" },
  { label: "高雄", color: "#F3A556" },
];

// DOM 元素參照
const ticketCardArea = document.querySelector(".ticket-card-area"); // 套票卡片容器
const searchResultText = document.getElementById("search-result-text"); // 搜尋結果文字
const regionSearch = document.querySelector(".region-search"); // 地區篩選下拉選單
const cantFindArea = document.querySelector(".cant-find-area"); // 查無資料區域
const addTicketBtn = document.querySelector(".add-ticket-btn"); // 新增套票按鈕
const addTicketForm = document.querySelector(".add-ticket-form"); // 新增套票表單
// 圖例數字顯示元素（依地區標籤建立對應表）
const legendCountEls = REGION_SETTINGS.reduce((acc, region) => {
  const target = document.querySelector(
    `[data-region-count="${region.label}"]`
  );
  if (target) {
    acc[region.label] = target;
  }
  return acc;
}, {});

// C3.js 圖表實例
let chart = null;

// 表單輸入欄位
const name = document.getElementById("ticket-name"); // 套票名稱
const imgUrl = document.getElementById("ticket-img-url"); // 圖片網址
const area = document.getElementById("ticket-region"); // 景點地區
const price = document.getElementById("ticket-price"); // 套票金額
const group = document.getElementById("ticket-num"); // 套票組數
const rate = document.getElementById("ticket-rate"); // 套票星級
const description = document.getElementById("ticket-description"); // 套票描述

// 錯誤訊息顯示元素對應表
const messageRefs = {
  name: document.getElementById("ticket-name-message"), // 套票名稱錯誤訊息
  imgUrl: document.getElementById("ticket-img-url-message"), // 圖片網址錯誤訊息
  region: document.getElementById("ticket-region-message"), // 景點地區錯誤訊息
  price: document.getElementById("ticket-price-message"), // 套票金額錯誤訊息
  group: document.getElementById("ticket-num-message"), // 套票組數錯誤訊息
  rate: document.getElementById("ticket-rate-message"), // 套票星級錯誤訊息
  description: document.getElementById("ticket-description-message"), // 套票描述錯誤訊息
};

// ✅ 本地端資料儲存（從遠端 fetch 後存於此）
let data = [];
// 目前選擇的篩選地區（空字串代表全部地區）
let currentRegion = "";

async function fetchData() {
  let res = await fetch(API_URL);
  return res.json();
}

data = await fetchData();
data = data.data;

console.log("data:", data);

function draw(data) {
  let html = ``;
  data.forEach((el) => {
    html += `
          <li class="ticket-card">
            <div class="ticket-card-img">
              <a href="#">
                <img
                  src="${el.imgUrl}"
                  alt="${el.imgUrl}"
                />
              </a>
              <div class="ticket-card-region">${el.area}</div>
              <div class="ticket-card-rank">${el.rate}</div>
            </div>
            <div class="ticket-card-content">
              <div>
                <h3>
                  <a href="#" class="ticket-card-name">${el.name}</a>
                </h3>
                <p class="ticket-card-description">
                  ${el.description}
                </p>
              </div>
              <div class="ticket-card-info">
                <div class="ticket-card-num">
                  <p>
                    <span><i class="fas fa-exclamation-circle"></i></span>
                    剩下最後 <span id="ticket-card-num"> ${el.group} </span> 組
                  </p>
                </div>
                <p class="ticket-card-price">
                  TWD <span id="ticket-card-price">$${el.price}</span>
                </p>
              </div>
            </div>
          </li>
  `;
  });

  ticketCardArea.innerHTML = html;
  // drawDonut()
}

function areaChange(e) {
  console.log("areaChange", e.target.value);

  let areas = data.filter((d) => {
    return d.area === e.target.value;
  });

  if (!e.target.value) {
    console.log("全部地區：");
    
    areas = data;
  }

  console.log("areas有幾筆:", areas);

  draw(areas);
  searchResultText.innerHTML = `本次搜尋共 ${areas.length} 筆資料`;
}

function init() {
  draw(data);
  drawDonut();
  regionSearch.addEventListener("change", areaChange);
}

init();

let id = 3;
addTicketForm.addEventListener("submit", function (e) {
  // 阻止預設事件
  event.preventDefault(); // 阻止表單提交
  console.log("submit", e.target["套票名稱"].value);
  const name = e.target["套票名稱"].value; // 套票名稱
  const imgUrl = e.target["圖片網址"].value; // 圖片網址
  const area = e.target["景點地區"].value; // 景點地區
  const price = e.target["套票金額"].value; // 套票金額
  const group = e.target["套票組數"].value; // 套票組數
  const rate = e.target["套票星級"].value; // 套票星級
  const description = e.target["套票描述"].value; // 套票描述

  console.log(name, imgUrl, area, price, group, rate, description);

  data.push({
    name,
    imgUrl,
    area,
    price,
    group,
    rate,
    description,
    id: (id += 1),
  });
  draw(data);
  drawDonut();
  searchResultText.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
});

function countLength() {
  // searchResultText
}

function drawDonut() {
  let citys = new Set();
  data.forEach((d) => {
    citys.add(d.area);
  });
  console.log("citys", citys);

  let chartData = Array.from(citys).map((city) => {
    console.log("city:", city);

    let arr = [];
    let areas = data.filter((d) => {
      console.log("d:", d.area, city);

      return d.area === city;
    }).length;

    console.log("city:", city);
    console.log("areas:", areas);

    arr.push(city, areas);
    return arr;
  });

  console.log("chartData:", chartData);

  chart = c3.generate({
    bindto: "#donut-chart",
    data: {
      columns:
        // [
        //   ["台北", 1],
        //   ["台中", 1],
        //   ["高雄", 1],
        // ],
        chartData,

      type: "donut",
      onclick: function (d, i) {
        console.log(d, i);
      },
    },
    donut: {
      title: "Fruits Share",
      width: 15, // 甜甜圈的厚度
    },
    color: {
      pattern: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A"],
    },
    tooltip: {
      format: {
        value: function (value, ratio, id) {
          return value + " (" + (ratio * 100).toFixed(1) + "%)";
        },
      },
    },
  });
}
