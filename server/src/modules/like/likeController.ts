// src/modules/like/likeController.ts
import { Request, Response } from 'express';
import likeRepository from './likeRepository';
import notificationRepository from '../notification/notificationRepository'; 
import postRepository from '../post/postRepository';
import httpStatus from 'http-status';
import { getSocketInstance } from '../../services/socket';


interface User {
    id: string;
    names?: string;
    role?: string;
}

const createLike = async (req: Request, res: Response) => {
    const postId = req.params.postId; 
    const user = req.user as User;
    const userId = user?.id;

    try {
        // Check if user has already liked the post
        const existingLike = await likeRepository.userHasLikedPost(postId, userId);
        if (existingLike) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'You have already liked this post.' });
        }

        const newLike = await likeRepository.createLike(postId, userId);
        
        // Get the post's author ID
        const postAuthorId = await postRepository.getPostAuthorId(postId);

        if (postAuthorId) {
          const notification =  await notificationRepository.notifyUser('like', postAuthorId.toString(), userId, `/posts/${postId}`);

            // Notify the post author
            

          const io = getSocketInstance();
            io.to(postAuthorId.toString()).emit('notification', notification);
        }
        
        // Notify the post author
        
          
        res.status(httpStatus.CREATED).json({ like: newLike });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getLikes = async (req: Request, res: Response) => {
    const postId = req.params.postId;

    try {
        const likes = await likeRepository.getLikesByPostId(postId);
        res.status(httpStatus.OK).json({ likes });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const deleteLike = async (req: Request, res: Response) => {
    const likeId = req.params.likeId; // Assuming likeId is passed as a route parameter

    try {
        await likeRepository.deleteLike(likeId);
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export default {
    createLike,
    getLikes,
    deleteLike,
};
