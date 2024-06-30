const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { REFRESH_TOKEN_SECRET } = require("../config");

exports.signup = async (req, res) => {
  const { name, mobileNo, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      mobileNo,
      email,
      password: hashedPassword,
    });
    await user.save();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).save();

    res
      .status(201)
      .json({
        message: "User created successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken || new Date() > storedToken.expires) {
      return res
        .status(403)
        .json({ message: "Refresh token is invalid or expired" });
    }

    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded.userId);

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token is invalid or expired" });
  }
};

exports.logout = async (req, res) => {
  const { token } = req.body;
  try {
    await RefreshToken.deleteOne({ token });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.user;
  const { name, mobileNo, email } = req.body;
  try {
    await User.findByIdAndUpdate(userId, { name, mobileNo, email });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.user;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUser = async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ name: new RegExp(name, "i") });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  const { userId } = req.user;
  const { followerId } = req.body;
  try {
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
    if (!user.followers.includes(followerId)) {
      user.followers.push(followerId);
      follower.following.push(userId);
      await user.save();
      await follower.save();
    }
    res.json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
