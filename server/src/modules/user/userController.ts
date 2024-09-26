// server/src/modules/user/userController.ts
import { Request, Response } from 'express';
import userRepository from './userRepository';
import httpStatus from 'http-status';

interface User {
    id: string;
    names?: string;
    username?: string;
    email?: string;
}

const viewProfile = async (req: Request, res: Response) => {
   
    const user = req.user as User;
    const userId = user?.id;

    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(httpStatus.OK).json({ user });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const editProfile = async (req: Request, res: Response) => {
    const user = req.user as User;
    const userId = user?.id;
    const updateData = req.body;

    try {
        const updatedUser = await userRepository.updateUser(userId, updateData);
        if (!updatedUser) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(httpStatus.OK).json({ user: updatedUser });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export default {
    viewProfile,
    editProfile,
};
