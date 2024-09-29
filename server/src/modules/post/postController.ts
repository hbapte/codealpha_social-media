// src/modules/post/postController.ts
import { Request, Response } from 'express';
import postRepository from './postRepository';
import httpStatus from 'http-status';
import userRepository from '../user/userRepository';

interface User {
    id: string;
    names?: string;
    role?: string;
}


const createPost = async (req: Request, res: Response) => {
    const { content, image } = req.body;
   
    const user = req.user as User;
    const userId = user?.id; 
       try {
        const newPost = await postRepository.createPost({ userId, content, image });        
        await userRepository.addPost(userId, newPost._id);
        res.status(httpStatus.CREATED).json({ post: newPost });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await postRepository.getPosts();
        res.status(httpStatus.OK).json({ posts });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getPost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await postRepository.getPostById(postId);
        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Post not found' });
        }
        res.status(httpStatus.OK).json({ post });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const updatePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content, image } = req.body;

    try {
        const updatedPost = await postRepository.updatePost(postId, { content, image, updatedAt: Date.now() });
        if (!updatedPost) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Post not found' });
        }
        res.status(httpStatus.OK).json({ post: updatedPost });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const deletePost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    const user = req.user as User;
    const userId = user?.id; 

    try {
        await postRepository.deletePost(postId);

        // await userRepository.removePost(userId, postId._id);
        res.status(httpStatus.NO_CONTENT).json({message: 'Post deleted successfully'});
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export default {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
};
