import express from "express";
import colors from "colors";
import morgan from "morgan";
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import getUsers from './routes/weightGapp.js'
import admin from './routes/adminRoutes.js'
import cors from "cors";
dotenv.config({ path: "./config/config.env" });
connectDB()
const app = express();
app.use(cors());

app.use(express.json());


if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Welcome to your server!");
});
const PORT = process.env.PORT || 5000;
// app.use("/users", trackUser);
app.use("/users", getUsers);
app.use("/adminPage", admin);

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
