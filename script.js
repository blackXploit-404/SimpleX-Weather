const button = document.getElementById("search_btn");
const input = document.getElementById("city_input");
const weatherInfo = document.getElementById("weather_info");

async function getData(city) {
    const promise = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=77c2892120b04ec8b9092115240307&q=${city}&aqi=yes`
    );
    return await promise.json();
}

button.addEventListener('click', async () => {
    const value = input.value;
    weatherInfo.innerHTML = '<div class="loading"></div>'; // Show loading animation
    const result = await getData(value);
    displayWeather(result);
});

function displayWeather(data) {
    if (data.error) {
        weatherInfo.innerHTML = `<p>${data.error.message}</p>`;
        return;
    }
    weatherInfo.innerHTML = `
        <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
        <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
        <p><strong>Condition:</strong> ${data.current.condition.text}</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Wind:</strong> ${data.current.wind_kph} kph</p>
        <img src="${data.current.condition.icon}" alt="Weather icon">
    `;
}
