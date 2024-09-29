// server/src/modules/user/userRoutes.ts
import { Router } from 'express';
import sessionMiddleware from '../middlewares/sessionMiddleware';
import userControllers from '../modules/users/userControllers';

const usersRouter = Router();

usersRouter.get('/users', sessionMiddleware, userControllers.getAllUser); 

export default usersRouter;
