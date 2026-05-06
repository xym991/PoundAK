import dotenv from "dotenv";
dotenv.config();
import createResponse from "../utils/response.js";
import Together from "together-ai";
import {
  parseMatchMeta,
  getPlayerRolesFromMatch,
  formatPlayerName,
  parsePlayerStats,
  parseRecentEvents,
  buildPregameContext,
  buildIntragameContext,
  buildPostgameContext,
} from "../utils/insightPromptBuilder.js";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

const generateAIResponse = async (prompt) => {
  try {
    const completion = await together.chat.completions.create({
      model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
      temperature: 0.7,
      top_p: 1,
      messages: [{ role: "user", content: prompt }],
    });

    const response = completion.choices[0]?.message?.content?.trim();
    return response;
  } catch (error) {
    console.error("❌ Together AI generation failed:", error.message || error);
    throw createResponse(500, "AI generation failed");
  }
};

export default generateAIResponse;

export async function getPillarInsightsHandler({ body }, res) {
  try {
    const userMessage = `
      You're an AI performance coach for gamers. The user has a score of ${
        body.score
      } in the ${body.metric} metric around the ${
      body.pillar || body.metric
    } pillar.

      Here's some context about the player: ${JSON.stringify(
        body.context || {},
        null,
        2
      )}

      Provide a short, personalized insight based on their performance. If relevant, mention fitness, mental, or lifestyle data. Keep it clear and motivating.  under 25 words no quotes
    `;

    const insight = await generateAIResponse(userMessage);
    res.status(200).json(createResponse(insight));
  } catch (error) {
    console.error("getPillarInsightsHandler Error:", error);
    res
      .status(500)
      .json(createResponse(500, "Failed to generate pillar insights"));
  }
}

export async function getAIResponse({ body }, res) {
  try {
    const response = await generateAIResponse(body.prompt);
    res.status(200).json(createResponse(response));
  } catch (error) {
    console.error("getAIResponse Error:", error);
    res.status(500).json(createResponse(500, "Failed to get AI response"));
  }
}

export async function getChatResponseHandler({ body }, res) {
  try {
    const { chat, playerData, message } = body;

    const userMessage = `
      You're an AI coach providing personalized, supportive responses to a gamer based on their stats and goals.

      the user says: "${message}"

      Respond with a personalized, supportive response to whatever the user is asking within the context of gaming or fitness or habits or lifestyle.
      Use the context of their provided context and data and the thread of previous messages to inform your response as needed, do not force it.
      Avoid generic phrases and focus on actionable advice.
      Address the player directly as "you" like a coach would.
      give detailed response when needed and be specific to the question asked.
      respond only to what is asked and avoid going off topic.

      PLAYER PROFILE AND DATA:
      ${JSON.stringify(playerData, null, 2)}

      PREVIOUS CHAT:
      ${chat}

      respond in pure html with text formatting and no extra text, no styles, keep it simple , only for headings / sections / lists / paragraphs. use proper spacing and line breaks.
    `;

    const response = await generateAIResponse(userMessage);
    res.status(200).json(createResponse(response));
  } catch (error) {
    console.error("getChatResponseHandler Error:", error);
    res
      .status(500)
      .json(createResponse(500, "Failed to generate chat response"));
  }
}

export async function getMatchInsightsHandler({ body }, res) {
  try {
    const { playerData, matchInfo, game, events } = body;
    // console.log("🧠 MATCH INSIGHT HANDLER INITIATED");
    // console.log("🎮 Game:", game);
    // console.log("🙋 Player Data:", JSON.stringify(playerData, null, 2));
    // console.log("📊 Match Info:", JSON.stringify(matchInfo, null, 2));
    // console.log("🧨 Recent Events:", JSON.stringify(events, null, 2));

    const matchMeta = parseMatchMeta(matchInfo);
    const { player, teammates, enemies } = getPlayerRolesFromMatch(matchInfo);
    const playerStats = parsePlayerStats(matchInfo.player_stats);
    const recent = parseRecentEvents(events);

    const intragameContext = buildIntragameContext({
      matchMeta,
      player,
      teammates,
      enemies,
      playerStats,
      recentEvents: recent,
    });

    const userMessage = `
      GOAL:
      Provide one sharp, tactical insight to help the player adapt and perform better mid-match in ${game}.

      CONTEXT:
      ${JSON.stringify(intragameContext, null, 2)}

      HOW TO RESPOND:
      - Give one focused, actionable insight around 30 words (DO NOT MAKE IT TOO SHORT OR TOO LONG).
      - Use death context, team/enemy compositions, and recent events to guide advice.
      - Focus on helping the player:
        - Outmaneuver key enemies.
        - Synergize better with teammates.
        - Counter enemy setups or exploit weaknesses.
        - Improve decisions like positioning, cooldowns, or map pressure.
        - Use game-specific stats and decisions (KDA, objectives, item timings, positioning, etc.) to form insights.
        - Adjust his strategy based on the current game state.
      - Keep it direct, practical, and valuable—no fluff.
      - Clearly distinguish between the player, teammates, and enemies.
      - Only refer to teammates and enemies by their character names (e.g., "Zed","Jinx", "iron man") and not by player name/account name. refer to player by his playertag primarily or by character name
    `;

    const insight = await generateAIResponse(userMessage);
    res.status(200).json(createResponse(insight));
  } catch (error) {
    console.error("getMatchInsightsHandler Error:", error);
    res
      .status(500)
      .json(createResponse(500, "Failed to generate match insight"));
  }
}

export async function handlePreGame({ body }, res) {
  try {
    const { playerData, matchInfo, game, events } = body;
    const matchMeta = parseMatchMeta(matchInfo);
    const { player, teammates, enemies } = getPlayerRolesFromMatch(matchInfo);

    const pregameContext = buildPregameContext({
      matchMeta,
      player,
      teammates,
      enemies,
    });

    const userMessage = `
      GOAL:
      Prepare the player for an upcoming match in ${game} with relevant tactical advice, performance insight, and motivation.

      CONTEXT (use only what matters):
      ${JSON.stringify(pregameContext, null, 2)}

      RESPONSE FORMAT:
      - Return 3 sentences:
        1. Tactical/roster-based advice
        2. Stat-based or general insight
        3. Motivational focus
      - Each sentence ~30 words, separated with "~"
      - No labels, no headings

      GUIDELINES:
      - Use player stats (win rate, recent form, pick rate, etc.) and role to tailor advice.
      - Pull from match/roster context when relevant: player, teammates, and enemy team should be clearly differentiated.
      - Keep insights practical, sharp, and useful — avoid fluff.
      - Let motivation reflect the player’s identity and team dynamics.
      - Only refer to teammates and enemies by their character names (e.g., "Zed","Jinx", "iron man") and not by player name/account name. refer to player by his playertag primarily or by character name
    `;

    const insight = await generateAIResponse(userMessage);
    res.status(200).json(createResponse(insight));
  } catch (error) {
    console.error("handlePreGame Error:", error);
    res
      .status(500)
      .json(createResponse(500, "Failed to generate pre-game insight"));
  }
}

export async function handlePostGame({ body }, res) {
  try {
    const { playerData, matchInfo, game, events } = body;

    const matchMeta = parseMatchMeta(matchInfo);
    const { player, teammates, enemies } = getPlayerRolesFromMatch(matchInfo);
    const playerStats = parsePlayerStats(matchInfo.player_stats);
    const recent = parseRecentEvents(events);

    const postgameContext = buildPostgameContext({
      matchMeta,
      player,
      teammates,
      enemies,
      playerStats,
      recentEvents: recent,
    });

    const userMessage = `
      GOAL:
      Help the player reflect on their performance after a match in ${game} and identify one area to improve.

      CONTEXT:
      ${JSON.stringify(postgameContext, null, 2)}

      GUIDELINES:
      - Keep the response 2-3 sentences.
      - Be supportive but direct.
      - Mention a specific strength and a clear improvement area.
      - Use data and context to inform the feedback.
      - Avoid generic advice.
      - Only refer to teammates and enemies by their character names (e.g., "Zed","Jinx", "iron man") and not by player name/account name. refer to player by his playertag primarily or by character name
    `;

    const insight = await generateAIResponse(userMessage);
    res.status(200).json(createResponse(insight));
  } catch (error) {
    console.error("handlePostGame Error:", error);
    res
      .status(500)
      .json(createResponse(500, "Failed to generate post-game insight"));
  }
}
