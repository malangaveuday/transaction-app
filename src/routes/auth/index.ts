import { Router } from "express";
import AuthManager from "../../module/authManger";

const authRoutes = Router();

authRoutes.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    const authManger = new AuthManager();
    const response = await authManger.signup({ email, password });
    res.send(response);
})

authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const authManger = new AuthManager();
    const response = await authManger.login({ email, password });
    res.send(response);
})

export default authRoutes;