require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key'; // Default value

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY must be set in the environment variables");
}

const generateToken = (userId) => {
  try {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '48h' });
  } catch (error) {
    throw new Error("Failed to generate token");
  }
};

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken.userId;
  } catch (error) {
    throw new Error("Failed to verify token");
  }
};

module.exports = { generateToken, getUserIdFromToken };
