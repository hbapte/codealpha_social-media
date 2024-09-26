// src/modules/comment/commentController.ts
import { Request, Response } from 'express';
import commentRepository from './commentRepository';
import notificationRepository from '../notification/notificationRepository'; // Import the notification repository
import httpStatus from 'http-status';
import postRepository from '../post/postRepository';

interface User {
    id: string;
    names?: string;
    role?: string;
}

const createComment = async (req: Request, res: Response) => {
    const { content } = req.body;
    const postId = req.params.postId; 

    const user = req.user as User;
    const userId = user?.id; 
    
    try {
        const newComment = await commentRepository.createComment(postId, userId, content);
        
        const postAuthorId = await postRepository.getPostAuthorId(postId);
        
        // Notify the post author only if postAuthorId is defined
        if (postAuthorId) {
            await notificationRepository.notifyUser('comment', postAuthorId.toString(), userId, `/posts/${postId}`);
        }
        
        res.status(httpStatus.CREATED).json({ comment: newComment });
        
        res.status(httpStatus.CREATED).json({ comment: newComment });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getComments = async (req: Request, res: Response) => {
    const postId = req.params.postId;

    try {
        const comments = await commentRepository.getCommentsByPostId(postId);
        res.status(httpStatus.OK).json({ comments });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const updatedComment = await commentRepository.updateComment(commentId, content);
        if (!updatedComment) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'Comment not found' });
        }
        res.status(httpStatus.OK).json({ comment: updatedComment });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;

    try {
        await commentRepository.deleteComment(commentId);
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export default {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
