import { Request, Response } from 'express';
import { isEmpty } from "lodash";

import { CreatePostData, UpdatePostData, PostInterface } from "../db/postRepository";
import { filterPost } from '../helpers/filter';
import { badRequestResponse, serverErrResponse } from "../helpers/response";
import logger from '../middleware/logger';

const postNotFound = (res: Response) => {
  res.status(404).json({
    message: 'Post not found.',
    error: 'post_404',
  });
}

class PostHandler {
  postRepository: PostInterface;

  constructor(postRepository: PostInterface) {
    this.postRepository = postRepository;
  }

  get = async (req: Request, res: Response) => {
    // Grab the Post ID
    const postID: number = Number(req.params.postID);

    try {
      const post = await this.postRepository.getById(postID, true);

      if (!post) {
        return postNotFound(res);
      }

      res.status(200).json({
        message: 'Sent post data.',
        post: filterPost(post)
      });

    } catch (error) {
      logger.log('error', `An error occured while getting a post --> ${error}`);
      serverErrResponse(res);
    }
  }

  create = async (req: Request, res: Response) => {
    // Grab json body content and check if it exists.
    const createData: CreatePostData = req.body;
    if (isEmpty(createData) || !createData.title || !createData.content) {
      return badRequestResponse(res, 'Invalid post creation data.');
    }

    // Get current user
    const currentUser: any = req.user;

    try {
      const newPost = await this.postRepository.create(currentUser.email, {
        title: createData.title,
        content: createData.content,
        imageUrl: createData.imageUrl
      });

      if (!newPost) {
        return serverErrResponse(res);
      }

      logger.log('info', `User <Email: ${currentUser.email}> created a new post <ID: ${newPost.id}>.`);

      res.status(201).json({
        message: 'Created a new post.',
        post: filterPost(newPost, true),
      });

    } catch (error) {
      logger.log('error', `An error occured while creating a post --> ${error}`);
      serverErrResponse(res);
    }
  }
    
  update = async (req: Request, res: Response) => {
    // Grab post id and update data
    const postID: number = Number(req.params.postID);
    const postUpdateData: UpdatePostData = req.body;

    const currentUser: any = req.user;

    try {
      // Check if the post exists
      const post = await this.postRepository.getById(postID, true);

      if (!post) {
        return postNotFound(res);
      }

      // Check if the current user matches the post author
      if ((post as any).author.email !== currentUser.email) {
        return res.status(403).json({
          message: 'You do not own this post.',
          error: 'insufficient_permission',
        });
      }

      const updatedPost = await this.postRepository.update(postID, postUpdateData);

      if (!updatedPost) {
        return serverErrResponse(res);
      }

      logger.log('info', `User <Email: ${currentUser.email}> updated post <ID: ${post.id}>.`);

      res.status(200).json({
        message: 'Updated post data.',
        post: filterPost(updatedPost, true),
      });

    } catch (error) {
      logger.log('error', `An error occured while updating a post --> ${error}`);
      serverErrResponse(res);
    }
  }

  delete = async (req: Request, res: Response) => {
    // Grab post id
    const postID: number = Number(req.params.postID);
    const currentUser: any = req.user;

    try {
      // Check if the post exists
      const post = await this.postRepository.getById(postID, true);

      if (!post) {
        return postNotFound(res);
      }

      // Check if the current user matches the post author
      if ((post as any).author.email !== currentUser.email) {
        return res.status(403).json({
          message: 'You do not own this post.',
          error: 'insufficient_permission',
        });
      }

      logger.log('info', `User <Email: ${currentUser.email}> deleted post <ID: ${post.id}>.`);

      // Delete post
      this.postRepository.delete(postID);
      
      res.status(204).json({
        message: 'Deleted post.'
      });
      
    } catch (error) {
      logger.log('error', `An error occured while updating a post --> ${error}`);
      serverErrResponse(res);
    }
  }
}

export default PostHandler;