import { User } from '../../database/models/user';

const getUserById = async (userId: string) => {
    return await User.findById(userId).select('-password'); // Exclude password from the result
};

const updateUser = async (userId: string, updateData: Partial<{ names: string; username: string; email: string; }>) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password'); 
};

export default {
    getUserById,
    updateUser,
};
