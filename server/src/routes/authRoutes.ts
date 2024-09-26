import authController from '../modules/auth/authContoller';
import { registerValidation, loginValidation } from '../modules/auth/authValidation';
import express from 'express';
import validateRequest from '../middlewares/validation';  

const authRouter = express.Router();

authRouter.post('/register', registerValidation, validateRequest, authController.registerUser);
authRouter.post('/login', loginValidation, validateRequest, authController.loginUser);

export default authRouter;
