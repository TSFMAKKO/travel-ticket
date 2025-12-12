const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let tickets = [];
let id = 3;
const ticketCardAreaDOM = document.querySelector(".ticket-card-area");
const regionSearch = document.querySelector(".region-search");
const searchResultTextDOM = document.querySelector("#search-result-text");
const cantFindAreaDOM = document.querySelector(".cant-find-area");
const addTicketForm = document.querySelector(".add-ticket-form");

const ticketCardAreaDOM6 = document.querySelector(".ticket-card-area");

async function fetchData() {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.data;
}

function renderCards(data) {
  let html = ``;
  data.forEach((el) => {
    html += `
     <li class="ticket-card">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src="${el.imgUrl}"
                alt="travel_${el.id}"
              />
            </a>
            <div class="ticket-card-region">${el.area}</div>
            <div class="ticket-card-rank">7</div>
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
  ticketCardAreaDOM.innerHTML = html;
  searchResultTextDOM.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
}

function regionSearchHandler(e) {
  console.log(e.target.value);
  const area = e.target.value;
  console.log("tickets", tickets);

  let areas = tickets.filter((d) => d.area === area);
  console.log("areas:", areas);

  if (area === "") areas = tickets;

  renderCards(areas);
  renderChart(areas);
}

function addTicketHandler(e) {
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
  tickets.push({ id, name, imgUrl, area, price, group, rate, description });

  renderCards(tickets);
  renderChart(tickets);
}

let chart = null;
function renderChart(data) {
  console.log("data:", data);

  // C3.js 圖表實例
  let obj = data.reduce((o, d) => {
    o[d.area] ? (o[d.area] += 1) : o[d.area]=1;
    return o;
  }, {});

  console.log("obj",obj);
 const chartData=Object.entries(obj)
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

async function init() {
  tickets = await fetchData();
  console.log("tickets", tickets);

  renderCards(tickets);

  regionSearch.addEventListener("click", regionSearchHandler);
  addTicketForm.addEventListener("submit", addTicketHandler);

  renderChart(tickets);
}

init();
