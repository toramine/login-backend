const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const port = 3060;
const { Sequelize } = require("sequelize");
const sessionRoute = require("./routes/sessionRoute");
const userRoute = require("./routes/userRoute");
const path = require("path");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite", // データベースの種類をsqliteに設定
  storage: "./mydatabase.sqlite", // SQLiteデータベースファイルのパス
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
    cookie: {
      maxAge: 60 * 60 * 1000, // セッションの有効期限（ミリ秒）
      secure: false, // HTTPSを使用する場合はtrueに設定
      httpOnly: true, // JavaScriptからのアクセスを禁止
      sameSite: "strict", // SameSite属性の設定
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.cookie("connect.sid", req.sessionID, { httpOnly: true });
  next();
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// app.use(cors());
app.use(express.json());
app.use(helmet());
app.use("/sessionRoute", sessionRoute);
app.use("/userRoute", userRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Server listening on port 3060");
});
