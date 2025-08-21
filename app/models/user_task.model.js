import UserModel from "./user.models.js";
import TaskModel from "./task.models.js";
import sequelize from "../config/database.js";

export const UserTaskModel = sequelize.define(
  "UserTask",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: UserModel,
        key: "id",
      },
    },
    task_id: {
      type: DataTypes.INTEGER,
      references: {
        model: TaskModel,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "user_tasks",
  }
);

UserModel.hasMany(TaskModel, { foreignKey: "user_id", as: "tasks" });

TaskModel.belongsTo(UserModel, { foreignKey: "user_id", as: "author" });

export { UserModel, TaskModel, UserTaskModel };