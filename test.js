let citys = new Set(["高雄", "台中", "台北"]);
let data = [{ area: "高雄" }, { area: "台中" }, { area: "高雄" }];
let arr = [];
Array.from(citys).forEach((city) => {
  let cityLength = data.filter((d) => d.area === city).length;
  arr.push([city, cityLength]);
});

console.log("arr:", arr);

// 如果改成 reduce 呢
let obj = data.reduce((obj, d) => {
  let cityName = d.area;
  console.log("cityName:", cityName);

    obj[cityName] ? obj[cityName] += 1 : obj[cityName]=1;
//   if (!obj[cityName]) {
//     obj[cityName]=1
//   } else {
//     obj[cityName]+=1
//   }
  return obj;
}, {});

console.log("obj:", obj);
console.log("arr2:", Object.entries(obj));

