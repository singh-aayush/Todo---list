const input = document.getElementById("add-event");
const listContainer = document.getElementById("list-items");
const allList = document.getElementById("todo-lists");

let span;

function addEvent() {
  if (input.value === "") {
    alert("Please Enter any event");
  } else {
    const li = document.createElement("li");
    li.innerHTML = input.value;
    allList.appendChild(li);
    span = document.createElement("span");
    span.innerHTML = "&#10247";
    li.appendChild(span);
    saveData();
  }
  input.value = "";
  saveData();
}

allList.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      spanClick(e.target);
    }
  },
  false
);

function spanClick(span) {
  let editButton = span.querySelector(".span-button-edit");
  let deleteButton = span.querySelector(".span-button-delete");
  if (editButton && deleteButton) {
    editButton.classList.toggle("hidden");
    deleteButton.classList.toggle("hidden");
    saveData();
  } else {
    editButton = document.createElement("button");
    deleteButton = document.createElement("button");
    editButton.innerText = "Edit";
    deleteButton.innerText = "Delete";
    editButton.classList.add("span-button-edit");
    deleteButton.classList.add("span-button-delete");

    span.appendChild(editButton);
    span.appendChild(deleteButton);
    saveData();

    deleteButton.addEventListener("click", () => {
      const li = span.parentElement;
      // console.log("click");
      li.remove();
      saveData();
    });

    editButton.addEventListener("click", () => {
      const li = span.parentElement;
      const existInput = li.querySelector("input");
      if (existInput) return;
      const currentValue = li.firstChild.textContent.trim();

      const input = document.createElement("input");
      input.classList.add("text-input");
      input.type = "text";
      input.value = currentValue;

      li.firstChild.textContent = "";
      li.insertBefore(input, span);

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const newValue = input.value.trim();
          if (newValue) {
            li.firstChild.textContent = input.value;
            saveData();
          }
          input.remove();
          editButton.classList.toggle("hidden");
          deleteButton.classList.toggle("hidden");
          saveData();
        }
      });
    });
  }
}

function saveData() {
  localStorage.setItem("data", allList.innerHTML);
}

function getData() {
  const savedData = localStorage.getItem("data");
  if (savedData) {
    allList.innerHTML = savedData;

    // Reattach click listeners for dynamically loaded elements
    allList.querySelectorAll("span").forEach((span) => {
      span.addEventListener("click", (e) => {
        if (e.target.tagName === "SPAN") {
          spanClick(e.target);
        }
      });
    });
  }
}

getData();

const search = document.getElementById("todo-search");

search.addEventListener("input", (e) => {
  searchTodo(e.target.value);
});

function searchTodo(query) {
  const allTodos = Array.from(allList.querySelectorAll("li"));

  const lowerCaseQuery = query.toLowerCase().trim();

  allTodos.forEach((e) => {
    const text = e.textContent.toLowerCase();
    if (text.includes(lowerCaseQuery)) {
      e.style.display = "";
    } else {
      e.style.display = "none";
    }
  });
}
