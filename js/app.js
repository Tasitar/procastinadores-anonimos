import express from "express";
import "dotenv/config";
import morgan from "morgan";
import usuarioroutes from "../src/routes/usuario.routes.js";
import { sequelize } from "../src/config/database.js";
import { startOn } from "../src/config/database.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan("dev"));
sequelize.authenticate
app.use("/api", usuarioroutes)


app.listen(PORT, async () =>{
    await startOn();
console.log(`servidor conectado ${PORT}`)
})
