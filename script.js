const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

async function fetchData() {
  const res = await fetch(API_URL);
  const data = res.json();
  return data;
}

let tickets = [];
async function init() {
  let data = await fetchData();
  tickets = data.data;

  console.log("ticket", tickets);
}

init();
