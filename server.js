const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const port = 3060;
const { Sequelize } = require("sequelize");
// const sessionRoute = require("./routes/sessionRoute");
// const userRoute = require("./routes/userRoute");
const path = require("path");

// SQLiteデータベースファイルのパスを指定
const dbPath = path.resolve(__dirname, "mydatabase.sqlite");
// ミドルウェア
// Sequelizeの初期化
const sequelize = new Sequelize({
  dialect: "sqlite", // データベースの種類をsqliteに設定
  storage: dbPath, // SQLiteデータベースファイルのパス
});

// データベースに接続
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to SQLite");
  })
  .catch((err) => {
    console.error("Error connecting to SQLite:", err);
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
// app.use("/sessionRoute", sessionRoute);
// app.use("/userRoute", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server listening on port 3060");
});
