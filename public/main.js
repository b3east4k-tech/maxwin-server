document.addEventListener("DOMContentLoaded", () => {

  // Модалка и элементы
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const modal = document.getElementById("authModal");
  const modalClose = document.getElementById("modalClose");
  const authForm = document.getElementById("authForm");
  const submitBtn = document.getElementById("submitBtn");
  const errorBox = document.getElementById("errorBox");
  const userInfo = document.getElementById("userInfo");

  let mode = "login";
  let currentUser = null;
  const users = []; // простая база пользователей для демо

  // Открытие модалки
  loginTab.onclick = () => {
    mode = "login";
    submitBtn.textContent = "Login";
    document.querySelectorAll(".register-only").forEach(el => el.classList.add("hidden"));
    modal.classList.remove("hidden");
    document.getElementById("modalTitle").textContent = "Login";
  }

  registerTab.onclick = () => {
    mode = "register";
    submitBtn.textContent = "Create Account";
    document.querySelectorAll(".register-only").forEach(el => el.classList.remove("hidden"));
    modal.classList.remove("hidden");
    document.getElementById("modalTitle").textContent = "Register";
  }

  // Закрытие модалки
  modalClose.onclick = () => modal.classList.add("hidden");
  window.onclick = (e) => { if(e.target === modal) modal.classList.add("hidden"); }

  // Login / Register
  authForm.onsubmit = (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const email = document.getElementById("email")?.value;
    const currency = document.getElementById("currency")?.value;
    const language = document.getElementById("language")?.value;

    if(mode==="register"){
      if(password !== confirmPassword){ 
        errorBox.textContent = "Passwords do not match"; 
        errorBox.classList.remove("hidden"); 
        return;
      }
      if(users.find(u=>u.username===username)){
        errorBox.textContent = "Username already exists"; 
        errorBox.classList.remove("hidden"); 
        return;
      }
      const user = {id:users.length+1, username, password, email, currency, language, balance:1000};
      users.push(user);
      currentUser = user;
    } else { // login
      const user = users.find(u=>u.username===username && u.password===password);
      if(!user){ 
        errorBox.textContent = "Invalid credentials"; 
        errorBox.classList.remove("hidden"); 
        return;
      }
      currentUser = user;
    }

    modal.classList.add("hidden"); // ? закрытие
    userInfo.textContent = `${currentUser.username} | ID:${currentUser.id} | Balance:${currentUser.balance}`;
  }

  // Пример игры Turbo Mines
  const startGameBtn = document.getElementById("startGame");
  const minesField = document.getElementById("minesField");
  const winInfo = document.getElementById("winInfo");

  startGameBtn.onclick = () => {
    if(!currentUser){ alert("Login first!"); return; }
    minesField.innerHTML = "";
    winInfo.textContent = "";
    const cells = 16; const mines = 3;
    const mineIndexes = [];
    while(mineIndexes.length < mines){ 
      const r = Math.floor(Math.random()*cells); 
      if(!mineIndexes.includes(r)) mineIndexes.push(r); 
    }
    for(let i=0;i<cells;i++){
      const btn = document.createElement("button");
      btn.textContent = "?"; 
      btn.style.margin="3px"; 
      btn.style.width="50px"; 
      btn.style.height="50px";
      btn.onclick = () => {
        if(mineIndexes.includes(i)){ 
          btn.style.background="red"; 
          winInfo.textContent="You hit a mine!"; 
          Array.from(minesField.children).forEach(b=>b.disabled=true); 
        }
        else{ 
          btn.style.background="green"; 
          btn.textContent="?"; 
        }
      }
      minesField.appendChild(btn);
    }
  }

});