import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const publicationModel = sequelize.define("Publication", {
  id_publication: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("post", "problematic"),
    defaultValue: "post",
  },
  id_category: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "publications",
  timestamps: false,
});

export default publicationModel;
