import dotenv from "dotenv";
import express from "express";
import { User } from "./model/user.model.js";
import { registerUser } from "./controller/user.controller.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import cookieParser from "cookie-parser";
dotenv.config({
    path: './public/.env'
});


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running at port: ${process.env.PORT || 5000}`);
           
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed !!!", err);
    });
