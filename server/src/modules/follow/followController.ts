// server\src\modules\follow\followController.ts
import { Request, Response } from 'express';
import followRepository from './followRepository';
import notificationRepository from '../notification/notificationRepository'; 
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
        const existingFollow = await followRepository.userIsFollowing(followerId, followingId);
        if (existingFollow) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: 'You are already following this user.' });
        }

        const newFollow = await followRepository.createFollow(followerId, followingId);

        // Update the follower/following lists in the User model
        await userRepository.addFollower(followingId, followerId);
        await userRepository.addFollowing(followerId, followingId);
        
        // Fetch the username of the follower
        const followerUser = await userRepository.getUserById(followerId);
        const followerUsername = followerUser?.username;

        if (!followerUsername) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Follower username not found.' });
        }

        // Notify the followed user with the follower's username
        const notificationLink = `/users/${followerId}`;
        const notification = await notificationRepository.notifyUser(
            'follow', 
            followingId, 
            followerUsername, // Use the username instead of ID
            notificationLink,
            `@${followerUsername} started following you.` // Custom content
        );

        // Emit real-time notification to the followed user
        const io = getSocketInstance();
        io.to(followingId).emit('receiveNotification', notification);       
       
        return res.status(httpStatus.CREATED).json({ follow: newFollow });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error while following the user.', error });
    }
};


const getFollowers = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const followers = await followRepository.getFollowersByUserId(userId);
        if (!followers || followers.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'No followers found.' });
        }
        return res.status(httpStatus.OK).json({ followers });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching followers.', error });
    }
};

const getFollowing = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const following = await followRepository.getFollowingByUserId(userId);
        if (!following || following.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'No users being followed.' });
        }
        return res.status(httpStatus.OK).json({ following });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching following.', error });
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

        return res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error unfollowing the user.', error });
    }
};

const userIsFollowing = async (req: Request, res: Response) => {
    const user = req.user as User;
    const followerId = user?.id;
    const followingId = req.params.userId; 

    try {
        const isFollowing = await followRepository.userIsFollowing(followerId, followingId);
       return res.status(httpStatus.OK).json({ isFollowing: !!isFollowing });
    } catch (error) {
        console.error('Error checking follow status:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error checking follow status.', error });
    }
};

const userIsFollower = async (req: Request, res: Response) => {
    const user = req.user as User;
    const followerId = user?.id;
    const followingId = req.params.userId; 

    try {
        const isFollowing = await followRepository.userIsFollowing(followerId, followingId);
        return res.status(httpStatus.OK).json({ isFollowing: !!isFollowing });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error checking follow status.', error });
    }
};


const getAllFollowers = async (req: Request, res: Response) => {
    try {
        const followers = await followRepository.getAllFollowers();
        if (!followers || followers.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'No followers found.' });
        }
        return res.status(httpStatus.OK).json({ followers });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching all followers.', error });
    }
};

const getAllFollowing = async (req: Request, res: Response) => {
    try {
        const following = await followRepository.getAllFollowing();
        if (!following || following.length === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'No users being followed.' });
        }
        return res.status(httpStatus.OK).json({ following });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching all following users.', error });
    }
};

export default {
    createFollow,
    getFollowers,
    getFollowing,
    deleteFollow,
    userIsFollowing,
    getAllFollowers,
    getAllFollowing,
    userIsFollower
};
