const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const path = require("path");
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
