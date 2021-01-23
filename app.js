const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){

res.sendFile(__dirname + "/index.html");

})


app.post("/", function(req, res){

const query = req.body.cityName;
const apiKey = "66ff0f880f18b4fdecadb118d913575a";
const unit = "metric";
const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units=" + unit;

https.get(url, function(response) {
  console.log(response.statusCode);

  response.on("data", function(data) {

    const weatherData = JSON.parse(data)
    const temp = weatherData.main.temp
    const description = weatherData.weather[0].description
    const icon = weatherData.weather[0].icon
    const imageUrl = " http://openweathermap.org/img/wn/" +  icon + "@2x.png"
    res.write("<p>The Weather is Currently " + description + "<p>");
    res.write("<h1>The Tempreture in " + query + " is " + temp + " Degree Celcius.</h1> ")
    res.write("<img src=" + imageUrl + ">" );
    res.send()

     })
   })
});



app.listen(3000, function (){
  console.log("The Server is Working on Port 3000");
});
