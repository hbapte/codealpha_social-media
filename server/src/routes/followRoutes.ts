// src/routes/followRoutes.ts
import { Router } from 'express';
import followController from '../modules/follow/followController';
import authMiddleware from '../middlewares/authorization';
import followValidation from '../modules/follow/followValidation';
import validateRequest from '../middlewares/validation';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const followRouter = Router();

followRouter.post('/:userId', sessionMiddleware, followValidation.validateCreateFollow, validateRequest, followController.createFollow);
followRouter.get('/:userId/followers', followController.getFollowers);
followRouter.get('/:userId/following', followController.getFollowing);
followRouter.delete('/:userId', sessionMiddleware, followValidation.validateDeleteFollow, validateRequest, followController.deleteFollow);

export default followRouter;
