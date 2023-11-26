const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const {
  getUserById,
  getUserByUsername,
} = require("../userController");

require("dotenv").config();

function generateAuthToken(user) {
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY);
  return token;
}

const validatePassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isValidPassword = await validatePassword(user, password);

      if (!isValidPassword) {
        return done(null, false, { message: "Incorrect password" });
      }
      console.log(`LocalStrategy:${user}`);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    console.log(`serializeUser:${user.id}, ${user.username}`);

    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// passport.deserializeUser(async (id, done) => {
//   await User.findById(id, (err, user) => {
//     console.log(`deserializeUser:${id}`);
//     done(err, user);
//   });
// });

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(`authenticated:${req.isAuthenticated()}`);
  // 認証成功時にトークンを生成し、クッキーに保存する
  const token = generateAuthToken(req.user);
  res.cookie('authToken', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1時間有効なクッキーとして設定
  res.json(token);
});

router.get("/logout", (req, res) => {
  res.clearCookie('authToken'); // トークンをクリア
  // req.logout(function(err) {
  //   if (err) {
  //     // エラー処理
  //     console.log(`logout:${err}`);
  //     res.json({ message: err });
  //   } else {
  //     res.json({ message: "Logged out successfully" });
  //   }
  // });
  res.json({ message: "Logged out successfully" })
});

router.get("/check-auth", (req, res) => {
  if (req.cookies.authToken !== undefined) {
    console.log(`check-auth:${req.cookies.authToken}`);
    res.json({ authenticated: true });
  } else {
    console.log(`check-auth:${req.cookies.authToken}`);
    res.json({ authenticated: false });
  }
});

module.exports = router;
