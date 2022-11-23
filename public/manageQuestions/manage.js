"use strict";
const body = document.querySelector("body");
//THIS PART CREATES THE HTML FOR DELETE
const createDeleteElements = (data) => {
  const manageWrapper = document.createElement("div");
  manageWrapper.className = "manageWrapper";
  const deleteWrapper = document.createElement("div");
  deleteWrapper.id = "deleteWrapper";

  data.forEach((question) => {
    const questionTitle = document.createElement("div");
    questionTitle.className = "questionTitle";
    questionTitle.innerText = question.question;
    questionTitle.dataset.id = question.id;

    const deletButton = document.createElement("button");
    deletButton.innerText = "Delete";
    questionTitle.appendChild(deletButton);

    deleteWrapper.appendChild(questionTitle);
  });
  manageWrapper.appendChild(deleteWrapper);
  body.appendChild(manageWrapper);
};
//TTHIS PART DELETES THE SELECTED QUESTION
const deleteQuestion = () => {
  const questionsButtons = document.querySelectorAll(".questionTitle>button");
  questionsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = Number(button.parentElement.dataset.id);
      let confirmBoolean = false;
      if (confirm("Are you sure?") === true) {
        confirmBoolean = true;
      }
      if (confirmBoolean === true) {
        deleteHandler(id);
        button.parentElement.remove();
      }
    });
  });
};

const createQuestions = () => {
  const createWrapper = document.createElement("div");
  createWrapper.className = "createWrapper";
  const inputFields = document.createElement("div");
  inputFields.className = "inputFields";

  const createInputField = (name, placeholder, classname) => {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.className = "fieldWrapper";
    name.setAttribute("type", "text");
    name.placeholder = placeholder;
    name.className = classname;
    name.dataset.type = "input";
    const rightAnswer = document.createElement("input");
    rightAnswer.setAttribute("type", "radio");
    rightAnswer.name = "is_correct";

    fieldWrapper.appendChild(name);
    fieldWrapper.appendChild(rightAnswer);
    inputFields.appendChild(fieldWrapper);
  };
  const question = document.createElement("input");
  createInputField(question, "Type your question here", "inputQuestion");
  const answer1 = document.createElement("input");
  createInputField(answer1, "Type your answear here", "inputAnswer");

  const answer2 = document.createElement("input");
  createInputField(answer2, "Type your answear here", "inputAnswer");
  const answer3 = document.createElement("input");
  createInputField(answer3, "Type your answear here", "inputAnswer");
  const answer4 = document.createElement("input");
  createInputField(answer4, "Type your answear here", "inputAnswer");
  const submitButton = document.createElement("button");
  submitButton.id = "submitB";
  submitButton.innerText = "Submit";

  submitButton.addEventListener("click", (e) => {
    sendInputValues();
  });

  inputFields.appendChild(submitButton);
  createWrapper.appendChild(inputFields);
  body.appendChild(createWrapper);
  const link = document.createElement("a");
  link.href = "/game";
  link.innerText = "Back to quiz";
  link.className = "link";
  body.appendChild(link);
};

const sendInputValues = async () => {
  const answerObjects = await getAnswerValues().then((res) => res);
  const question = document.querySelector(".inputQuestion");
  postApiHandler(question.value, answerObjects);
};

const getAnswerValues = () => {
  const answers = document.querySelectorAll(".inputAnswer");
  const promiseForAnswers = new Promise((res, rej) => {
    document.querySelectorAll(".inputAnswer");
    let answersToSend = [];
    answers.forEach((answer) => {
      if (answer.nextElementSibling.checked) {
        answersToSend.push({
          answer: answer.value,
          is_correct: 1,
        });
      }
      if (!answer.nextElementSibling.checked) {
        answersToSend.push({
          answer: answer.value,
          is_correct: 0,
        });
      }

      res(answersToSend);
    });
    console.log(answersToSend);
  });
  return promiseForAnswers;
};

//THIS PART WORKS WITH DELETE API
const deleteHandler = (id) => {
  fetch(`/api/questions/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => err);
};

const postApiHandler = (question, answers) => {
  fetch("/api/questions", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      question: question,
      answers: answers,
    }),
  });
};
//THIS PART CREATES AND CALLS FUNCTIONS FOR HTML ELEMENT
const apiHandler = async () => {
  const data = await fetch("/api/questions")
    .then((res) => res.json())
    .catch((err) => err);
  createDeleteElements(data);
  deleteQuestion();
  createQuestions();
};
apiHandler();
