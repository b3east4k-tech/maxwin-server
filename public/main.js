const modal = document.getElementById("authModal");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const email = document.getElementById("email");
const confirmPassword = document.getElementById("confirmPassword");
const currency = document.getElementById("currency");
const language = document.getElementById("language");
const submitBtn = document.getElementById("submitBtn");
const errorBox = document.getElementById("errorBox");

let mode = "login";

loginTab.onclick = () => {
  mode = "login";
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  document.querySelectorAll(".register-only").forEach(el => el.classList.add("hidden"));
  submitBtn.textContent = "Login";
};

registerTab.onclick = () => {
  mode = "register";
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  document.querySelectorAll(".register-only").forEach(el => el.classList.remove("hidden"));
  submitBtn.textContent = "Create Account";
};

document.getElementById("authForm").onsubmit = async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (mode === "register") {
    if (password !== confirmPassword.value) {
      errorBox.textContent = "Passwords do not match";
      errorBox.classList.remove("hidden");
      return;
    }
  }

  const response = await fetch(`https://maxwin-server.onrender.com/${mode}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username,
      password,
      email: email.value,
      currency: currency.value,
      language: language.value
    })
  });

  const data = await response.json();

  if (!data.success) {
    errorBox.textContent = data.message;
    errorBox.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
    location.reload();
  }
};