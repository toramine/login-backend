const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./server.js"); // Sequelizeオブジェクトを正しくインポートし、変数名をsequelizeに修正

// Userモデルの定義
// const User = sequelize.define("User", {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: Sequelize.literal("datetime('now')"),
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: Sequelize.literal("datetime('now')"),
//   },
// });

// module.exports = User;

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("datetime('now')"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("datetime('now')"),
    },
  });
  return User;
};
