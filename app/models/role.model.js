import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./user.model.js";
import { UserRoleModel } from "./user_role.model.js"; 

export const RoleModel = sequelize.define(
  "role",
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});

RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});
