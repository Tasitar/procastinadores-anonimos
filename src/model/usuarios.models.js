import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";


export const User = sequelize.define("User",{
  name: {type: DataTypes.STRING, allownull:false},
  password: {type: DataTypes.INTEGER, allownull:false},
  gmail: {type: DataTypes.STRING, allownull:false},

  });
