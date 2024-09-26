import { Router } from 'express';
import likeController from '../modules/like/likeController';
import authMiddleware from '../middlewares/authorization';
import likeValidation from '../modules/like/likeValidation';
import validateRequest from '../middlewares/validation';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const likeRouter = Router();

likeRouter.use(sessionMiddleware);

likeRouter.post('/:postId', likeValidation.validateCreateLike, validateRequest, likeController.createLike);
likeRouter.get('/:postId', likeController.getLikes);
likeRouter.delete('/:likeId', likeValidation.validateDeleteLike, validateRequest, likeController.deleteLike);

export default likeRouter;
