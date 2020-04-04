const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const clientPath = path.join(__dirname, "../client");
const app = express();

const port = process.env.PORT || 5000;
// serves up the public folder
app.use(express.static(clientPath));

app.listen(port, () => {
  console.log("serve is up and running");
});
