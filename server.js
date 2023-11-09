const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const port = 3060;
const { Sequelize } = require("sequelize");
// const gptRoute = require("./routes/gpt");
// const templateRoute = require("./routes/template");
const path = require("path");

// ミドルウェア

// Sequelizeの初期化
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// データベースに接続
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to MySQL");
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET, // セッションデータの暗号化に使用するキー
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   maxAge: 3600000, // 1時間
    // },
  })
);

app.use(cors());
app.use(express.json());
app.use(helmet());
// app.use("/api/gpt", gptRoute);
// app.use("/api/template", templateRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server listening on port 3060");
});
