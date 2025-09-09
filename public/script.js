async function login() {
  const loginForm = document.getElementById("loginForm");
  const formData = new FormData(loginForm);
  const result = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const msg = document.getElementById("msg");
  if (result.ok) {
    msg.className = "msg-success";
  } else {
    msg.className = "msg-fail";
  }
  msg.innerText = (await result.json()).msg;
  loginForm.reset();
}
