// userRouter.js
const express = require("express");
const verifyToken = require("../verifyToken");

const router = express.Router();
const {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../userController");

// ユーザーの作成
router.post("/create", async (req, res) => {
  const userData = req.body;
  try {
    const user = await createUser(userData);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// GET /users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error getting users" });
  }
});

// ユーザーの読み取り（IDによる検索）
router.get("/getById/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user by ID" });
  }
});

// ユーザーの読み取り（ユーザー名による検索）
router.get("/getByUsername/:username", verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const user = await getUserByUsername(username);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user by username" });
  }
});

// ユーザーの更新
router.put("/update/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const updates = req.body;
  try {
    const user = await updateUser(userId, updates);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// ユーザーの削除
router.delete("/delete/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    await deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
