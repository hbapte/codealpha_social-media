import express from "express";
import { registerController } from "../modules/user/controllers/registerController";
import loginController from "../modules/user/controllers/loginController";
import { requestNewVerificationLinkController } from "../modules/user/controllers/requestNewVerificationLinkController";
import resetPasswordController from "../modules/user/controllers/resetPasswordController";
import forgotPasswordController from "../modules/user/controllers/forgotPasswordController";
import verifyResetTokenController  from "../modules/user/controllers/verifyResetTokenController";
import verifyEmailController from "../modules/user/controllers/verifyEmailController";

const userRouter = express.Router();

userRouter.get("/verify", verifyEmailController);
userRouter.post("/request-new-verification-link", requestNewVerificationLinkController);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.get("/verify-reset-token", verifyResetTokenController);
userRouter.post("/reset-password", resetPasswordController);

export default userRouter;

