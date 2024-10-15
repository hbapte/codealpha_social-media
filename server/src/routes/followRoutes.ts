// src/routes/followRoutes.ts
import { Router } from 'express';
import followController from '../modules/follow/followController';
import authMiddleware from '../middlewares/authorization';
import followValidation from '../modules/follow/followValidation';
import validateRequest from '../middlewares/validation';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const followRouter = Router();

followRouter.post('/:userId', sessionMiddleware, followValidation.validateCreateFollow, validateRequest, followController.createFollow);
followRouter.get('/followers/:userId', followController.getFollowers);
followRouter.get('/following/:userId', followController.getFollowing);
followRouter.get('/is-following/:userId',sessionMiddleware, followController.userIsFollowing);
followRouter.delete('/:userId', sessionMiddleware, followValidation.validateDeleteFollow, validateRequest, followController.deleteFollow);
followRouter.get('/followers',sessionMiddleware, followController.getAllFollowers);
followRouter.get('/following',sessionMiddleware, followController.getAllFollowing);

export default followRouter;
