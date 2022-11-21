"use strict";

//THIS PART CREATES THE HTML FOR DELETE
const createDeleteElements = (data) => {
  const body = document.querySelector("body");
  const manageWrapper = document.createElement("div");
  manageWrapper.className = "manageWrapper";

  data.forEach((question) => {
    const questionTitle = document.createElement("div");
    questionTitle.className = "questionTitle";
    questionTitle.innerText = question.question;
    questionTitle.dataset.id = question.id;

    const deletButton = document.createElement("button");
    deletButton.innerText = "Delete";
    questionTitle.appendChild(deletButton);
    manageWrapper.appendChild(questionTitle);
  });
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
  const body = document.querySelector("body");
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

  body.appendChild(createWrapper);
};
/*const getInputValues = () => {
  const inputs = document.querySelectorAll("[data-type=input]");
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      if ((input.className = "inputQuestion")) {
        const question = e.target.value;
      }
    });
  });
};*/

//THIS PART WORKS WITH DELETE API
const deleteHandler = (id) => {
  fetch(`/api/questions/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => err);
};

//THIS PART CREATES AND CALLS FUNCTIONS FOR HTML ELEMENT
async function apiHandler() {
  const data = await fetch("/api/questions")
    .then((res) => res.json())
    .catch((err) => err);
  console.log(data);
  createDeleteElements(data);
  deleteQuestion();
  createQuestions();
  getInputValues();
}
apiHandler();
