import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import TaskModel from "./task.model.js";

export const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false, 
    tableName: "users",
  }
);

UserModel.hasMany(TaskModel, { foreignKey: "user_id", as: "tasks" });
TaskModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
