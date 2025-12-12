const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let tickets = [];
let id = 3;
let chart = null;
const ticketCardAreaDOM = document.querySelector(".ticket-card-area");
const regionSearchDOM = document.querySelector(".region-search");
const searchResultTextDOM = document.querySelector("#search-result-text");

const addTicketForm = document.querySelector(".add-ticket-form");
const ticketCardAreaDOM6 = document.querySelector(".ticket-card-area");

async function fetchData() {
  const res = await fetch(API_URL);
  return await res.json();
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
                ${el.description}  </p>
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
}

function regionSearchHandler(e) {
  console.log("e:", e.target.value);

  let areas = tickets.filter((d) => d.area === e.target.value);
  if (e.target.value === "") areas = tickets;

  renderCards(areas);
  renderChart(areas);

  searchResultTextDOM.innerHTML = `本次搜尋共 ${areas.length} 筆資料 `;
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
  
  searchResultTextDOM.innerHTML = `本次搜尋共 ${tickets.length} 筆資料 `;
}

function renderChart(data) {
  // C3.js 圖表實例
  let obj = data.reduce((obj, d) => {
    let cityName = d.area;
    console.log("cityName:", cityName);

    obj[cityName] ? (obj[cityName] += 1) : (obj[cityName] = 1);
    //   if (!obj[cityName]) {
    //     obj[cityName]=1
    //   } else {
    //     obj[cityName]+=1
    //   }
    return obj;
  }, {});

  let arr = Object.entries(obj);
  chart = c3.generate({
    bindto: "#donut-chart",

    data: {
      columns:
        // [
        //   ["台北", 1],

        //   ["台中", 1],

        //   ["高雄", 1],
        // ],
        arr,
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
  tickets = tickets.data;
  console.log("tickets", tickets);
  renderCards(tickets);

  regionSearchDOM.addEventListener("click", regionSearchHandler);
  addTicketForm.addEventListener("submit", addTicketHandler);

  renderChart(tickets);

  searchResultTextDOM.innerHTML = `本次搜尋共 ${tickets.length} 筆資料 `;
}

init();
