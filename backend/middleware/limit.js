import RequestService from "../state/requests.js";

const rateLimitMiddleware = (req, res, next) => {
  const userId = req.user;
  if (!userId) {
    return res.status(400).json(createResponse("User not found", "error"));
  }

  const maxRequests = parseInt(process.env.MAX_REQUESTS, 10) || 500; // Default limit: 100
  const currentRequests = RequestService.getUserRequests(userId);

  if (currentRequests >= maxRequests) {
    return res.status(429).json(createResponse("Rate limit exceeded", "error"));
  }

  RequestService.incrementRequests(userId);
  next();
};

export default rateLimitMiddleware;
