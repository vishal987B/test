const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);
router.post("/logout", authMiddleware, userController.logout);
router.put("/update", authMiddleware, userController.updateUser);
router.delete("/delete", authMiddleware, userController.deleteUser);
router.get("/all", authMiddleware, userController.getUsers);
router.get("/search", authMiddleware, userController.searchUser);
router.post("/follow", authMiddleware, userController.followUser);

module.exports = router;
