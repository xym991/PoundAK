import express from "express";
const router = express.Router();

import authRouter from "./auth.router.js";
import tebexRouter from "./tebex.router.js";
import userRouter from "./user.router.js";
import aiRouter from "./ai.router.js";
import dataRouter from "./data.router.js";
import discordRouter from "./discord.router.js";
import managementRouter from "./management.router.js";
import authorise from "../middleware/authorise.js";
import rateLimitMiddleware from "../middleware/limit.js";

router.use("/auth", authRouter);
router.use("/user", authorise, userRouter);
router.use("/ai", authorise, rateLimitMiddleware, aiRouter);
router.use("/tebex", tebexRouter);
router.use("/data", authorise, dataRouter);
router.use("/discord", discordRouter);
router.use("/images", express.static("public"));

export default router;
