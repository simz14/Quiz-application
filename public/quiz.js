"use strict";
const wrapper = document.getElementById("wrapper");
let counter = 0;

//CREATING HTML QUESTION
const createQuestion = (data) => {
  const questionWrapper = document.createElement("div");
  questionWrapper.id = "questionWrapper";
  const questionTitle = document.createElement("h2");
  questionTitle.className = "questionTitle";
  questionTitle.innerText = data.question;
  questionWrapper.appendChild(questionTitle);

  const answerWrapper = document.createElement("div");
  answerWrapper.className = "answerWrapper";
  for (let i = 0; i < 4; i++) {
    const answer = document.createElement("div");
    answer.className = "answer";
    answer.innerText = data.answers[i].answer;
    answer.dataset.id = data.answers[i].id;
    answerWrapper.appendChild(answer);
    questionWrapper.appendChild(answerWrapper);
  }

  const manageLink = document.createElement("a");
  manageLink.href = "/questions";
  manageLink.innerText = "Manage Questions";
  manageLink.className = "link";

  questionWrapper.appendChild(manageLink);
  wrapper.appendChild(questionWrapper);
};
const getNewxtQuestion = () => {
  const questionWrapper = document.getElementById("questionWrapper");
  const nextQuestionButton = document.createElement("button");
  nextQuestionButton.innerText = "Next Question";
  nextQuestionButton.id = "nextQuestion";
  questionWrapper.appendChild(nextQuestionButton);

  nextQuestionButton.addEventListener("click", (e) => {
    clearWrapper();
    apiHandler();
  });
};

const clearWrapper = () => {
  const childs = document.getElementById("questionWrapper");
  childs.remove();
};

const checkAnswer = (data) => {
  const answers = document.querySelectorAll(".answer");
  const dataAnswers = data.answers;
  const score = document.getElementById("counter");

  answers.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      dataAnswers.forEach((dataAnswer) => {
        if (answer.dataset.id == dataAnswer.id) {
          if (dataAnswer.is_correct) {
            const rightAnswer = document.querySelector(
              `[data-id="${answer.dataset.id}"]`
            );
            counter++;
            score.innerText = counter;
            getNewxtQuestion();
            rightAnswer.classList.add("success");
          } else {
            const wrongAnswer = document.querySelector(
              `[data-id="${answer.dataset.id}"]`
            );
            wrongAnswer.classList.add("wrong");
          }
        }
      });
    });
  });
};

//---------------------------------------------------------
const apiHandler = async () => {
  const data = await fetch("/api/game")
    .then((res) => res.json())
    .catch((err) => err);

  createQuestion(data);
  checkAnswer(data);
};
apiHandler();
