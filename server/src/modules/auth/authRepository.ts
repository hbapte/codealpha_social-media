import User, { IUser } from '../../database/models/user'; 


const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
}

const findUserByUsername = async (username: string): Promise<IUser | null> => {
  return await User.findOne({ username });
} 

const updateUser = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
}

const getUserById = async (userId: string): Promise<IUser | null> => {
  return await User.findById (userId);
}

const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
}


export default {
  createUser,
  findUserByEmail,
  findUserByUsername,
  updateUser,
  getUserById,
  getAllUsers
};