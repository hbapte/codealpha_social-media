//server\src\routes\postRoutes.ts
import { Router } from 'express';
import postController from '../modules/post/postController';
import authMiddleware from '../middlewares/authorization'; 
import postValidation from '../modules/post/postValidation';
import validateRequest from '../middlewares/validation';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const postRouter = Router();

postRouter.use(sessionMiddleware);

postRouter.post('/',  postValidation.validateCreatePost,
    validateRequest, postController.createPost);
postRouter.get('/', postController.getPosts);
postRouter.get('/:postId',postValidation.validateUpdatePost,
    validateRequest, postController.getPost);
postRouter.put('/:postId', postValidation.validateUpdatePost,
    validateRequest, postController.updatePost);
postRouter.delete('/:postId',  postController.deletePost);

export default postRouter;
