import express from "express";
import { registerController } from "../modules/user/controllers/registerController";
import loginController from "../modules/user/controllers/loginController";
import { requestNewVerificationLinkController } from "../modules/user/controllers/requestNewVerificationLinkController";
import resetPasswordController from "../modules/user/controllers/resetPasswordController";
import forgotPasswordController from "../modules/user/controllers/forgotPasswordController";
import verifyResetTokenController  from "../modules/user/controllers/verifyResetTokenController";
import verifyEmailController from "../modules/user/controllers/verifyEmailController";
import { loginSchema, userSchema } from "../modules/user/validations/userValidations";
import validation from "../middlewares/validation";

const userRouter = express.Router();

// userRouter.post("/register", validation(userSchema), registerController, );
// userRouter.post("/login", validation(loginSchema), loginController);
userRouter.get("/verify", verifyEmailController);
userRouter.post("/request-new-verification-link", requestNewVerificationLinkController);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.get("/verify-reset-token", verifyResetTokenController);
userRouter.post("/reset-password", resetPasswordController);

export default userRouter;

