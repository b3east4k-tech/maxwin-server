document.addEventListener("DOMContentLoaded", () => {

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

  loginTab.onclick = () => { mode = "login"; submitBtn.textContent = "Login"; document.querySelectorAll(".register-only").forEach(el => el.classList.add("hidden")); modal.classList.remove("hidden"); }
  registerTab.onclick = () => { mode = "register"; submitBtn.textContent = "Create Account"; document.querySelectorAll(".register-only").forEach(el => el.classList.remove("hidden")); modal.classList.remove("hidden"); }
  modalClose.onclick = () => modal.classList.add("hidden");

  authForm.onsubmit = async (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const email = document.getElementById("email")?.value;
    const currency = document.getElementById("currency")?.value;
    const language = document.getElementById("language")?.value;

    if(mode === "register" && password !== confirmPassword){
      errorBox.textContent = "Passwords do not match"; errorBox.classList.remove("hidden"); return;
    }

    const response = await fetch(`/${mode}`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username,password,email,currency,language})
    });
    const data = await response.json();
    if(!data.success){ errorBox.textContent = data.message; errorBox.classList.remove("hidden"); }
    else {
      currentUser = data.user;
      modal.classList.add("hidden");
      userInfo.textContent = `${currentUser.username} | ID:${currentUser.id} | Balance:${currentUser.balance}`;
    }
  }

  // Turbo Mines (минимальный)
  const startGameBtn = document.getElementById("startGame");
  const minesField = document.getElementById("minesField");
  const winInfo = document.getElementById("winInfo");

  startGameBtn.onclick = () => {
    if(!currentUser){ alert("Login first!"); return; }
    minesField.innerHTML = "";
    winInfo.textContent = "";
    const cells = 16; const mines = 3;
    const mineIndexes = [];
    while(mineIndexes.length < mines){ const r = Math.floor(Math.random()*cells); if(!mineIndexes.includes(r)) mineIndexes.push(r); }
    for(let i=0;i<cells;i++){
      const btn = document.createElement("button");
      btn.textContent = "?"; btn.style.margin="3px"; btn.style.width="50px"; btn.style.height="50px";
      btn.onclick = () => {
        if(mineIndexes.includes(i)){ btn.style.background="red"; winInfo.textContent="You hit a mine!"; disableField(); }
        else{ btn.style.background="green"; btn.textContent="?"; }
      }
      minesField.appendChild(btn);
    }

    function disableField(){ Array.from(minesField.children).forEach(b=>b.disabled=true); }
  }

});