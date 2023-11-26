const jwt = require('jsonwebtoken');
require("dotenv").config();
// ミドルウェア関数を作成して、リクエストのトークンを確認する
module.exports = (req, res, next) => {
  // リクエストヘッダーからトークンを取得
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    // トークンがない場合は、401 Unauthorizedを返す
    return res.status(401).json({ message: "トークンが提供されていません" });
  }

  // トークンを検証
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      // トークンが無効な場合は、401 Unauthorizedを返す
      return res.status(401).json({ message: "トークンが無効です" });
    }
    // 有効な場合は、次のミドルウェア関数に進む
    next();
  });
}
