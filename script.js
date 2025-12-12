const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let tickets = [];
const ticketCardAreaDOM = document.querySelector(".ticket-card-area");

const regionSearchDOM = document.querySelector(".region-search");
const cantFindAreaDOM = document.querySelector(".cant-find-area");
const ticketCardArea4 = document.querySelector(".ticket-card-area");
const ticketCardArea5 = document.querySelector(".ticket-card-area");
const ticketCardArea6 = document.querySelector(".ticket-card-area");

async function fetchData() {
  const res = await fetch(API_URL);
  const data = res.json();
  return data;
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

  ticketCardAreaDOM.innerHTML = html;
}

function regionSearchHandler(e) {
  const area = e.target.value;
  console.log("area:", area);
  console.log("tickets", tickets);

  let areas = tickets.filter((ticket) => {
    return ticket.area === area;
  });

  if (area === "") areas = tickets;
  console.log("areas", areas);

  renderCards(areas);
  cantFindAreaHandler(areas);
}

function cantFindAreaHandler(data) {
  cantFindAreaDOM.style.display = "none";
  if (data.length === 0) {
    cantFindAreaDOM.style.display = "block";
  }
}

async function init() {
  let data = await fetchData();
  tickets = data.data;

  console.log("ticket", tickets);
  renderCards(tickets);

  regionSearchDOM.addEventListener("click", regionSearchHandler);
}

init();
