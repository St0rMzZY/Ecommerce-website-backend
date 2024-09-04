const jwtProvider = require("../config/jwtProvider.js");
const userService = require("../services/user.service.js");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header is missing or malformed.");
      return res.status(401).json({ error: "Unauthorized - Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("Token extraction failed.");
      return res.status(401).json({ error: "Unauthorized - Token not provided" });
    }

    // Verify and decode the token
    const userId = jwtProvider.getUserIdFromToken(token);

    // Fetch the user
    const user = await userService.findUserById(userId);
    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    
    if (error.message.includes("Failed to verify token")) {
      return res.status(403).json({ error: "Forbidden - Invalid token" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = authenticate;
