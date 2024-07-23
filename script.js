const button = document.getElementById("search_btn");
const input = document.getElementById("city_input");
const weatherInfo = document.getElementById("weather_info");

let previousWeatherState = {};

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
    sendNotification(result);
});

function displayWeather(data) {
    if (data.error) {
        weatherInfo.innerHTML = `<p>${data.error.message}</p>`;
        return;
    }
    weatherInfo.innerHTML = `
        <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
        <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
        <p><strong>Feels Like:</strong> ${data.current.feelslike_c}°C</p>
        <p><strong>Condition:</strong> ${data.current.condition.text}</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Wind:</strong> ${data.current.wind_kph} kph</p>
        <p><strong>Pressure:</strong> ${data.current.pressure_mb} mb</p>
        <p><strong>Visibility:</strong> ${data.current.vis_km} km</p>
        <p><strong>UV Index:</strong> ${data.current.uv}</p>
        <img src="${data.current.condition.icon}" alt="Weather icon">
    `;
}

function sendNotification(data) {
    if (data.error || Notification.permission !== "granted") return;

    const currentWeatherState = {
        condition: data.current.condition.text,
        temp: data.current.temp_c,
    };

    if (JSON.stringify(currentWeatherState) !== JSON.stringify(previousWeatherState)) {
        const notification = new Notification("Weather Update", {
            body: `Current condition in ${data.location.name}: ${data.current.condition.text}, ${data.current.temp_c}°C`,
            icon: data.current.condition.icon
        });

        notification.addEventListener("error", () => {
            alert("Error displaying notification");
        });

        previousWeatherState = currentWeatherState;
    }
}

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});
