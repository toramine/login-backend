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
      console.log(username);
      const user = await User.findOne({
        where: {
          username: username, // 検索したいユーザー名を指定
        },
      });
      console.log(user);
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
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      // エラーが発生した場合の処理
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      // 認証失敗の場合の処理
      return res.status(401).json({ message: "Authentication Failed" });
    }
    // 認証成功
    req.logIn(user, (err) => {
      if (err) {
        // ログイン処理でエラーが発生した場合の処理
        return res.status(500).json({ message: "Internal Server Error" });
      }
      // ログイン成功時のレスポンスを返す
      console.log("ログインは成功");
      req.session.save(() => {
        // successRedirectin the callback here
        return res
          .status(200)
          .json({ message: "Authentication Successful", user });
      });
    });
  })(req, res, next);
});

// ログアウトのルートハンドラー
router.get("/logout", (req, res) => {
  req.logout(); // セッションからユーザーを削除
  res.status(200).json({ message: "Logout Successful" });
});

router.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    // 認証されている場合
    res.status(200).json({ authenticated: true });
  } else {
    // 認証されていない場合
    res.status(200).json({ authenticated: false });
  }
});

module.exports = router;
