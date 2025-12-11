const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];
let id = 3;
// cant-find-area ticket-card-area
const ticketCardAreaDOM = document.querySelector(".ticket-card-area");
const cantFindAreaDOM = document.querySelector(".cant-find-area");

const regionSearch = document.querySelector(".region-search");
const searchResultTextDOM = document.querySelector("#search-result-text");
const addTickerForm = document.querySelector(".add-ticket-form");
const ticketCardArea6 = document.querySelector(".ticket-card-area");

// const ticketCardArea = document.querySelector(".ticket-card-area");

async function fetchData() {
  const res = await fetch(API_URL);
  return await res.json();
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

  cantFindAreaDOM.style.display = "none";
  ticketCardAreaDOM.innerHTML = html;
  searchResultTextDOM.innerHTML = `本次搜尋共 ${data.length} 筆資料`;

  if (data.length === 0) {
    cantFindAreaDOM.style.display = "block";
  }

  renderChart(data);
}

function regionSearchHandler(e) {
  let area = e.target.value;
  console.log("area:", area);

  let areas = data.filter((d) => d.area === area);

  console.log("areas", areas);

  if (area === "") areas = data;

  renderCard(areas);
}

function addTickerHandler(e) {
  e.preventDefault();
  console.log("e:", e.target["套票名稱"].value);

  const name = e.target["套票名稱"].value;
  const imgUrl = e.target["圖片網址"].value;
  const area = e.target["景點地區"].value;
  const price = e.target["套票金額"].value;
  const group = e.target["套票組數"].value;
  const rate = e.target["套票星級"].value;
  const description = e.target["套票描述"].value;
  id += 1;

  data.push({ name, imgUrl, area, price, group, rate, description, id });
  renderCard(data);
}

function renderChart(data) {
  const chartData = data.reduce((obj, d) => {
    console.log("d:", d);

    obj[d.area] ? (obj[d.area] += 1) : (obj[d.area] = 1);
    return obj;
  }, {});

  console.log("chartData:", chartData);

  let chart = c3.generate({
    bindto: "#donut-chart",

    data: {
      columns:
        // [
        //   ["台北", 1],
        //   ["台中", 1],
        //   ["高雄", 1],
        // ],

        Object.entries(chartData),
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

// renderChart(data);

async function init() {
  data = await fetchData();
  data = data.data;
  console.log("data:", data);

  renderCard(data);

  regionSearch.addEventListener("click", regionSearchHandler);
  addTickerForm.addEventListener("submit", addTickerHandler);
  renderChart(data);
}

init();
