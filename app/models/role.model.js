import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./user.models.js";

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

// Relación muchos a muchos
UserModel.belongsToMany(RoleModel, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});

RoleModel.belongsToMany(UserModel, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});
