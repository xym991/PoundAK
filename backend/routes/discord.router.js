import express from "express";
import { auth, verify } from "../handlers/discord.handler.js";

const router = express.Router();

router.get("/auth", auth);

router.post("/verify", verify);

export default router;
