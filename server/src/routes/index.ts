import express from 'express';
import authRouter from './authRoutes';
import userRouter from './userRoutes';
import postRouter from './postRoutes';
import commentRouter from './commentRoutes';
import likeRouter from './likeRoutes';
import followRouter from './followRoutes';
import notificationRouter from './notificationRoutes';
import profileRouter from './profileRoutes';


const router = express.Router();

router.use('/auth', authRouter);
// router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);
router.use('/like', likeRouter);
router.use('/follow', followRouter);
router.use('/notification', notificationRouter);
router.use('/user', profileRouter);


export default router;

