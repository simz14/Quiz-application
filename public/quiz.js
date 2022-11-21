"use strict";
const createQuestion = (data) => {
  const body = document.querySelector("body");
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  const questionTitle = document.createElement("h2");
  questionTitle.className = "questionTitle";
  questionTitle.innerText = data.question;
  wrapper.appendChild(questionTitle);

  for (let i = 0; i < 4; i++) {
    const answer = document.createElement("li");
    answer.className = "answer";
    answer.innerText = data.answers[i].answer;
    answer.dataset.id = data.answers[i].id;

    wrapper.appendChild(answer);
  }

  const manageLink = document.createElement("a");
  manageLink.href = "/manageLink";
  manageLink.innerText = "Manage Link";
  wrapper.appendChild(manageLink);

  body.appendChild(wrapper);
};
const checkAnswer = (data) => {
  const answers = document.querySelectorAll(".answer");
  const dataAnswers = data.answers;

  answers.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      dataAnswers.forEach((dataAnswer) => {
        if (answer.dataset.id == dataAnswer.id) {
          if (dataAnswer.is_correct) {
            const rightAnswer = document.querySelector(
              `[data-id="${answer.dataset.id}"]`
            );
            rightAnswer.style.backgroundColor = "green";
          }
        }
      });
    });
  });
};

//---------------------------------------------------------
async function apiHandler() {
  const data = await fetch("/api/game")
    .then((res) => res.json())
    .catch((err) => err);

  createQuestion(data);
  checkAnswer(data);
}
apiHandler();
