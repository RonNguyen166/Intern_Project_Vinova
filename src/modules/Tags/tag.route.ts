import express from "express";
import TagController from "./tag.controller";

const tagController = new TagController();
const router = express.Router();

router.route("/").get(tagController.getAllTags).post(tagController.createTag);
router.route("/trending").get(tagController.getTrendingTag);

export default router;
