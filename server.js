"use strict";
var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const path = require("path");
const port = 3000;
app.use(express.static("public"));
app.use(express.static("public/manageQuestions"));
//--------------------------------express set up
let mysql = require("mysql");
const { Console } = require("console");

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

app.get("/questions", (req, res) => {
  res.sendFile(path.join(__dirname, "public/manageQuestions/manage.html"));
});

app.get("/api/game", (req, res) => {
  const questionResponse = new Promise((res, rej) => {
    const getQuestion = `SELECT * FROM quiz_app.questions ORDER BY RAND() LIMIT 1`;
    conn.query(getQuestion, (err, rows) => {
      if (err) rej(err);
      res(rows[0]);
    });
  });
  const answerFunction = (id) => {
    const answersResponse = new Promise((res, rej) => {
      const getAnswers = `SELECT * FROM quiz_app.answers WHERE question_id=${id}`;
      conn.query(getAnswers, (err, rows) => {
        if (err) rej(err);
        res(rows);
      });
    });
    return answersResponse;
  };

  const apiHandler = async () => {
    const question = await questionResponse
      .then((response) => response)
      .catch((err) => console.log(err));

    const answers = await answerFunction(question.id)
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

app.delete("/api/questions/:id", (req, res) => {
  const id = req.params.id;
  conn.query(`DELETE FROM questions where id=${id}`);
  conn.query(`DELETE FROM answers WHERE question_id=${id}`);
  res.sendStatus(200);
});

app.post("/api/questions", (req, res) => {
  const question = req.body.question;
  const answer = req.body.answers;
  console.log(req.body.answers);
  const insertQPromise = new Promise((res, rej) => {
    conn.query(
      `INSERT INTO questions(question) VALUES("${question}")`,
      (err, row) => {
        if (err) {
          rej(404);
        }
        res(200);
      }
    );
  });
  const getIdPromise = new Promise((res, rej) => {
    conn.query(
      `SELECT id FROM questions WHERE question = "${question}"`,
      (err, row) => {
        if (err) {
          rej(404);
        }
        res(row);
      }
    );
  });

  const apiHandler = async () => {
    const insertQ = await insertQPromise.then((res) => res).catch((err) => err);
    console.log(insertQ);
    const insertA = await getIdPromise.then((res) => res).catch((err) => err);

    answer.forEach((answer) => {
      conn.query(
        `INSERT INTO answers(question_id,answer,is_correct) VALUES(${insertA[0].id},"${answer.answer}",${answer.is_correct})`
      );
    });
    res.sendStatus(200);
  };
  apiHandler();
});

app.listen(port, () => {
  console.log(`The server is up and running on ${port}`);
});
