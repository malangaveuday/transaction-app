import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import dotenv from 'dotenv';
import authRoutes from "./routes/auth";
import userRoute from "./routes/user";
import accountRoute from "./routes/accountRoute";

dotenv.config();

const PORT = process.env.PORT || 8888;
const app = express();

connectDB()

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoute);
app.use("/account", accountRoute)


app.listen(PORT, () => {
    console.log(`Running app on ${PORT}`)
})