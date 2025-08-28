import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";
// import RoleModel from "./role.model.js";
// import UserModel from "./user.model.js";

const UserRoleModel = sequelize.define(
  "user_role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

// Relaciones muchos a muchos
UserModel.belongsToMany(RoleModel, {
  through: UserRoleModel,
  foreignKey: "user_id",
  as: "roles",
});

RoleModel.belongsToMany(UserModel, {
  through: UserRoleModel,
  foreignKey: "role_id",
  as: "users",
});

export default UserRoleModel;