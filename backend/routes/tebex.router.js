import express from "express";
import { getTebexPackages, tebexPayment } from "../handlers/tebex.handler.js";

const router = express.Router();

router.get("/packages", getTebexPackages);

router.post("/webhook", tebexPayment);

export default router;
