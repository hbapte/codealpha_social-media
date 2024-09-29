import { User } from '../../database/models/user';

const getUserById = async (userId: string) => {
    return await User.findById(userId).select('-password'); // Exclude password from the result
};


const getAllUsers = async () => {
    return await User.find().select('-password -verificationToken -resetToken -role -emailVerificationTokenCreated -emailVerified -__v');
};


const updateUser = async (userId: string, updateData: Partial<{ names: string; username: string; email: string; }>) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password'); 
};

const addFollower = async (userId: string, followerId: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $addToSet: { followers: followerId } },  // Add follower if not already present
        { new: true }
    );
};

// Remove a follower from the user
const removeFollower = async (userId: string, followerId: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $pull: { followers: followerId } },  // Remove the follower from the list
        { new: true }
    );
};

// Add a user to following list
const addFollowing = async (userId: string, followingId: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $addToSet: { following: followingId } },  // Add following if not already present
        { new: true }
    );
};

// Remove a user from the following list
const removeFollowing = async (userId: string, followingId: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $pull: { following: followingId } },  // Remove the following user
        { new: true }
    );
};

// Add a post to the user's post array
const addPost = async (userId: string, postId: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $addToSet: { posts: postId } },  // Add the post ID to the user's posts array
        { new: true }
    );
};

// Remove a post from the user's post array
const removePost = async (userId: string, postId: string) => {
    return await User.findByIdAndUpdate(
        userId,
        { $pull: { posts: postId } },  // Remove the post ID from the user's posts array
        { new: true }
    );
};


export default {
    getUserById,
    updateUser,
    getAllUsers,
    addFollower,
    removeFollower,
    addFollowing,
    removeFollowing,
    addPost,
    removePost,
};
