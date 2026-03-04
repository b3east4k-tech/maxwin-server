document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchUser = document.getElementById("searchUser");
  const userData = document.getElementById("userData");

  searchBtn.onclick = async () => {
    const query = searchUser.value.trim();
    if(!query){ alert("Enter ID, username or email"); return; }

    // Простейший поиск: сначала по ID
    let response = await fetch(`/admin/user/${query}`);
    let data = await response.json();

    // Если не нашли по ID, ищем по username/email
    if(!data.success){
      // Получаем всех пользователей (для теста)
      response = await fetch("/admin/users");
      const allUsers = await response.json();
      const user = allUsers.users.find(u => u.username===query || u.email===query);
      data = user ? {success:true, user} : {success:false};
    }

    if(!data.success){ userData.innerHTML="User not found"; return; }

    const u = data.user;
    userData.innerHTML = `
      <p><b>ID:</b> ${u.id}</p>
      <p><b>Username:</b> ${u.username}</p>
      <p><b>Email:</b> ${u.email}</p>
      <p><b>Currency:</b> ${u.currency}</p>
      <p><b>Language:</b> ${u.language}</p>
      <p><b>Balance:</b> $<span id="balanceVal">${u.balance}</span></p>
      <button id="addBalance">+100</button>
      <button id="subBalance">-100</button>
    `;

    document.getElementById("addBalance").onclick = async () => {
      const res = await fetch("/admin/update-balance", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:u.id, change:100})
      });
      const updated = await res.json();
      if(updated.success) document.getElementById("balanceVal").textContent = updated.user.balance;
    }

    document.getElementById("subBalance").onclick = async () => {
      const res = await fetch("/admin/update-balance", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:u.id, change:-100})
      });
      const updated = await res.json();
      if(updated.success) document.getElementById("balanceVal").textContent = updated.user.balance;
    }
  }
});