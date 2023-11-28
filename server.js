const express = require("express");
const helmet = require("helmet");
const { Sequelize } = require("sequelize");
const sessionRoute = require("./routes/sessionRoute");
const userRoute = require("./routes/userRoute");
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3060;

// Database setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./mydatabase.sqlite",
});

// Middleware setup
app.use(helmet());
// app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // 許可するオリジンを指定
  res.header('Access-Control-Allow-Credentials', true); // クッキーを許可
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 許可するHTTPメソッドを指定
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // 許可するヘッダーを指定
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Routes setup
app.use("/sessionRoute", sessionRoute);
app.use("/userRoute", userRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server setup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
