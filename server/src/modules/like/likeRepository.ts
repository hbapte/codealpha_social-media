import { Like } from '../../database/models/like';
import { Post } from '../../database/models/post';

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


const addLike = async (postId: string, likeId: string) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { $addToSet: { likes: likeId } },
        { new: true }
    );
};

const removeLike = async (postId: string, likeId: string) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { $pull: { likes: likeId } },
        { new: true }
    );
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
    addLike,
    removeLike,
};
