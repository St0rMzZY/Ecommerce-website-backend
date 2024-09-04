const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const jwtProvider = require("../config/jwtProvider.js");

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password, role } = userData;

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      console.error(`User already exists with email: ${email}`);
      throw new Error(`User already exists with email: ${email}`);
    }

    // Hash the password before saving
    password = await bcrypt.hash(password, 8);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    console.log("User created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error in createUser: ", error.message);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

const findUserById = async (userId) => {
  try {
    console.log(`Searching for user with ID: ${userId}`);
    const user = await User.findById(userId);
    // .populate("address");
    if (!user) {
      console.error(`User not found with id: ${userId}`);
      throw new Error(`User not found with id: ${userId}`);
    }
    console.log("User found:", user);
    return user;
  } catch (error) {
    console.error("Error in findUserById: ", error.message);
    throw new Error(`Failed to find user by ID: ${error.message}`);
  }
};

const getUserByEmail = async (email) => {
  try {
    console.log(`Searching for user with email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User not found with email: ${email}`);
      throw new Error(`User not found with email: ${email}`);
    }

    console.log("User found by email:", user);
    return user;
  } catch (error) {
    console.error("Error in getUserByEmail: ", error.message);
    throw new Error(`Failed to get user by email: ${error.message}`);
  }
};

const getUserProfileByToken = async (token) => {
  try {
    console.log("Verifying token...");
    const userId = jwtProvider.getUserIdFromToken(token);

    console.log("User ID obtained from token:", userId);
    const user = await findUserById(userId);
    // .populate("address");

    if (!user) {
      console.error(`User not found with ID from token: ${userId}`);
      throw new Error(`User not exist with ID from token: ${userId}`);
    }

    console.log("User profile obtained successfully:", user);
    return user;
  } catch (error) {
    console.error("Error in getUserProfileByToken: ", error.message);
    throw new Error(`Failed to get user profile by token: ${error.message}`);
  }
};

const getAllUsers = async () => {
  try {
    console.log("Fetching all users...");
    const users = await User.find();
    console.log("All users retrieved successfully.");
    return users;
  } catch (error) {
    console.error("Error in getAllUsers: ", error.message);
    throw new Error(`Failed to retrieve all users: ${error.message}`);
  }
};

module.exports = {
  createUser,
  findUserById,
  getUserProfileByToken,
  getUserByEmail,
  getAllUsers,
};
