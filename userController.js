const User = require("./userModel");

// ユーザーの作成
const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// ユーザーの読み取り（IDによる検索）
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

// ユーザーの読み取り（ユーザー名による検索）
const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

// ユーザーの更新
const updateUser = async (userId, updates) => {
  try {
    const user = await getUserById(userId);
    if (user) {
      await user.update(updates);
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// ユーザーの削除
const deleteUser = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (user) {
      await user.destroy();
      return true;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
};
