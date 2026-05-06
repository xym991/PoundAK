import express from "express";
const router = express.Router();
import {
  registerHandler,
  loginHandler,
  changePasswordHandler,
  verifyHandler,
  forgotPasswordRequestHandler, // <-- add this
  forgotPasswordVerifyHandler, // <-- add this
} from "../handlers/auth.handler.js";
import authorise from "../middleware/authorise.js";
import User from "../models/User.js";
import createResponse from "../utils/response.js";

router.post("/register", registerHandler);

router.post("/verify", verifyHandler);

router.post("/login", loginHandler);

router.post("/forgot-password", forgotPasswordRequestHandler);
router.post("/forgot-password/verify", forgotPasswordVerifyHandler);

router.get("/user", authorise, async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  if (!user)
    return res.status(404).json(createResponse("User not found", "error"));
  res.json(user);
});
router.post("/change-password", authorise, changePasswordHandler);
export default router;
