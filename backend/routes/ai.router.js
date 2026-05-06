import express from "express";
import {
  getPillarInsightsHandler,
  getMatchInsightsHandler,
  getChatResponseHandler,
  handlePreGame,
  handlePostGame,
  getAIResponse,
} from "../handlers/ai.handler.js";

const router = express.Router();

// Route for pillar-based insights
router.post("/pillar-insight", getPillarInsightsHandler);

// Route for match insights
router.post("/match-insight", getMatchInsightsHandler);

// Route for AI chat response
router.post("/chat-response", getChatResponseHandler);

// Route for pre-game AI coaching
router.post("/pre-game", handlePreGame);

// Route for post-game AI debrief
router.post("/post-game", handlePostGame);

router.post("/response", getAIResponse);

export default router;
