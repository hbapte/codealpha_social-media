// src/routes/commentRoutes.ts
import { Router } from 'express';
import commentController from '../modules/comment/commentController';
import authMiddleware from '../middlewares/authorization';
import commentValidation from '../modules/comment/commentValidation';
import validateRequest from '../middlewares/validation';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const commentRouter = Router();
commentRouter.use(sessionMiddleware);

commentRouter.post('/:postId',  commentValidation.validateCreateComment, validateRequest, commentController.createComment);
commentRouter.get('/:postId', commentController.getComments);
commentRouter.put('/:commentId',  commentValidation.validateUpdateComment, validateRequest, commentController.updateComment);
commentRouter.delete('/:commentId', commentController.deleteComment);

export default commentRouter;
