// src/modules/comment/commentRepository.ts
import { Comment } from '../../database/models/comment';

const createComment = async (postId: string, userId: string, content: string) => {
    const comment = new Comment({ postId, userId, content });
    return await comment.save();
};



const getCommentsByPostId = async (postId: string) => {
    return await Comment.find({ postId }).populate('userId', 'names'); 
};

const getCommentById = async (commentId: string) => {
    return await Comment.findById(commentId);
};

const updateComment = async (commentId: string, content: string) => {
    return await Comment.findByIdAndUpdate(commentId, { content, updatedAt: new Date() }, { new: true });
};

const deleteComment = async (commentId: string) => {
    return await Comment.findByIdAndDelete(commentId);
};

export default {
    createComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment,
};
