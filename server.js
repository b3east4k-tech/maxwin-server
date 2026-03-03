const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// отдаём фронтенд
app.use(express.static("public"));

let users = {};

// Регистрация
app.post("/register", (req, res) => {
    const { username } = req.body;
    if (!username) return res.json({ error: "No username" });
    if (users[username]) return res.json({ error: "User already exists" });
    users[username] = { balance: 100 };
    res.json({ success: true, balance: 100 });
});

// Логин
app.post("/login", (req, res) => {
    const { username } = req.body;
    if (!users[username]) return res.json({ error: "User not found" });
    res.json({ success: true, balance: users[username].balance });
});

// Спин
app.post("/spin", (req, res) => {
    const { username } = req.body;
    if (!users[username]) return res.json({ error: "User not found" });
    if (users[username].balance < 10) return res.json({ error: "Not enough coins" });

    users[username].balance -= 10;
    const symbols = ["??","??","?","7??"];
    const s1 = symbols[Math.floor(Math.random()*4)];
    const s2 = symbols[Math.floor(Math.random()*4)];
    const s3 = symbols[Math.floor(Math.random()*4)];
    let win = 0;
    if (s1===s2 && s2===s3) {
        win = 50;
        users[username].balance += win;
    }

    res.json({ result:[s1,s2,s3], win, balance: users[username].balance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));