
import { param } from 'express-validator';

const validateCreateFollow = [
    param('userId').isMongoId().withMessage('Invalid user ID'),
];

const validateDeleteFollow = [
    param('userId').isMongoId().withMessage('Invalid user ID'),
];

export default {
    validateCreateFollow,
    validateDeleteFollow,
};
