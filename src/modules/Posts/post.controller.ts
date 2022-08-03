import express from "express";
import mongoose from "mongoose";
//import TagController from "../Tags/tag.controller";
import { ITag, Tag } from "./../../common/models/tag.model";
import Category from "./../../common/models/category.model";
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
      postObj.user_id = null;


      /*tags*/
      let tags: any = [];
      for(let i = 0; i < req.body.tags.length; i++){
        tags.push(req.body.tags[i]);
      }
      console.log(tags);
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

      /*views*/
      postObj.views = 0;

      /*Category*/
      let categorys = [];
      for(let i = 0; i < req.body.category.length; i++){
        categorys.push(req.body.category[i]);
      }
      console.log(categorys);
      let categoryId: any =[];
      await Promise.all(
        categorys.map(async (categoryString:  any)=>{
          let category = await Category.findOne({name : categoryString});
          if(!category){
            try {
              category = await Category.create({
                name: categoryString,
              });
              console.log(categoryId);
              categoryId.push(category._id);
            } catch (err) {
              throw err;
            }
          } else {
            try {
              categoryId.push(category._id);
              await category.save();
            } catch (err) {
              throw err;
            }
          }
        })
      );

      postObj.category = categoryId;



      const post = await this.postService.createPost(req.body);
      res.status(201).json({
        status: "success",
        data: {
          post,
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
