const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];
let areas
let ticketCardArea = document.querySelector(".ticket-card-area");
let reginSearch = document.querySelector(".region-search");
let cantFindArea = document.querySelector(".cant-find-area");
let searchResultText = document.querySelector("#search-result-text");
let addTicketForm = document.querySelector(".add-ticket-form");
let id = 3;

// 目前選擇的篩選地區（空字串代表全部地區）

let currentRegion = "";

async function fetchData() {
  let res = await fetch(API_URL);

  return res.json();
}

function render(data) {
  let html = ``;
  data.forEach((el) => {
    // console.log("el:", el);
    html += `
 <li class="ticket-card ${el.id}">
          <div class="ticket-card-img">
            <a href="#">
              <img
                src="${el.imgUrl}"
                alt="travel_3"
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

function submitHandler(e) {
  e.preventDefault();
  console.log("submitHandler:", e);
  const name = e.target["套票名稱"].value;
  const imgUrl = e.target["圖片網址"].value;
  const area = e.target["景點地區"].value;
  const price = e.target["套票金額"].value;
  const group = e.target["套票組數"].value;
  const rate = e.target["套票星級"].value;
  const description = e.target["套票描述"].value;
  console.log("name:", name);
  id += 1;
  data.push({ name, imgUrl, area, price, group, rate, description, id });

  render(data);
  searchResultText.innerHTML = `本次搜尋共 ${data.length} 筆資料`;
}

function changeHandler(e) {
  let area = e.target.value;
  console.log("e:", area);

  areas = data.filter((d) => {
    return d.area === area;
  });

  if (area === "") areas = data;

  console.log("areas:", areas);

  if (areas.length > 0) {
    cantFindArea.display = "none";
    render(areas);
  }

  cantFindArea.display = "block";

  searchResultText.innerHTML = `本次搜尋共 ${areas.length} 筆資料`;

  chartDataHandler(areas)
}

async function init() {
  data = await fetchData();
  data = data.data;
  console.log("data:", data);

  searchResultText.innerHTML = `本次搜尋共 ${data.length} 筆資料`;

  render(data);
  reginSearch.addEventListener("change", changeHandler);
  addTicketForm.addEventListener("submit", submitHandler);

  chartDataHandler(data);
}

init();

// ticketCardArea.innerHTML=`
//  <li class="ticket-card">
//           <div class="ticket-card-img">
//             <a href="#">
//               <img
//                 src="https://github.com/hexschool/2022-web-layout-training/blob/main/js_week5/travel_3.png?raw=true"
//                 alt="travel_3"
//               />
//             </a>
//             <div class="ticket-card-region">台中</div>
//             <div class="ticket-card-rank">7</div>
//           </div>
//           <div class="ticket-card-content">
//             <div>
//               <h3>
//                 <a href="#" class="ticket-card-name">山林悠遊套票</a>
//               </h3>
//               <p class="ticket-card-description">
//                 山林悠遊套票，結合南投清境高空步道、雙龍瀑布七彩吊橋、瑞龍瀑布園區之熱門景點。
//               </p>
//             </div>
//             <div class="ticket-card-info">
//               <div class="ticket-card-num">
//                 <p>
//                   <span><i class="fas fa-exclamation-circle"></i></span>
//                   剩下最後 <span id="ticket-card-num"> 20 </span> 組
//                 </p>
//               </div>
//               <p class="ticket-card-price">
//                 TWD <span id="ticket-card-price">$1765</span>
//               </p>
//             </div>
//           </div>
//         </li>
//         `

// C3.js 圖表實例

let chart = null;
// let chartData = [
//   ["高雄", data.filter((d) => d.area === "高雄").length],
//   ["台北", data.filter((d) => d.area === "台北").length],
//   ["台中", data.filter((d) => d.area === "台中").length]
// ];

// let chartData = data.reduce((arr, d, i) => {
//   console.log("d:", d);

//   console.log("i:", i);
//   return arr;
// }, []);


function chartDataHandler(data) {
  console.log("chartDataHandler:");
  
  let arr = [];
  let areas = new Set();
  // console.log("data:",data);

  data.forEach((d) => {
    console.log("d:", d);

    areas.add(d.area);
  });

  console.log("chartData_areas", areas);

  Array.from(areas).forEach((area) => {
    console.log("area", area);

    arr.push([area, data.filter((d) => d.area === area).length]);
  });

  console.log("arr:", arr);

  chart = c3.generate({
    bindto: "#donut-chart",

    data: {
      columns: arr,

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

  return arr;
}

//  chartDataHandler(data);
