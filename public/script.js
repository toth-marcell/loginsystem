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
  msg.innerText = (await result.json()).msg;
}

async function getSecret() {
  const result = await fetch("/api/getSecret", {
    headers: {
      authorization: "titok",
    },
  });
  console.log(await result.json());
}
