// server\src\modules\follow\followRepository.ts
import { Follow } from '../../database/models/follow';

// Create a follow entry
const createFollow = async (followerId: string, followingId: string) => {
    const follow = new Follow({ followerId, followingId });
    return await follow.save();
};

// Get followers by user ID and populate user details
const getFollowersByUserId = async (userId: string) => {
    return await Follow.find({ followingId: userId })
        .populate('followerId', 'names profilePicture') // Populating names and profile picture
        .select('followerId');
};

// Get following users by user ID and populate user details
const getFollowingByUserId = async (userId: string) => {
    return await Follow.find({ followerId: userId })
        .populate('followingId', 'names profilePicture') // Populating names and profile picture
        .select('followingId');
};

// Check if a user is following another user
const userIsFollowing = async (followerId: string, followingId: string) => {
    return await Follow.findOne({ followerId, followingId });
};



// Delete a follow entry
const deleteFollow = async (followerId: string, followingId: string) => {
    return await Follow.findOneAndDelete({ followerId, followingId });
};

// Get all followers across the platform
const getAllFollowers = async () => {
    return await Follow.find()
        .populate('followerId', 'names profilePicture') // Populate the follower details
        .select('followerId followingId');
};

// Get all following across the platform
const getAllFollowing = async () => {
    return await Follow.find()
        .populate('followingId', 'names profilePicture') // Populate the following user details
        .select('followerId followingId');
};



export default {
    createFollow,
    getFollowersByUserId,
    getFollowingByUserId,
    deleteFollow,
    userIsFollowing,
    getAllFollowers,
    getAllFollowing
};
