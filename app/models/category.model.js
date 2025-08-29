import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const categoryModel = sequelize.define("Category", {
  id_category: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "categories",
  timestamps: false,
});

export default categoryModel;
