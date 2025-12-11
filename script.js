const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];
let ticketCardArea = document.querySelector(".ticket-card-area");

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
                ${el.description
}
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

  ticketCardArea.innerHTML=html
}

async function init() {
  data = await fetchData();
  data = data.data;
  console.log("data:", data);

  renderCard(data)
}

init();
