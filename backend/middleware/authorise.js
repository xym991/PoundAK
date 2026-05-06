import jwt from "jsonwebtoken";
import createResponse from "../utils/response.js";

const authorise = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json(createResponse("Access denied. No token provided.", "error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json(createResponse("Invalid token.", "error"));
  }
};

export default authorise;
