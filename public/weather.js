// set an array of all the possible days of the week
const wDay= ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// set an array of all the possible months of the year
const wMonth = ["January","February","March","April",
"May","June","July", "August","September","October","November","December"];

// create an object of icon values based on current conditions
const iconValue = {
    CLEARDAY: 'clear-day',
    CLEARNIGHT: 'clear-night',
    RAIN: 'rain',
    SNOW: 'snow',
    SLEET: 'sleet',
    WIND: 'wind',
    FOG: 'fog',
    CLOUDY: 'cloudy',
    PARTLY_CLOUDY_DAY: 'partly-cloudy-day',
    PARTLY_CLOUDY_NIGHT: 'partly-cloudy-night'
}

// find the latitude and longitude of the user's location
function initGeoLocation(){
    // use `built-in` browser tool "naviagtor" to locate the lat and long of the user

    if(navigator.geolocation){

        // use a success and fail callback function
        navigator.geolocation.getCurrentPosition(success,fail)
        
    }else{
        alert("Sorry, your browser does not support Geolocation")
    }
}

//success function
function success(position){
    // add api keys here
    // use fetch function to find location
    fetchLocation(position.coords.latitude, position.coords.longitude);
    fetchWeather(position.coords.latitude, position.coords.longitude);
}

// fail function
function fail(){
    alert("Sorry, your browser does not support Geolocation")
}

// 'fetch function'
function fetchLocation(latitude, longitude){
    // call api from google
    var url = `/fetch?lat=${latitude}&lng=${longitude}`;

    fetch(url)
    .then(response => {
        return response.json()
    })
    .then(data => {
        //work  with data
        document.getElementById("location").innerHTML = data.results[5].formatted_address;
    })
    .catch( err => {
        throw(`Sorry, an error occured ${err}`);
    })
}

function fetchWeather(lat, lon){
    //declare Open Weather API Link
    var openWeatherUrl = `/fetch/weather?lat=${lat}&lon=${lon}`

    // fetch Open Weather API link
    fetch(openWeatherUrl)
    .then(response => {

        return response.json()
    })
    .then(data => {
        //work with openWeather data
            // all CURRENT weather data
        var resultsHTML = "";
        var tableHTML = "";
        var weatherDescription = data.current.weather[0].description;
        var temperature = data.current.temp;
        var icon = data.current.weather[0].icon;
        var uvi = data.current.uvi;
        var humidity = data.current.humidity;
        var windSpeed = data.current.wind_speed;
        var ts = new Date(data.current.dt * 1000);
        var forecastDate = `${wDay[ts.getDay()]} ${wMonth[ts.getMonth()]} ${ts.getDate()}`

        // set values for the current conditions
        document.getElementById("dayTime").innerHTML = forecastDate;
        document.getElementById("description").innerHTML = weatherDescription.toUpperCase();
        document.getElementById("currentTemp").innerHTML = `${Math.round(temperature)}&deg`;
        document.getElementById("weatherIcon").src = `images/icons/${icon}.png`;
        document.getElementById("uvi").innerHTML =  `UV Index: ${uvi}`;
        document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`;
        document.getElementById("wind").innerHTML = `Wind: ${Math.round(windSpeed)} mph`;

        // render the forecast tabs
        document.getElementById("hourlyForecast").innerHTML = renderHourlyForecast(data.hourly)
        document.getElementById("dailyForecast").innerHTML = renderDailyForecast(data.daily)

    })

    .catch(err =>{
        throw(`Sorry, an error ocurred. ${err}`);
    })


    }
    
    //render hourly forecast
function renderHourlyForecast(forecastData){
        var tableHTML = '<tr><th>Hour</th><th>Temperature</th><th>UVI</th></tr>'
        console.log(forecastData)
        for(let i = 0; i < 8;i++){
            //dislpay the time, temperature and UVI
                // get the timestamp from the unix provided
            var ts = new Date(forecastData[i].dt * 1000)
            // declare variables to use  from forecastData ( hour, temperature, UVI )
            var hour = ts.getHours()
            if(hour != 0 ){
                var hourString = `${hour}:00 am`;
            }else{
                var hourString = `12:00 am`
            }
            
            if((hour % 12) > 1){
                hourString = `${hour-12}:00 pm`
            }
            var temperature = forecastData[i].temp;
            var uvi = forecastData[i].uvi;
            //add row to tableHTML
            tableHTML += renderHourlyRow(hourString,temperature,uvi)
        }
        return tableHTML;
}

    //render daily forecast
function renderDailyForecast(forecastData){
    console.log(forecastData)
    var tableHTML = `<tr><th>Date</th><th>Hi</th><th>Low</th><th>Description</th></tr>`
    for(let i = 0 ; i < 8 ; i++){
        // extract date, hi and low temp, description
            //extract ts from forecastData
        var ts = new Date(forecastData[i].dt * 1000)
        
        var date = `${wMonth[ts.getMonth()]} ${ts.getDate()}` 
        var hi = forecastData[i].temp.max
        var low = forecastData[i].temp.min
        var description = forecastData[i].weather[0].main
        
        tableHTML += renderDailyRow(date,hi,low,description)
    }
    return tableHTML
}




function renderHourlyRow(a,b,c){
    return `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`
}

function renderDailyRow(date,hi,low,desc){
    return `<tr><td>${date}</td><td>${Math.round(hi)}</td><td>${Math.round(low)}</td><td>${desc}</td></tr>`
}