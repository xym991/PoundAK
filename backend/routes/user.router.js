import express from "express";
import User from "../models/User.js";
import createResponse from "../utils/response.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**

/**
 * @swagger
 * /user/info:
 *   put:
 *     summary: Update user info
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               playertag:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 info:
 *                   type: object
 *                   properties:
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     playertag:
 *                       type: string
 *                     birthday:
 *                       type: string
 *                       format: date
 *                     country:
 *                       type: string
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     height:
 *                       type: string
 *                     weight:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: string
 *                         unit:
 *                           type: string
 *                     weightGoal:
 *                       type: string
 *                       enum: [lose, gain, maintain]
 *                     physiqueGoal:
 *                       type: string
 *                       enum: [tone up, bulk up, get stronger]
 *                     activityLevel:
 *                       type: string
 *                       enum: [not active, active, very active]
 *       500:
 *         description: Server error
 */
router.put("/info", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { info: req.body },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(createResponse("Server error", "error"));
  }
});

/**
 * @swagger
 * /user/metrics:
 *   put:
 *     summary: Update user metrics
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: string
 *               weight:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                   unit:
 *                     type: string
 *               weightGoal:
 *                 type: string
 *                 enum: [lose, gain, maintain]
 *               physiqueGoal:
 *                 type: string
 *                 enum: [tone up, bulk up, get stronger]
 *               activityLevel:
 *                 type: string
 *                 enum: [not active, active, very active]
 *     responses:
 *       200:
 *         description: Updated user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 info:
 *                   type: object
 *                   properties:
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     playertag:
 *                       type: string
 *                     birthday:
 *                       type: string
 *                       format: date
 *                     country:
 *                       type: string
 *                 metrics:
 *                   type: object
 *                   properties:
 *                     height:
 *                       type: string
 *                     weight:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: string
 *                         unit:
 *                           type: string
 *                     weightGoal:
 *                       type: string
 *                       enum: [lose, gain, maintain]
 *                     physiqueGoal:
 *                       type: string
 *                       enum: [tone up, bulk up, get stronger]
 *                     activityLevel:
 *                       type: string
 *                       enum: [not active, active, very active]
 *       500:
 *         description: Server error
 */
router.put("/metrics", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: { metrics: req.body } },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(createResponse("Server error", "error"));
  }
});

export default router;
