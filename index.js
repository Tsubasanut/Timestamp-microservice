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

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// listen for requests :)
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
  let reqInput = req.params.reqInput;
  let parsedDate;
  if (reqInput.match(/^[0-9]*$/) === null) {
    //it's a date
    parsedDate = new Date(reqInput);
  } else {
    //it's a timestamp
    parsedDate = new Date(+reqInput);
  }

  req.parsedDate = {
    unix: parsedDate.getTime(),
    utc: parsedDate,
  };
  next();
}

function returnDateObj(req, res) {
  res.json(req.parsedDate);
}
