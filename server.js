const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const USER_FILE = path.join(__dirname, 'users.json');

// 初始化用户文件
function initUsers() {
  if (!fs.existsSync(USER_FILE)) {
    const defaultUsers = [
      { username: "admin", password: "admin123", contact: "admin@ptl.com", role: "admin" }
    ];
    fs.writeFileSync(USER_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
  }
}
initUsers();

// 读取用户
function getUsers() {
  return JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
}

// 保存用户
function saveUsers(users) {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, msg: "账号或密码错误" });
  }
});

// 注册接口
app.post('/api/register', (req, res) => {
  const { username, password, contact } = req.body;
  const users = getUsers();
  
  if (users.find(u => u.username === username)) {
    return res.json({ success: false, msg: "账号已存在" });
  }

  users.push({ username, password, contact, role: "user" });
  saveUsers(users);
  res.json({ success: true, msg: "注册成功" });
});

// AI 接口
app.post('/api/ai', (req, res) => {
  res.json({ answer: "AI已完成分析，匹配场景：锂电池研发、生产、测试、运维。推荐方案：全生命周期技术服务。" });
});

// 寿命预测
app.post('/api/predict-life', (req, res) => {
  res.json({ lifeCycle: 1500 });
});

// 提交技术
app.post('/api/tech', (req, res) => {
  res.json({ msg: "提交成功" });
});

// 提交需求
app.post('/api/demand', (req, res) => {
  res.json({ msg: "提交成功" });
});

app.listen(5008, () => {
  console.log("服务已启动：http://localhost:5008");
});