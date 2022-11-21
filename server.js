"use strict";
var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3000;

app.use(express.static("public"));
//res.sendFile(__dirname + "/index.html");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`The server is up and running on ${port}`);
});
