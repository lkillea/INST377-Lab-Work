function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1) + newMin);
}

function dataHandler(restoArray) {
  // console.log('fired dataHandler');
  // console.table(dataArray);
  const range = [...Array(listSize).keys()];
  const newList = range.map((item, index) => restoArray[index]);
  return newList;
}

function createHtmlList(collection, entry, numba) {
  const filterSearch = collection.filter((item) => {
    currentname = item.name;
    namefixed = currentname.toLowerCase();
    currentinput = entry.toLowerCase();
    return namefixed.includes(currentinput);
  });

  const filterZip = filterSearch.filter((item) => {
    currentzip = numba;
    restozip = item.zip;
    return restozip.includes(currentzip);
  });

  let displaylength = Math.min(filterZip.length, 15);

  const range2 = [...Array(displaylength).keys()];
  const displayed = range2.map((item, index) => {
    let restNumber = getRandomIntInclusive(0, (filterZip.length - 1));
    let thisOne = filterZip.splice(restNum,1);
    displaylength -=1;
    return thisOne[0];
  });







  // console.log('fired HTML creator'); //
  // console.table(collection); //
  const targetList = document.querySelector('.resto-list');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const {name} = item;
    const displayName = name.toLowerCase();
    const injectThisItem = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThisItem;
  });


async function mainEvent() { // the async keyword means we can make API requests
  console.log('script loaded');
  const form = document.querySelector('.page_item');
  const submit = document.querySelector('.submit_button');

  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');
  submit.style.display = 'none';

  console.log('form submission'); // this is substituting for a "breakpoint"
  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object
  // console.log(arrayFromJson); //

  if (arrayFromJson.length > 0) {
    submit.style.display = 'block';

    let currentArray = [];
    resto.addEventListener('input', async () => {
      console.log(event.target.value);

      if (currentArray.length < 1) {
        return;
      }

      const selectResto = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      // createHtmlList(selectResto);
      console.log(selectResto);
      createHtmlList(selectResto);
    });

    form.addEventListener('submit', async (submitEvent) => {
      submitEvent.preventDefault();
      // console.log('form submission'); //
      currentArray = restoArrayMake(arrayFromJson.data);
      console.log(currentArray);
      createHtmlList(restoArray);
    });
  } // this is called "dot notation"
  // arrayFromJson.data - we're accessing a key called 'data' on the returned object
  // it contains all 1,000 records we need
}

const targetList = document.querySelector("tbody");
const targetBox = document.querySelector(".tile");

async function populateMacros() {
  const customRequest = await fetch("/api/table/data");
  const macrosData = await customRequest.json();

  macrosData.forEach((meal) => {
    const appendItem = document.createElement("tr");
    appendItem.innerHTML = `
    <th>${meal["meal_id"]}</th>
    <td>${meal["meal_name"]}</td>
    <td>${meal["calories"]}</td>
    <td>${meal["carbs"]}g</td>
    <td>${meal["sodium"]}mg</td>
    <td>${meal["protein"]}g</td>
    <td>${meal["fat"]}g</td>
    <td>${meal["cholesterol"]}mg</td>`;
    targetList.append(appendItem);
  });
}

//  This function fetches all dining halls and then populates the neraby restaurants on the home page
async function populateRestaurants() {
  const diningRequest = await fetch("/api/dining");
  const diningData = await diningRequest.json();

  diningData["data"].forEach((restaurant) => {
    const appendItem = document.createElement("div");
    appendItem.classList.add("tile", "has-text-centered", "is-parent", "is-3");
    appendItem.innerHTML = `
    <article class="tile is-child box has-background-link-dark ">
    <span class="subtitle has-text-light has-text-weight-bold">${
      restaurant["hall_name"]
    }</span>
    <br />
    <span class="has-text-light">${
      restaurant["hall_address"].split(",")[0]
    }</span>
    <br/>
    <span class="has-text-light">${
      restaurant["hall_address"].split(",")[1]
    }</span>
    </article>`;
    targetBox.append(appendItem);
  });
}
/* eslint-disable max-len */
function mapScript() {
  const LatLong = [38.7849, 76.8721];
  const mymap = L.map(TargetId).setView(latLong, 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiYWxlaXRjaDEtdW1kLWVkdSIsImEiOiJjazhpdTF3Y28wYTIzM2twNnAxc2g2N2tnIn0.I1tMmZhRRNRt3LF7QnnB4g",
    }
  ).addTo(mymap);
  return mymap;
}

async function dataFilter(mapFromMapFunction) {
  const form = document.querySelector("#search-form");
  const search = document.querySelector("#search");
  const targetList = document.querySelector(".target-list");
  const replyMessage = document.querySelector(".reply-message");

  const request = await fetch("/api/map/data");
  const data = await request.json();

  // this code fires when our form submits
  // it filters our data list and returns it to the HTML
  form.addEventListener("submit", async (event) => {
    targetList.innerText = "";

    event.preventDefault();
    console.log("submit fired", search.value);
    // eslint-disable-next-line max-len
    // make sure each returned restaurant _can_ be plotted on the map by checking for the value we need
    const filtered = data.filter(
      (record) =>
        (record.meal_name.toUpperCase().includes(search.value.toUpperCase()) &&
          record.hall_lat) ||
        (record.hall_name.toUpperCase().includes(search.value.toUpperCase()) &&
          record.hall_lat)
    );
    const topFive = filtered.slice(0, 5);

    if (topFive.length < 1) {
      replyMessage.classList.add("box");
      replyMessage.innerText = "No matches found";
    }

    console.table(topFive);

    topFive.forEach((item) => {
      const Lat = item.hall_lat;
      const Long = item.hall_long;
      console.log("markerLongLat", Long, Lat);
      const marker = L.marker([Lat, Long]).addTo(mapFromMapFunction);
      const popup = L.popup()
        .setLatLng([Lat, Long])
        .setContent(`<p>${item.hall_name}</p>`)
        .openOn(mapFromMapFunction);
      marker.bindPopup(popup).openPopup();
      mapFromMapFunction.addLayer(marker);
      const appendItem = document.createElement("li");
      appendItem.classList.add("block", "list-item");
      appendItem.innerHTML = `<div class="block"><div class="list-header is-size-5">${item.meal_name}</div><address class="is-size-6">${item.hall_name}</address></div>`;
      targetList.append(appendItem);
    });
    const Lat = topFive[0]?.hall_lat;
    const Long = topFive[0]?.hall_long;
    console.log("viewSet coords", Lat, Long);
    mapFromMapFunction.panTo([Lat, Long], 0);
  });

  // this listens for typing into our input box
  search.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    if (search.value.length === 0) {
      // clear your "no matches found" code
      targetList.innerText = "";
    }
  });
}

async function windowActions() {
  populateMacros();
  populateRestaurants();
  const mapObject = mapScript(); // Load your map
  await dataFilter(mapObject); // load your food data
}

window.onload = windowActions;
