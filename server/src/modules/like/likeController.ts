// src/modules/like/likeController.ts
import { Request, Response } from 'express';
import likeRepository from './likeRepository';
import notificationRepository from '../notification/notificationRepository'; 
import postRepository from '../post/postRepository';
import httpStatus from 'http-status';
import { getSocketInstance } from '../../services/socket';
import userRepository from '../user/userRepository';

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
        const existingLike = await likeRepository.userHasLikedPost(postId, userId);
        if (existingLike) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'You have already liked this post.' });
        }

        const newLike = await likeRepository.createLike(postId, userId);
    
        const postAuthorId = await postRepository.getPostAuthorId(postId);
        
        await postRepository.addLike(postId, userId);

        if (postAuthorId) {
            const userDetails = await userRepository.getUserById(userId);
            const username = userDetails?.username;

            if (!username) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'User details not found' });
            }

            const notification = await notificationRepository.notifyUser(
                'like',
                postAuthorId.toString(),
                username, 
                `/posts/${postId}`,
                `User ${username} liked your post.` 
            );

            const io = getSocketInstance();
            io.to(postAuthorId.toString()).emit('notification', notification);
        }

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
    const likeId = req.params.likeId; 

    try {
        const like = await likeRepository.getLikeById(likeId);
        if (!like) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Like not found' });
        }

        await likeRepository.deleteLike(likeId);

        await postRepository.removeLike(like.postId.toString(), like.userId.toString());
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
