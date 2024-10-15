// server\src\modules\users\userControllers.ts
import userRepository from './userRepositories';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

interface User {
    id: string;
    names?: string;
    username?: string;
    email?: string;
}

const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.getAllUsers();
        res.status(httpStatus.OK).json({ users });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
}

const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const user = await userRepository.getUserByUsername(username);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(httpStatus.OK).json({ user });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
}

export default {
    getAllUser,
    getUserByUsername,
};
