import express from "express";
import { createuser,getAllusers,getusersbyId,updateusers,deleteuser } from "../controller/usuario.controller.js";

const usuarioroutes =express.Router();

usuarioroutes.post("/users", createuser);

usuarioroutes.get("/users", getAllusers);

usuarioroutes.get("/users/:id", getusersbyId);

usuarioroutes.put("/users/:id", updateusers);

usuarioroutes.delete("/users/:id", deleteuser);

export default usuarioroutes;