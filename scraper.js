var fs = require("fs"),
    csv = require("json2csv"),
    xray = require("x-ray"),
    x = xray(),
    site = "http://www.shirts4mike.com/shirts.php",
    fields = ["title", "price", "imageUrl", "shirtUrl", "time"];
var date = new Date();
var currentHour = date.getHours();
var currentMinute = date.getMinutes();
var currentSecond = date.getSeconds();
var currentTime = currentHour + ":" + currentMinute + ":" + currentSecond;
var fileDate = date.toString().slice(0, 10);

fs.mkdir("./data", error => {
    x(site, "li",
        [{
            shirtUrl: "a@href",
            imageUrl: x("img@src"),
            title: x("a@href", "title"),
            price: x("a@href", "span.price")
        }])(function (error, object) {
            if (!error) {
                var shirts = object.slice(3, 11);
                for (let i = 0; i < shirts.length; i++) {
                    shirts[i].time = currentTime;
                }
                var jsoncsv = csv({ data: shirts, fields: fields });
                let csvFile = "./data/" + fileDate + ".csv";
                fs.writeFile(csvFile, jsoncsv, function (err) {
                    if (err) throw err;
                    console.log("Data folder has been created, and the data has been stored.");
                });
            }
            else {
                let errorDate = date.toString();
                let errorData = "[" + errorDate + "] " + " Error code - " + error.statusCode + " | " + error.stack + "\r\n \r\n";
                fs.appendFile("./scraper-error.log", errorData, () => {
                    console.log("There was an error! Please check the log for error details.");
                });
            }
        });
    });
            
   