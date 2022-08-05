import express from "express";
import TagController from "./tag.controller";
import {create} from "./tag.schema";
import validate from "./../../middlewares/validate.middleware";
import {isAuthen, isAuthor} from "./../../middlewares/authen.middleware";

const tagController = new TagController();
const router = express.Router();

router.route("/").get(tagController.getAllTags).post(isAuthen, validate(create),tagController.createTag);
router.route("/trending").get(tagController.getTrendingTag);

export default router;
