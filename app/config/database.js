import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
);

export default sequelize;

export const initDB = async () =>{
    try{
        sequelize.authenticate();
        console.log("Conectado a la base de datos");
        sequelize.sync();
    } catch(error) {
        console.error("error al conectarse a la base de datos")
    };
};

