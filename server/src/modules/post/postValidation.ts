import { body, param } from 'express-validator';

const validateCreatePost = [
    body('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ max: 500 })
        .withMessage('Content must be at most 500 characters long'),
    body('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL'),
];

const validateUpdatePost = [
    param('postId')
        .isMongoId()
        .withMessage('Invalid post ID'),
    body('content')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Content must be at most 500 characters long'),
    body('image')
        .optional()
        .isURL()
        .withMessage('Image must be a valid URL'),
];

export default {
    validateCreatePost,
    validateUpdatePost,
};
