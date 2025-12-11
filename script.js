const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];
let id = 3;
let ticketCardArea = document.querySelector(".ticket-card-area");
// cant-find-area donut-chart search-result-text region-search add-ticket-form

let regionSearch = document.querySelector(".region-search");
let searchResultText = document.querySelector("#search-result-text");
let cantFindArea = document.querySelector(".cant-find-area");

let donutChart = document.querySelector(".donut-chart");
let addTicketForm = document.querySelector(".add-ticket-form");

async function fetchData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  return data;
}

function renderCard(data) {
  let html = ``;
  data.forEach((el) => {
    html += `
  <li class="ticket-card">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src="${el.imgUrl}"
                alt="${el.name}"
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
}

function renderChart(data) {
  let obj = data.reduce((o, d) => {
    o[d.area] ? (o[d.area] += 1) : (o[d.area] = 1);
    return o
  }, {});

  console.log("obj",obj);
  
  let chart = c3.generate({
    bindto: "#donut-chart",

    data: {
      columns: Object.entries(obj),
      // [
      //   ["台北", 1],

      //   ["台中", 1],

      //   ["高雄", 1],
      // ],

      // chartData,

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


function changeHandler(e) {
  console.log("e", e.target.value);
  let city = e.target.value;
  let areas = [];
  if (city) {
    areas = data.filter((d) => {
      return d.area === city;
    });
  } else {
    areas = data;
  }

  console.log("render前的 areas", areas);

  renderCard(areas);
  searchResultText.innerHTML = `本次搜尋共 ${areas.length} 筆資料`;
  renderChart(areas);
  
}

function addTicketHandler(e) {
  console.log("e:", e.target["套票名稱"].value);
  e.preventDefault();

  // e.target["套票名稱"].value
  const name = e.target["套票名稱"].value; // 套票名稱
  const imgUrl = e.target["圖片網址"].value; // 圖片網址
  const area = e.target["景點地區"].value; // 景點地區
  const price = e.target["套票金額"].value; // 套票金額
  const group = e.target["套票組數"].value; // 套票組數
  const rate = e.target["套票星級"].value; // 套票星級
  const description = e.target["套票描述"].value; // 套票描述
  id += 1;

  data.push({ name, imgUrl, area, price, group, rate, description, id });
  renderCard(data);
  searchResultText.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
  renderChart(data);
}

async function init() {
  data = await fetchData();
  data = data.data;
  console.log("data:", data);

  renderCard(data);
  regionSearch.addEventListener("click", changeHandler);
  addTicketForm.addEventListener("submit", addTicketHandler);
  renderChart(data);
}

init();
