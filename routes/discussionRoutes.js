const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, discussionController.createDiscussion);
router.put(
  "/:discussionId",
  authMiddleware,
  discussionController.updateDiscussion
);

router.delete(
  "/:discussionId",
  authMiddleware,
  discussionController.deleteDiscussion
);

router.get("/list", authMiddleware, discussionController.list);
router.get("/tags", authMiddleware, discussionController.getDiscussionsByTags);
router.get(
  "/search",
  authMiddleware,
  discussionController.getDiscussionsByText
);

router.post(
  "/comment/:discussionId",
  authMiddleware,
  discussionController.commentOnDiscussion
);
router.post(
  "/like/:discussionId",
  authMiddleware,
  discussionController.likeDiscussion
);
router.post(
  "/like/:discussionId/:commentId",
  authMiddleware,
  discussionController.likeComment
);
router.put(
  "/comment/:discussionId/:commentId",
  authMiddleware,
  discussionController.updateComment
);
router.delete(
  "/comment/:discussionId/:commentId",
  authMiddleware,
  discussionController.deleteComment
);

module.exports = router;
