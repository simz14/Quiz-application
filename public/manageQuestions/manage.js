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

  const createInputField = (name, placeholder, classname) => {
    name.setAttribute("type", "text");
    name.placeholder = placeholder;
    name.className = classname;
    name.dataset.type = "input";
    createWrapper.appendChild(name);
  };
  const question = document.createElement("input");
  createInputField(question, "Type your question here", "inputQuestion");
  const answer1 = document.createElement("input");
  createInputField(answer1, "Type your answear here", "inputAnwer1");
  const answer2 = document.createElement("input");
  createInputField(answer2, "Type your answear here", "inputAnwer2");
  const answer3 = document.createElement("input");
  createInputField(answer3, "Type your answear here", "inputAnwer3");
  const answer4 = document.createElement("input");
  createInputField(answer4, "Type your answear here", "inputAnwer4");
  const submitButton = document.createElement("button");
  submitButton.id = "submitB";
  submitButton.innerText = "Submit";

  submitButton.addEventListener("click", (e) => {
    alert("added");
    const result = () => {
      const sendBack = postApiHandler("mmmm", 1, "Mmmm", true);
      return sendBack;
    };
    console.log(result());
  });

  createWrapper.appendChild(submitButton);
  body.appendChild(createWrapper);
};
const getInputValues = () => {
  const inputs = document.querySelectorAll("[data-type=input]");
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const question = "";
      const answer = "";
      if ((input.className = "inputQuestion")) {
        question = e.target.value;
      }
      return question;
    });
  });
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

const postApiHandler = (question, question_id, answer, is_correct) => {
  fetch("/api/questions", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      question: question,
      answers: [
        { answer: answer, question_id: question_id, is_correct: is_correct },
        { answer: answer, question_id: question_id, is_correct: is_correct },
      ],
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
  getInputValues();
};
apiHandler();
