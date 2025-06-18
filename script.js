 const apiKey = "4a4bb023becbbda91cddfd76cacaac2f";
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");
const weatherIcon = document.querySelector(".weather-icon");
const hourlyForecastContainer = document.querySelector(".hourly-forecast");

async function checkWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error();

    const weatherData = await weatherRes.json();
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    document.querySelector(".location").innerText = `${weatherData.name}, ${weatherData.sys.country}`;
    document.querySelector(".temp").innerText = `${Math.round(weatherData.main.temp)}°C`;
    document.querySelector(".description").innerText = weatherData.weather[0].description;
    document.querySelector(".humidity").innerText = `${weatherData.main.humidity}%`;
    document.querySelector(".wind").innerText = `${Math.round(weatherData.wind.speed)} km/h`;

    // Set icon
    const main = weatherData.weather[0].main;
    if (main === "Clouds") weatherIcon.src = "images/clouds.png";
    else if (main === "Clear") weatherIcon.src = "images/clear.png";
    else if (main === "Rain") weatherIcon.src = "images/rain.png";
    else if (main === "Drizzle") weatherIcon.src = "images/drizzle.png";
    else if (main === "Mist") weatherIcon.src = "images/mist.png";
    else weatherIcon.src = "images/clear.png";

    // Dynamic extra message
    const msg = main === "Rain" || main === "Drizzle" ? "Expect high rain today." :
                main === "Clear" ? "Expect clear skies today." :
                main === "Clouds" ? "Cloudy with a chance of sunshine." :
                "Stay prepared for weather changes.";
    document.querySelector(".extra-message").innerText = msg;

    // Hourly forecast (starting with current)
    hourlyForecastContainer.innerHTML = "";
    const nowCard = createHourCard("Now", weatherData.main.temp, weatherData.weather[0].icon);
    hourlyForecastContainer.appendChild(nowCard);

    // 3hr intervals from forecast data
    for (let i = 0; i < 4; i++) {
      const forecast = forecastData.list[i];
      const time = new Date(forecast.dt * 1000);
      const hour = time.getHours() % 12 || 12;
      const ampm = time.getHours() >= 12 ? "PM" : "AM";
      const formattedTime = `${hour}${ampm}`;
      const icon = forecast.weather[0].icon;
      const temp = forecast.main.temp;

      const card = createHourCard(formattedTime, temp, icon);
      hourlyForecastContainer.appendChild(card);
    }

    weatherSection.style.display = "block";
    errorSection.style.display = "none";

  } catch {
    weatherSection.style.display = "none";
    errorSection.style.display = "block";
  }
}

function createHourCard(time, temp, iconCode) {
  const card = document.createElement("div");
  card.className = "hour-card";
  card.innerHTML = `
    <p>${time}</p>
    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" />
    <p>${Math.round(temp)}°</p>
  `;
  return card;
}

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) checkWeather(city);
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) checkWeather(city);
  }
});