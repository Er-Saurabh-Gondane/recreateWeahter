const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAcsBtn = document.querySelector("[data-grantAccess]");
const grantLocationContainer = document.querySelector(
  ".grant-location-container"
);
const userInfoContainer = document.querySelector(".user-info-container");
const searchForm = document.querySelector("[ data-serachForm]");
const loadingScreen = document.querySelector(".loading-container");

const API_KEY = "you api key";

grantAcsBtn.addEventListener("click", getLocation);
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,(err)=>{
        console.error(err.message);
    });
  } else {
    alert("No geolocaton support available.");
  }
}
 getFromSessionStorage();
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  console.log("user Corri",userCoordinates);

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchWeatherDetails(userCoordinates);
}
// current tab for switching into both tab user and search tab
let currentTab = userTab;
currentTab.classList.add("current-tab");

// tab switching
userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantLocationContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.add("active");
      // here our best part start means the we are not on the search tab but if we want to show user weather info we need to check in the sesstion storage if the lon and lat is present or not
      getFromSessionStorage();
      userInfoContainer.classList.remove('active');
    }
  }
}

// check if the coordinates are present or not in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // not found condtion
    grantLocationContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    console.log("coordinates",coordinates);
    fetchWeatherDetails(coordinates);
    // userInfoContainer.classList.add('active')
  }
}

async function fetchWeatherDetails(coordinates) {
  const { lon, lat } = coordinates;
  console.log("cords", coordinates);
  grantLocationContainer.classList.remove("active");
  loadingScreen.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error("The network call failed.");
    }
    const data = await response.json();
    console.log("API DATA", data);
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    console.log(error);
  }
}

function renderWeatherInfo(data) {
  const cityName = document.querySelector("[data-cityname]");
  const countryFlag = document.querySelector("[data-countryIcon]");
  const weatherDesc = document.querySelector("[data-weatherDescription]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const dataTemp = document.querySelector("[data-temprature]");

  // cards
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidityData = document.querySelector("[data-humidity]");
  const cloudData = document.querySelector("[data-cloud]");

  console.log("city name", `${data?.name}`);
  cityName.innerText = `${data?.name}`;
  countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
  weatherDesc.innerText = `${data?.weather[0]?.description}`; //or weather?.[0]?.description
  weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`;
  dataTemp.innerText = `${data?.main?.temp} °C`;

  windSpeed.innerText = `${data?.wind?.speed} m/s`;
  humidityData.innerText = `${data?.main?.humidity} %`;
  cloudData.innerText = `${data?.clouds?.all} %`;
}
const serachInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {

  e.preventDefault();
  let cityName = serachInput.value.trim();
  if (serachInput == "") {
      showError("❌ City not found, please try again");
    return;
  } else {
    fetchSearchWeatherinfo(cityName);
  }
});
async function fetchSearchWeatherinfo(city) {
    userInfoContainer.classList.remove('active');
    loadingScreen.classList.add('active');
    grantLocationContainer.classList.remove('active')
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if(!response.ok){
            throw new Error("API Is not working properly");
        }
        const data = await response.json();
        console.log("API DATA 2",data);
        renderWeatherInfo(data);
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
    } catch (error) {
        console.log(error)
    }
}

//  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API key}`

// async function fetchWeatherDetails() {
//   const city = "goa";
//   try {
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//     );
//     if (!response.ok) {
//       throw new error("The network response is not ok");
//     }
//     const data = await response.json();
//     console.log("Response data", data);
//     renderWeatherInfo(data);
//   } catch (error) {
//     console.error("There is problem in fetching data");
//   }
// }
// fetchWeatherDetails();

// function renderWeatherInfo(data) {
//   // let newPara = document.createElement('p');
//   // newPara.textContent = `${data?.wind.speed}`;
//   // const headid = document.getElementById("wrapper");
//   // headid.appendChild(newPara);
// }
// renderWeatherInfo();
// https://pro.openweathermap.org/data/2.5/forecast?lat=79.1&lon=25.15&appid=4ab72ee54d6b4bb1af477985f45df71b
