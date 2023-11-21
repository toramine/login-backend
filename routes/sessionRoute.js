const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken"); // JWTの利用

const User = require("../userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();

// パスワードの検証
const validatePassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

// ローカルストラテジーの設定
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: "ユーザーが見つかりません" });
      }

      const isValidPassword = await validatePassword(user, password);

      if (!isValidPassword) {
        return done(null, false, { message: "パスワードが一致しません" });
      }

      // 認証成功
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// JWTのシークレットキー
const jwtSecretKey = process.env.JWT_SECRET;
// ログインのルートハンドラー
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }

    // JWTの生成
    const token = jwt.sign({ userId: user.id }, jwtSecretKey, {
      expiresIn: "1h", // トークンの有効期限
    });

    // トークンをクライアントに送信
    res.status(200).json({ success: true, token });
  })(req, res, next);
});

// ログアウトのルートハンドラー
router.get("/logout", (req, res) => {
  // ログアウト処理（クライアントサイドでトークンを破棄するなど）
  res.redirect("/");
});

module.exports = router;
