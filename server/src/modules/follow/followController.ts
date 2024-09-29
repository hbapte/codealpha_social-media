// server\src\modules\follow\followController.ts
import { Request, Response } from 'express';
import followRepository from './followRepository';
import notificationRepository from '../notification/notificationRepository'; // Import the notification repository
import httpStatus from 'http-status';
import { getSocketInstance } from '../../services/socket';
import userRepository from '../user/userRepository';

interface User {
    id: string;
    names?: string;
    role?: string;
}

const createFollow = async (req: Request, res: Response) => {
    const user = req.user as User;
    const followerId = user?.id;
    const followingId = req.params.userId; 

    try {
        // Check if the user is already following
        const existingFollow = await followRepository.userIsFollowing(followerId, followingId);
        if (existingFollow) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'You are already following this user.' });
        }

        const newFollow = await followRepository.createFollow(followerId, followingId);

        await userRepository.addFollower(followingId, followerId); // Update followers of the followed user
        await userRepository.addFollowing(followerId, followingId); // Update following of the follower user
        
        // Notify the user being followed
       const notification = await notificationRepository.notifyUser('follow', followingId, followerId, `/users/${followerId}`);

        // Emit real-time notification to the user being followed
        const io = getSocketInstance();
        io.to(followingId).emit('receiveNotification', notification);       
        
        res.status(httpStatus.CREATED).json({ follow: newFollow });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getFollowers = async (req: Request, res: Response) => {
    const userId = req.params.userId; // Get the user ID to retrieve followers for

    try {
        const followers = await followRepository.getFollowersByUserId(userId);
        res.status(httpStatus.OK).json({ followers });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const getFollowing = async (req: Request, res: Response) => {
    const userId = req.params.userId; // Get the user ID to retrieve following for

    try {
        const following = await followRepository.getFollowingByUserId(userId);
        res.status(httpStatus.OK).json({ following });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

const deleteFollow = async (req: Request, res: Response) => {
    const user = req.user as User;
    const followerId = user?.id; 
    const followingId = req.params.userId; 

    try {
        await followRepository.deleteFollow(followerId, followingId);

        await userRepository.removeFollower(followingId, followerId);
        await userRepository.removeFollowing(followerId, followingId);
        
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
    }
};

export default {
    createFollow,
    getFollowers,
    getFollowing,
    deleteFollow,
};
