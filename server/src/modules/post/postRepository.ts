// server/src/modules/post/postRepository.ts
import { Post } from "../../database/models/post";

const createPost = async (postData: any) => {
    return await Post.create(postData);
};

const getPosts = async () => {
    return await Post.find().sort({ createdAt: -1 }).populate('userId', 'names username');
};

const getPostById = async (postId: string) => {
    return await Post.findById(postId).populate('userId', 'names username');
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

export default {
    createPost,
    getPosts,
    getPostById,
    getPostAuthorId, // Export the new method
    updatePost,
    deletePost,
};
