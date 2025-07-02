import { Sequelize } from "sequelize";
import dotenv  from "dotenv";
dotenv.config();


export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
)

export const startOn =async() =>{
    try{
        await sequelize.sync()
        console.log("conexion exitosa");
    } catch (error){
        console.error("no se pudo conectar con la DB ",error)
    }
};