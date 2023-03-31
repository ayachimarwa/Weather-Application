const API_KEY = "360c88b987573a9916a527be32dc6ce9";

const iconElement =  document.getElementById("main-section-icon");
const temperElement = document.getElementById("temperature");
const locationElement = document.getElementById("address");
const descriptionElement = document.getElementById("description");
const windElement = document.getElementById("wind");
const sunriseElement = document.getElementById("sunrise-time"); 
const sunsetElement = document.getElementById("sunset-time"); 

const sunIconElement = document.getElementById("icon1");

let data = null; 
let geoData = null;


/* fonction getWeatherData va envoyer un request lel API */
async  function getWeatherData(){
    navigator.geolocation.getCurrentPosition(async (pos)=> {
        geoData = pos.coords;
        let res = null;
  
        res = await fetch(`
        https://api.openweathermap.org/data/2.5/weather?lat=${geoData.latitude}&lon=${geoData.longitude}&units=metric&appid=${API_KEY} `
        );

    data = await res.json();
    console.log(data)
    await getForcastData(geoData);

    temperElement.innerText = `${data.main.temp} °C`;
    locationElement.innerText = data.name;
    descriptionElement.innerText = `${data.weather[0].description}`;
    /*const iconRes = await fetch(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);*/
    iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; 

    windElement.innerText = `${data.wind.speed } km/h`;
    const sunrise = new Date(data.sys.sunrise*1000).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true });
    sunriseElement.innerText = `${sunrise}`;
    const sunset = new Date(data.sys.sunset*1000).toLocaleTimeString("en-US", { hour: 'numeric', minute: 'numeric', hour12: true });
    sunsetElement.innerText = `${sunset}`;
    });
    
    

}

getWeatherData(); /* appel lel fonction getWeatherdata*/

async function getForcastData(geo){
    const forecast_Res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geo.latitude}&lon=${geo.longitude}&units=metric&appid=${API_KEY}`);
    
   const forecastData = await forecast_Res.json();
    const dailyforecasts = [];
    forecastData.list.forEach(forecast => {
        const date = forecast.dt_txt.split(" ")[0]
        if (!dailyforecasts.find(e => e.dt_txt.split(" ")[0] === date)){
            dailyforecasts.push(forecast);
        }
        
    });
    const dailyForcastElement = document.getElementById("days");
    let weekElements = ""
    dailyforecasts.forEach(df=> {
        const dayElement = `
    <div class="day">
    <i id="icon1">
        <img src="https://openweathermap.org/img/wn/${df.weather[0].icon}@2x.png" alt="" width="20px">
    </i>
    <div class="sunday">${new Date(df.dt_txt).toLocaleDateString("en-US", {weekday: "long"})}</div>
    <div class="max-min">
        <div class="max"><i class="fa-solid fa-chevron-up"></i></div>
        <div class="min"><i class="fa-solid fa-chevron-down"></i></div>
    </div>
       
    
    <div class="temper">
        <div>${df.main.temp_max}°</div>
        <div>${df.main.temp_min}°</div>
    </div>
</div>`
weekElements += dayElement
    })
    dailyForcastElement.innerHTML = weekElements

}