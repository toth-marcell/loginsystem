function login() {
  submitAuthForm("login");
}

function register() {
  submitAuthForm("register");
}

async function submitAuthForm(action) {
  const loginForm = document.getElementById("loginForm");
  const formData = new FormData(loginForm);
  const result = await fetch(`/api/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const msg = document.getElementById("msg");
  if (result.ok) {
    msg.className = "msg-success";
    loginForm.reset();
  } else {
    msg.className = "msg-fail";
  }
  const data = await result.json();
  sessionStorage.setItem("token", data.token);
  msg.innerText = data.msg;
  checkToken();
}

async function getSecret(name) {
  const result = await fetch(`/api/${name}`, {
    headers: {
      authorization: sessionStorage.getItem("token"),
    },
  });
  document.getElementById("secretMsg").innerText = (await result.json()).msg;
}

async function getUsers() {
  const usersList = document.getElementById("usersList");
  const users = await fetch("/api/users").then((r) => r.json());
  usersList.innerHTML = "";
  for (const user of users) {
    const item = document.createElement("li");
    item.innerText = `${user.id}\t${user.name}`;
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", async (e) => {
      const result = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
      }).then((r) => r.json());
      getUsers();
      alert(result.msg);
    });
    deleteButton.innerText = "🗑️";
    item.appendChild(deleteButton);
    usersList.appendChild(item);
  }
}

function checkToken() {
  if (sessionStorage.getItem("token")) {
    for (const elem of document.getElementsByClassName("loggedInOnly")) {
      elem.style.display = "block";
    }
  } else {
    for (const elem of document.getElementsByClassName("loggedInOnly")) {
      elem.style.display = "none";
    }
  }
}
checkToken();

async function createSubject() {
  const name = document.getElementById("newSubjectName").value;
  const result = await fetch("/api/subject", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
      authorization: sessionStorage.getItem("token"),
    },
  }).then((r) => r.json());
  alert(result.msg || "Siker!");
}

async function getSubjects() {
  const subjectList = document.getElementById("subjectList");
  const subjects = await fetch("/api/subject").then((r) => r.json());
  subjectList.innerHTML = "";
  for (const subject of subjects) {
    const item = document.createElement("li");
    item.innerText = `${subject.id}\t${subject.name}`;
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", async (e) => {
      const result = await fetch(`/api/subject/${subject.id}`, {
        method: "DELETE",
        headers: {
          authorization: sessionStorage.getItem("token"),
        },
      }).then((r) => r.json());
      getSubjects();
      alert(result.msg);
    });
    deleteButton.innerText = "🗑️";
    item.appendChild(deleteButton);
    subjectList.appendChild(item);
  }
}
getSubjects();
