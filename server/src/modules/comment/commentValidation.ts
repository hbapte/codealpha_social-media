import { body, param } from 'express-validator';

const validateCreateComment = [
    param('postId').isMongoId().withMessage('Invalid post ID'),
    body('content').notEmpty().withMessage('Content is required'),
];

const validateUpdateComment = [
    param('commentId').isMongoId().withMessage('Invalid comment ID'),
    body('content').notEmpty().withMessage('Content is required'),
];

export default {
    validateCreateComment,
    validateUpdateComment,
};
