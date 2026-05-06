import dotenv from "dotenv";
import { use } from "react";

dotenv.config();

const paths = {
  login: "/auth/login",
  register: "/auth/register",
  changePassword: "/auth/change-password",
  user: "/auth/user",
  metrics: "/user/metrics",
  info: "/user/info",
  pillarInsight: "/ai/pillar-insight",
  chat: "/ai/chat-response",
  matchInsight: "/ai/match-insight",
  preGame: "/ai/pre-game",
  postGame: "/ai/post-game",
  ai: "/ai/response",
  verify: "/auth/verify",
  sync: "/data/",
  forgotPassword: "/auth/forgot-password",
  forgotPasswordVerify: "/auth/forgot-password/verify",
};

export default paths;
