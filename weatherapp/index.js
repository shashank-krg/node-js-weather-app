const http = require("http");
const fs = require("fs");
var requests = require("requests");
const hostname = '127.0.0.1';
const port = 3000;

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal ,orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].country);

     return temperature;
};

const server = http.createServer((req,res) =>{
    if(req.url === "/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Bhubaneshwar&units=metric&appid=a0662c9920cb0955cf44b4ed0bda5fbe")
        .on("data",(chunk) =>{
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];

            const realTimeData = arrData
            .map(val => replaceVal(homeFile,val))
            .join("");
            res.write(realTimeData);
            //console.log(realTimeData);
            })
        .on("end",(err)=>{
            if(err) return console.log("Connection closed due to errors",err);
            res.end();
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });