import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const TaskModel = sequelize.define(
  "task",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
      model: "users",
      key: "id"
      }
    },
  },
  {
    timestamps: false,
    tableName: "tasks",
  }
);


export default TaskModel;
