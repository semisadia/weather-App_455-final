const apiKey = "d73150129f056e38b6f899993c03b709";

const searchBarEl = document.getElementById("search-bar");
const resultsEl = document.getElementById("search-results");
const mainContentEl = document.getElementById("main-content");


resultsEl.style.display = "none";
mainContentEl.style.display = "none";

// Search for city on user input
searchBarEl.addEventListener("keyup", async () => {
  const searchTerm = searchBarEl.value.trim();
  if (searchTerm.length > 2) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod === 200) {
        resultsEl.innerHTML = "";
        mainContentEl.innerHTML = "";

        updateMainContent(data);

        resultsEl.style.display = "none";
      } else {
        resultsEl.innerHTML = `No city found matching "${searchTerm}"`;
        resultsEl.style.display = "block";
      }
    } catch (error) {
      console.error(error);
      resultsEl.innerHTML = "An error occurred. Please try again.";
      resultsEl.style.display = "block";
    }
  } else {
    resultsEl.style.display = "none";
  }
});

// Update main content with weather data
function updateMainContent(weather) {
  const cityName = weather.name;
  const countryCode = weather.sys.country;
  const temperatureKelvin = weather.main.temp;
  const temperatureCelsius = Math.round(temperatureKelvin - 273.15);
  const description = weather.weather[0].description;
  const iconCode = weather.weather[0].icon;
  const humidity = weather.main.humidity;
  const windSpeedKmH = (weather.wind.speed * 3.6).toFixed(2);
  const sunriseTimestamp = weather.sys.sunrise * 1000;
  const sunsetTimestamp = weather.sys.sunset * 1000;
  const sunrise = new Date(sunriseTimestamp).toLocaleTimeString();
  const sunset = new Date(sunsetTimestamp).toLocaleTimeString();
  const windDirection = weather.wind.deg;
  const iconClass = getIconClass(iconCode);



  mainContentEl.innerHTML = `
    <h2>${cityName}, ${countryCode}</h2>
    <div class="weather-container">
      <i class="${iconClass} weather-icon"></i>
    </div>
    <p>${temperatureCelsius}°C - ${description}</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeedKmH} km/h</p>
    <p>Wind Direction: ${windDirection}°</p>
    <p>Sunrise: ${sunrise}</p>
    <p>Sunset: ${sunset}</p>
  `;
  mainContentEl.style.display = 'block';
}



function getIconClass(iconCode) {
  switch (iconCode) {
    case '01d':
      return 'fas fa-sun text-warning';
    case '01n':
      return 'fas fa-moon text-primary';
    case '02d':
    case '02n':
    case '03d':
    case '03n':
      return 'fas fa-cloud text-info';
    case '04d':
    case '04n':
      return 'fas fa-cloud-meatball text-secondary';
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return 'fas fa-cloud-showers-heavy text-info';
    case '11d':
    case '11n':
      return 'fas fa-bolt text-danger';
    case '13d':
    case '13n':
      return 'fas fa-snowflake text-light';
    case '50d':
    case '50n':
      return 'fas fa-smog text-muted';
    default:
      return 'fas fa-question text-dark';
  }
}




// Get weather for current location (geolocation API)
navigator.geolocation.getCurrentPosition(
  position => {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        updateMainContent(data);
      })
      .catch(error => {
        console.error(error);
      });
  },
  error => {
    console.error(error);
  }
);

