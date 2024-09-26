import { Like } from '../../database/models/like';

const createLike = async (postId: string, userId: string) => {
    const like = new Like({ postId, userId });
    return await like.save();
};

const getLikesByPostId = async (postId: string) => {
    return await Like.find({ postId }).populate('userId', 'names'); // Populate userId with user names
};

const getLikeById = async (likeId: string) => {
    return await Like.findById(likeId);
};

const deleteLike = async (likeId: string) => {
    return await Like.findByIdAndDelete(likeId);
};



// Check if a user has liked a post
const userHasLikedPost = async (postId: string, userId: string) => {
    return await Like.findOne({ postId, userId });
};

export default {
    createLike,
    getLikesByPostId,
    getLikeById,
    deleteLike,
    userHasLikedPost,
};
