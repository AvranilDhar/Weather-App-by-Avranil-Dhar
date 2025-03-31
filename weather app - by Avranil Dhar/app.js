const apiKey = '2595b617e977009fb8f45b41516b7113';
let unit = 'metric';

const form = document.querySelector(".input-form");
const search = document.querySelector("#search");


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (search.value.trim() === '') {
        alert('Search for places . . .');
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search.value.trim()}&appid=${apiKey}&units=${unit}`;
    await getData(url);
});

document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', async () => {
        unit = radio.value;
        if (search.value.trim() !== '') {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${search.value.trim()}&appid=${apiKey}&units=${unit}`;
            await getData(url);
        }
    });
});

function getWindDirection(deg) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE","S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(deg / 22.5) % 16];
}

async function getData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        
        if (data.cod == 200) {
            document.querySelector('.temp-img').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            document.querySelector(".description").textContent = data.weather[0].description;
            document.querySelector('.temperature').innerHTML = `${data.main.temp.toFixed(1)} <sup>o</sup>${unit === 'metric' ? 'C' : 'F'}`;
            document.querySelector('.feels-like').innerHTML = `Feels like ${data.main.feels_like.toFixed(1)} <sup>o</sup>${unit === 'metric' ? 'C' : 'F'}`;
            document.querySelector(".place").textContent = `${data.name}, ${data.sys.country}`;

            const dateTime = new Date(data.dt * 1000);
            const fullDate = dateTime.toLocaleDateString();
            const dayOfWeek = dateTime.toLocaleDateString('en-US', { weekday: 'long' });
            document.querySelector('.day-time').textContent = `${dayOfWeek}, ${fullDate}`;
            
            // Fetch Air Pollution Data
            const response2 = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`);
            const data2 = await response2.json();
            console.log(data2);

            if (data2.list?.[0]) {
                const aqi = data2.list[0].main.aqi;
                const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1];
                document.querySelector('.aqi').textContent = `AQI: ${aqi} - ${aqiText}`;

                const pollutants = data2.list[0].components;
                document.querySelector(".carbon-monoxide").textContent = `${pollutants.co.toFixed(2)} µg/m³`;
                document.querySelector(".nitrogen-monoxide").textContent = `${pollutants.no.toFixed(2)} µg/m³`;
                document.querySelector(".nitrogen-dioxide").textContent = `${pollutants.no2.toFixed(2)} µg/m³`;
                document.querySelector(".ozone").textContent = `${pollutants.o3.toFixed(2)} µg/m³`;
                document.querySelector(".sulphur-dioxide").textContent = `${pollutants.so2.toFixed(2)} µg/m³`;
                document.querySelector(".fine-particles").textContent = `${pollutants.pm2_5.toFixed(2)} µg/m³`;
                document.querySelector(".coarse-particulate-matter").textContent = `${pollutants.pm10.toFixed(2)} µg/m³`;
                document.querySelector(".ammonia").textContent = `${pollutants.nh3.toFixed(2)} µg/m³`;
            }

            document.querySelector(".humidity").textContent = `${data.main.humidity} %`;

            document.querySelector(".pressure").textContent = `${data.main.pressure} hPa`;

            document.querySelector(".wind-speed").textContent = `${data.wind.speed}${unit === 'metric' ? ' m/s' : ' mi/hr'}`;

            document.querySelector(".wind-direction").innerHTML = `${data.wind.deg} <sup>o</sup> (${getWindDirection(data.wind.deg)})`;

            document.querySelector(".wind-gust").textContent = `${data.wind.gust}${unit === 'metric' ? ' m/s' : ' mi/hr'}`;

            document.querySelector(".visibility").textContent = `${data.visibility} m`;
            
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            document.querySelector(".sunrise").textContent = sunrise;
            document.querySelector(".sunset").textContent = sunset;
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please check your internet connection.");
    }
}


window.onload = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=${apiKey}&units=${unit}`;
    await getData(url);
};

