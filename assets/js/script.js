var apiKey = "c85343839e20a6288d7fb1e42e990e57";
var searchedCities = [];

var displayForecast = function (data) {
  console.log(data);
  $("#forecast").html("");
  var cardEl = $("<div>").addClass("card");
  var titleEl = $("<h2>").addClass("card-title").text(data.name);
  var bodyEl = $("<div>").addClass("card-body").attr("id", "cardBody");
  var tempEl = $("<p>")
    .addClass("card-text")
    .text("Temperature: " + data.main.temp + "°F");
  var humidityEl = $("<p>")
    .addClass("card-text")
    .text("Humidity: " + data.main.humidity + "%");
  var windSpeedEl = $("<p>")
    .addClass("card-text")
    .text("Wind Speed: " + data.wind.speed + "MPH");
    var weatherIcon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );
  titleEl.append(weatherIcon);
  cardEl.append(titleEl);
  bodyEl.append(tempEl);
  bodyEl.append(humidityEl);
  bodyEl.append(windSpeedEl);
  cardEl.append(bodyEl);
  $("#forecast").append(cardEl);
  getUvIndex(data.coord.lat, data.coord.lon);
  fiveDayForecast(data.name);

  saveSearch()
};



var getUvIndex = function (lat, lon) {
  var uvApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(uvApi)
    .then((res) => res.json())
    .then((data) => {
      var uviEl = $("<p>")
        .addClass("card-text")
        .text("UV Index: " + data.current.uvi);
      $("#cardBody").append(uviEl);
      console.log(data);
      saveSearch()
    });
    
};

var fiveDayForecast = function (cityName) {
  var weatherApi = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;
  fetch(weatherApi)
    .then((res) => res.json())
    .then((data) => {
      /*$("#forecast").html("")*/
      
      console.log(data);
      for (let i = 0; i < data.list.length; i = i + 8) {
        var headerEl = $("<p>").addClass("five-day-title").text("5 Day Forecast:")
        var titleEl = $("<p>").addClass("card-title").text(moment().format("MM/DD/YYYY"));
        var cardEl = $("<div>").addClass("card col-md-2").attr("id", "five-day");
        var bodyEl = $("<div>").addClass("card-body");
        var tempEl = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + data.list[i].main.temp + "°F");
        var humidityEl = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + data.list[i].main.humidity + "%");
        var windSpeedEl = $("<p>")
          .addClass("card-text")
          .text("Wind Speed: " + data.list[i].wind.speed + "MPH");
          var weatherIcon = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
          );
      
        
        titleEl.append(weatherIcon)
        cardEl.append(bodyEl);
        bodyEl.append(titleEl);
        bodyEl.append(tempEl);
        bodyEl.append(humidityEl);
        bodyEl.append(windSpeedEl);

        $("#fiveDayForecast").append(cardEl);
      }
      saveSearch()
    });
    
};
var getCityForecast = function () {
  var cityName = $("#city-name").val();
  var weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(weatherApi)
  
    .then(function (response) {
      // when button clicked, specific city's forecast displays
      if (response.ok) {
        return response.json();
      } else {
        alert("Please enter valid city name.");
      }
    })
    
    .then(function (data) {
      // pass response data to dom function
      displayForecast(data, cityName);
      searchedCities.push(data);
      
    });

  var cityBtnEl = $("<button>").addClass("btn btn-secondary btn-block").text(cityName);
  $("#searched-cities").append(cityBtnEl).on("click", loadSavedSearch);

  saveSearch()
};

var saveSearch = function () {
  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
};

var loadSavedSearch = function () {
  var cityName = $("#city-name").val();
    // get data from local storage
   var savedSearchedCities = localStorage.getItem("searchedCities")
    if (!savedSearchedCities) {
        return false 
    } 
    // turn into string JSON again 
    savedSearchedCities = JSON.parse(savedSearchedCities)
    console.log(savedSearchedCities)
    // make data to display on page again 
    // loop through savedTasks array
    for (var i = 0; i < savedSearchedCities.length; i++) {
    // pass each task object into the `createTaskEl()` function
    if (savedSearchedCities.name === cityName) {
    getCityForecast(savedSearchedCities.name);
    }
  }
}

$(".btn").on("click", getCityForecast);


