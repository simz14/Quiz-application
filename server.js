"use strict";
var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const path = require("path");
const port = 3000;
app.use(express.static("public"));
//--------------------------------express set up
let mysql = require("mysql");

let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "quiz_app",
});
conn.connect((err) => {
  if (err) {
    console.error("Cannot connect to the database", err);
    return;
  }
  console.log("Connection established");
});
//--------------------------------mysql set up

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/game", (req, res) => {
  let randomId = Math.floor(Math.random() * (11 - 1) + 1);
  const questionResponse = new Promise((res, rej) => {
    const getQuestion = `SELECT * FROM quiz_app.questions  WHERE id =${randomId}`;
    conn.query(getQuestion, (err, rows) => {
      if (err) rej(err);
      res(rows[0]);
    });
  });

  const answersResponse = new Promise((res, rej) => {
    const getAnswers = `SELECT * FROM quiz_app.answers WHERE question_id=${randomId}`;
    conn.query(getAnswers, (err, rows) => {
      if (err) rej(err);
      res(rows);
    });
  });

  const apiHandler = async () => {
    const question = await questionResponse
      .then((response) => response)
      .catch((err) => console.log(err));

    const answers = await answersResponse
      .then((response) => response)
      .catch((err) => console.log(err));

    res.json({ ...question, answers: answers });
  };
  apiHandler();
});
app.get("/api/questions", (req, res) => {
  const getQuestion = `SELECT * FROM quiz_app.questions`;
  conn.query(getQuestion, (err, rows) => {
    if (err) rej(err);
    res.send(rows);
  });
});

app.listen(port, () => {
  console.log(`The server is up and running on ${port}`);
});
