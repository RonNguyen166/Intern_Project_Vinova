import express from "express";
import mongoose from "mongoose";
//import TagController from "../Tags/tag.controller";
import { ITag, Tag } from "./../../common/models/tag.model";
import PostService from "./post.services";

export default class PostController {
  private postService: PostService = new PostService();
  public createPost = async <PostController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let postObj: any = {};
      postObj = { ...req.body };

      /*user_id*/
      if (!req.authenticatedUser) {
        throw "Please login to create post";
      }
      postObj.user_id = req.authenticatedUser._conditions._id;

      if(req.body.category == "vibonus"){
        
      }

      /*tags*/
      let tags: any = { ...req.body.tags };
      let tagIds: any = [];
      await Promise.all(
        tags.map(async (tagString: any) => {
          let tag = await Tag.findOne({ name: tagString });
          if (!tag) {
            try {
              tag = await Tag.create({
                name: tagString,
                amount: 1,
              });
              console.log(tagIds);
              tagIds.push(tag._id);
            } catch (err) {
              throw err;
            }
          } else {
            try {
              tagIds.push(tag._id);
              tag.amount += 1;
              await tag.save();
            } catch (err) {
              throw err;
            }
          }
        })
      );

      postObj.tag = tagIds;
      postObj.views = 0;

      const post = await this.postService.createPost(req.body);
      res.status(201).json({
        status: "success",
        data: {
          post,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getAllPost = async <PostController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const posts = await this.postService.getAllPost(req.query);
    res.status(200).json({
      status: "success",
      length: posts.length,
      data: posts,
    });
  };

  public updatePost = async <PostController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const post = await this.postService.updatePost(
        req.params.postId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          post,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public deletePost = async <PostController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const post = await this.postService.deletePost(req.params.postId);
      res.status(200).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
}
