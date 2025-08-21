import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./user.models.js";

export const ProfileModel = sequelize.define(
  "profile",
  {
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  },
  {
    tableName: "profiles",
    timestamps: true,
  }
);

// Relación uno a uno
UserModel.hasOne(ProfileModel, { foreignKey: "user_id", as: "profile" });
ProfileModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });
