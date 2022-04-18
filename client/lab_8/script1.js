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

  // eslint-disable-next-line no-unused-vars;
  let displaylength = Math.min(filterZip.length, 15);
  const range2 = [...Array(displaylength).keys()];
  const displayed = range2.map((item, index) => {
    let restNum = getRandomIntInclusive(0, (filterZip.length - 1));
    let thisOne = filterZip.splice(restNum, 1);
    displaylength -= 1;
    return thisOne[0];
  });

  const targetList = document.querySelector('.resto-list');
  targetList.innerHTML = '';

  displayed.forEach((item) => {
    eachName = (item.name.length < 30) ? item.name : `${item.name.substr(0, 27)}...`;
    const newLines = `<li${eachName.toLowerCase()}, ${item.zip}</li>`;
    targetList.innerHTML += newLines;
  });

  return displayed;
}

function initMap(targetId) {
  const baseCoords = [38.9, -76.8721];
  const map = L.map(targetId).setView(baseCoords, 10);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  }).addTo(map);
  return map;
}

function addMapMarkers(map, locationArray) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  locationArray.forEach((item) => {
    coords = item.geocoded_column_1?.coordinates;
    if (coords === undefined) { return; }
    console.log(coords);
    L.marker([coords[1], coords[0]]).addTo(map);
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  const button = document.querySelector('.submit');
  button.style.display = 'none';
  const userchoice = document.querySelector('#resto_name');
  const userlocation = document.querySelector('#zip');
  const map = initMap('map');

  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object
  localStorage.setItem('restaurants', JSON.stringify(arrayFromJson));
  const storedData = localStorage.getItem('restaurants');
  const storedDataArray = JSON.parse(storedData);
  const newTable = storedDataArray.data;

  if (newTable.length > 0) {
    submit.style.display = 'block';
    let currentArray = [];
    let filterPhrase = '';
    let filterNum = '';

    userchoice.addEventListener('input', async (event) => {
      console.log(event.target.value);
      filterPhrase = event.target.value;
      if (currentArray.length < 1) { return; }
      createHtmlList(currentArray, filterPhrase, filterNum);
      addMapMarkers(map, displayedRestaurants);
    });

    userlocation.addEventListener('input', async (event) => {
      filterNum = event.target.value;
      if (currentArray.length < 1) { return; }
      createHtmlList(currentArray, filterPhrase, filterNum);
      displayedRestaurants = createHtmlList(currentArray, filterPhrase, filterNum);
      addMapMarkers(map, displayedRestaurants);
    });

    button.addEventListener('click', async (submitEvent) => {
      submitEvent.preventDefault();
      currentArray = dataHandler(newTable);
      displayedRestaurants = createHtmlList(currentArray, filterPhrase, filterNum);
      addMapMarkers(map, displayedRestaurants);
    });
  }
}
document.addEventListener('DOMContentLoaded', async () => mainEvent());