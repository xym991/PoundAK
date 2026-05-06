import express from "express";
import Data from "../models/Data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const results = await Data.find({ userId: req.user }).select(
      "type timestamp -_id"
    );

    const data = {};
    for (const result of results) {
      data[result.type] = { timestamp: result.timestamp };
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const entry = await Data.findOne({ userId: req.user, type });

    res.json(entry ? entry.data : {});
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    let entry = await Data.findOne({ userId: req.user, type });

    if (!entry) {
      entry = new Data({
        userId: req.user,
        type,
        data: req.body,
        timestamp: req.body.timestamp || Date.now(),
      });
      await entry.save();
    } else {
      entry.data = req.body;
      entry.timestamp = req.body.timestamp || Date.now();
      await entry.save();
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
