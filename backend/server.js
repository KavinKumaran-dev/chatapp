import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./lib/socket.js";
dotenv.config();
const PORT = process.env.PORT;
console.log(PORT);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
})
);
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/messages",messageRoutes);
app.get("/",(req,res) => {
    console.log("Home");
})
server.listen(2000,(req,res) => {
    console.log("Server running successfully!");
    connectDB();
});
// B2XE7uGwzyvE5rjj