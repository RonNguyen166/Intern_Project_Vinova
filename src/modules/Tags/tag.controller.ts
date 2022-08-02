import express from "express";
import TagService from "./tag.services";

export default class TagController {
  private tagService: TagService = new TagService();
  public getAllTags = async <TagController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const tags = await this.tagService.getAllTag();
      res.status(200).json({
        status: "success",
        length: tags.length,
        data: {
          tags,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getTrendingTag = async <TagController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const tags = await this.tagService.getTrendingTag();
      res.status(200).json({
        status: "success",
        length: tags.length,
        data: {
          tags,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public createTag = async <TagController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const tag = await this.tagService.createTag(req.body);
      res.status(201).json({
        status: "success",
        data: {
          tag,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
}
