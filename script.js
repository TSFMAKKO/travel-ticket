const API_URL =
  "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";

let data = [];

async function fetchData() {
  const res = await fetch(API_URL);
  return await res.json();
}

async function init() {
  data = await fetchData();
  data = data.data;
  console.log("data:", data);
}

init();
