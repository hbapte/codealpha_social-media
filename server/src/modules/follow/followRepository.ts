// server\src\modules\follow\followRepository.ts
import { Follow } from '../../database/models/follow';

const createFollow = async (followerId: string, followingId: string) => {
    const follow = new Follow({ followerId, followingId });
    return await follow.save();
};

const getFollowersByUserId = async (userId: string) => {
    return await Follow.find({ followingId: userId }).populate('followerId', 'names'); 
};

const getFollowingByUserId = async (userId: string) => {
    return await Follow.find({ followerId: userId }).populate('followingId', 'names'); 
};

const deleteFollow = async (followerId: string, followingId: string) => {
    return await Follow.findOneAndDelete({ followerId, followingId });
};

const userIsFollowing = async (followerId: string, followingId: string) => {
    return await Follow.findOne({ followerId, followingId });
};

export default {
    createFollow,
    getFollowersByUserId,
    getFollowingByUserId,
    deleteFollow,
    userIsFollowing,
};
