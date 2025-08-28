import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import TaskModel from "./task.model.js";

const UserModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
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

export default UserModel;