const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Загрузка пользователей из JSON
let users = [];
const dbFile = "users.json";
if (fs.existsSync(dbFile)) {
  users = JSON.parse(fs.readFileSync(dbFile));
}

// Сохранение в JSON
function saveUsers() {
  fs.writeFileSync(dbFile, JSON.stringify(users, null, 2));
}

// Регистрация
app.post("/register", (req, res) => {
  const { username, password, email, currency, language } = req.body;
  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "Username taken" });
  }
  const id = uuidv4();
  const newUser = { id, username, password, email, currency, language, balance: 0 };
  users.push(newUser);
  saveUsers();
  res.json({ success: true, user: newUser });
});

// Вход
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.json({ success: false, message: "Invalid credentials" });
  res.json({ success: true, user });
});

// Turbo Mines: пример API
app.post("/play/turbomines", (req, res) => {
  const { userId, cells, mines, bet } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) return res.json({ success: false, message: "User not found" });

  // Генерация мин
  let mineIndexes = [];
  while (mineIndexes.length < mines) {
    const r = Math.floor(Math.random() * cells);
    if (!mineIndexes.includes(r)) mineIndexes.push(r);
  }

  // Вернём поле и выигрыш (для примера)
  res.json({ success: true, mineIndexes, win: bet * (cells - mines) / cells });
});

// Админ: поиск пользователя по ID
app.get("/admin/user/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.json({ success: false, message: "User not found" });
  res.json({ success: true, user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Получить всех пользователей (для поиска по username/email)
app.get("/admin/users", (req,res)=>{
  res.json({success:true, users});
});

// Обновление баланса
app.post("/admin/update-balance", (req,res)=>{
  const {id, change} = req.body;
  const user = users.find(u=>u.id===id);
  if(!user) return res.json({success:false, message:"User not found"});
  user.balance += change;
  saveUsers();
  res.json({success:true, user});
});