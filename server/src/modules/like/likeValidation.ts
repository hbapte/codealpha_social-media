import { param } from 'express-validator';

const validateCreateLike = [
    param('postId').isMongoId().withMessage('Invalid post ID'),
];

const validateDeleteLike = [
    param('likeId').isMongoId().withMessage('Invalid like ID'),
];

export default {
    validateCreateLike,
    validateDeleteLike,
};
