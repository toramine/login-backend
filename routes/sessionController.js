const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../userModel"); // ユーザーモデルをインポートするか、適切な方法に置き換えてください

// Passportの設定
passport.use(
  new LocalStrategy((username, password, done) => {
    // ユーザー認証ロジックを実装し、認証に成功した場合、ユーザーオブジェクトを返します
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "ユーザーが見つかりません" });
      }
      if (!user.validatePassword(password)) {
        return done(null, false, { message: "パスワードが一致しません" });
      }
      return done(null, user);
    });
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
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// ログアウトのルートハンドラー
app.get("/logout", (req, res) => {
  req.logout(); // セッションからユーザーを削除
  res.redirect("/");
});
