const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];
let ticketCardArea = document.querySelector(".ticket-card-area");

// 目前選擇的篩選地區（空字串代表全部地區）

let currentRegion = "";

async function fetchData() {
  let res = await fetch(API_URL);

  return res.json();
}

function render() {
  let html = ``;
  data.forEach((el) => {
    console.log("el:", el);
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

async function init() {
  data = await fetchData();
  data = data.data;
  console.log("data:", data);

  render();
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
