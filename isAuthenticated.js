module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    // ユーザーが認証済みの場合は次のミドルウェアまたはルートハンドラーに進む
    return next();
  } else {
    // 認証されていない場合はエラーを返すか、リダイレクトするなどの処理を行う
    // リダイレクト先を /errorpage に設定
    return res.redirect("/errorpage");
  }
};
