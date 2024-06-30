const Discussion = require("../models/Discussion");

exports.createDiscussion = async (req, res) => {
  const { userId } = req.user;
  const {  text, image, hashtags } = req.body;
  try {
    const discussion = new Discussion({
      user: userId,
      text,
      image,
      hashtags,
    });
    await discussion.save();
    res.status(201).json({ message: "Discussion created successfully", data:discussion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const { text, image, hashtags } = req.body;
  try {
    await Discussion.findByIdAndUpdate(discussionId, { text, image, hashtags });
    res.json({ message: "Discussion updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  try {
    await Discussion.findByIdAndDelete(discussionId);
    res.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDiscussionsByTags = async (req, res) => {
  const { tags } = req.query;
  try {
    const discussions = await Discussion.find({
      hashtags: { $in: tags.split(",") },
    });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const discussions = await Discussion.find();
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getDiscussionsByText = async (req, res) => {
  const { text } = req.query;
  try {
    const discussions = await Discussion.find({ text: new RegExp(text, "i") });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.commentOnDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const { userId, text } = req.body;
  try {
    const discussion = await Discussion.findById(discussionId);
    discussion.comments.push({ user: userId, text });
    await discussion.save();
    res.json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const { userId } = req.body;
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion.likes.includes(userId)) {
      discussion.likes.push(userId);
      await discussion.save();
    }
    res.json({ message: "Discussion liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  const { userId } = req.body;
  try {
    const discussion = await Discussion.findById(discussionId);
    const comment = discussion.comments.id(commentId);
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      await discussion.save();
    }
    res.json({ message: "Comment liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  const { text } = req.body;
  try {
    const discussion = await Discussion.findById(discussionId);
    const comment = discussion.comments.id(commentId);
    comment.text = text;
    await discussion.save();
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  try {
    const discussion = await Discussion.findById(discussionId);
    discussion.comments.id(commentId).remove();
    await discussion.save();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
