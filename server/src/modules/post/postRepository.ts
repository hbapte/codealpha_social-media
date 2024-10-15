// server/src/modules/post/postRepository.ts
import { Post } from "../../database/models/post";
import User from "../../database/models/user";

const createPost = async (postData: any) => {
    return await Post.create(postData);
};

const getPosts = async () => {
    return await Post.find().sort({ createdAt: -1 })
    .populate('userId', 'names username')
    .populate('likes', 'names username')
    .populate('comments', 'content createdAt userId')
    ;
};

const getPostById = async (postId: string) => {
    return await Post.findById(postId)
    .populate('userId', 'names avatar username')
    .populate('likes', 'names username')
    .populate('comments', 'content createdAt userId')
    ;
};

// New method to get the post's author ID
const getPostAuthorId = async (postId: string) => {
    const post = await Post.findById(postId).select('userId'); // Assuming userId is the author
    return post?.userId; // Return the author's userId
};

const updatePost = async (postId: string, updateData: any) => {
    return await Post.findByIdAndUpdate(postId, updateData, { new: true });
};

const deletePost = async (postId: string) => {
    return await Post.findByIdAndDelete(postId);
};

const addPost = async (userId: string, postId: string) => {
    return await User.findByIdAndUpdate (
        userId,
        { $addToSet: { posts: postId } },
        { new: true }
    );
}

const removePost = async (userId: string, postId: string) => {
    return await User.findByIdAndUpdate (
        userId,
        { $pull: { posts: postId } },
        { new: true }
    );
}

const updatePostLikeCount = async (postId: string, likeCount: number) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { likeCount },
        { new: true }
    );
}

const addComment = async (postId: string, commentId: string) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { $addToSet: { comments: commentId } },
        { new: true }
    );
}

const removeComment = async (postId: string, commentId: string) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { $pull: { comments: commentId } },
        { new: true }
    );
}

const addLike = async (postId: string, likeId: string) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { $addToSet: { likes: likeId } },
        { new: true }
    );
}

const removeLike = async (postId: string, likeId: string) => {
    return await Post.findByIdAndUpdate
    (
        postId,
        { $pull: { likes: likeId } },
        { new: true }
    );
}

export default {
    createPost,
    getPosts,
    getPostById,
    getPostAuthorId, // Export the new method
    updatePost,
    deletePost,
    addPost,
    removePost,
    updatePostLikeCount,
    addComment,
    removeComment,
    addLike,
    removeLike
};
