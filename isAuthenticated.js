module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    // ユーザーが認証済みの場合は次のミドルウェアまたはルートハンドラーに進む
    return next();
  } else {
    console.log(req.isAuthenticated());
    // 認証されていない場合はエラーを返すか、リダイレクトするなどの処理を行う
    // return res.status(200).json({ message: "Authentication false" });
    return next();
  }
};
