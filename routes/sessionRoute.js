const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../userModel"); // ユーザーモデルをインポートするか、適切な方法に置き換えてください
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// パスワードの検証
const validatePassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

// ローカルストラテジーの設定
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // ユーザーの検索
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: "ユーザーが見つかりません" });
      }

      // パスワードの検証
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

passport.serializeUser((user, done) => {
  // ユーザーをセッションに保存（ユーザーIDを保存）
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // セッションからユーザーを取得
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// ログインのルートハンドラー
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// ログアウトのルートハンドラー
router.get("/logout", (req, res) => {
  req.logout(); // セッションからユーザーを削除
  res.redirect("/");
});

module.exports = router;
