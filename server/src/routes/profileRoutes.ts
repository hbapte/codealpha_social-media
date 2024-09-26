// server/src/modules/user/userRoutes.ts
import { Router } from 'express';
import userController from '../modules/user/userController';
import sessionMiddleware from '../middlewares/sessionMiddleware';

const profileRouter = Router();

profileRouter.get('/profile', sessionMiddleware, userController.viewProfile); 
profileRouter.put('/profile', sessionMiddleware, userController.editProfile); 

export default profileRouter;
