const path = require("path");
const express = require("express");
const clientPath = path.join(__dirname, "../client");
const port = process.env.PORT || 3000;
const app = express();
// serves up the public folder
app.use(express.static(clientPath));

app.listen(port, () => {
  console.log("serve is up and running");
});
