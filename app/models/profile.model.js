import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import UserModel from "./user.model.js";

const profileModel = sequelize.define(
  "profile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carrera: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    año_cursado: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    foto: {
      type: DataTypes.BLOB("long"),
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
    tableName: "profiles",
    timestamps: true,
  }
);

// Relación uno a uno
UserModel.hasOne(profileModel, { foreignKey: "user_id", as: "profile" });
profileModel.belongsTo(UserModel, { foreignKey: "user_id", as: "user" });

export default profileModel;