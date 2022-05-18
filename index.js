// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
const { request } = require("express");
const { response } = require("express");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// mounting date parsing
app.use("/api/:reqInput", parseInput);
app.get("/api/:reqInput", returnDateObj);
//empty parameter should just report current date
app.get("/api/", returnCurrentDate);

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// listen for requests :)
//var listener = app.listen(3000, function () {
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

/**
 * Middleware. Parse input (timestamp or date) to object.
 * Add parsed object to request as parsedDate
 *
 * @param {request}   req     standard request object
 * @param {response}  res     standard response object
 * @param {next}      next    call next middleware in line
 *
 * @return None
 */
function parseInput(req, res, next) {
  let reqInput = req.params.reqInput.toString();
  let parsedDate =
    reqInput.match(/^[0-9]*$/) === null
      ? new Date(reqInput)
      : new Date(+reqInput);

  req.parsedDate = isNaN(parsedDate)
    ? {
        error: "Invalid Date",
      }
    : {
        unix: parsedDate.getTime(),
        utc: parsedDate.toUTCString(),
      };

  next();
}

function returnDateObj(req, res) {
  res.json(req.parsedDate);
}

function returnCurrentDate(req, res) {
  let dateNow = Date.now();
  res.json({
    unix: dateNow,
    utc: new Date(dateNow).toUTCString(),
  });
}
