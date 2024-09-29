// server\src\modules\users\userRepositories.ts
import { User } from '../../database/models/user';

const getAllUsers = async () => {
    return await User.find()
      .select('-password -verificationToken -resetToken -role -emailVerificationTokenCreated -emailVerified -__v')
      .populate('followers', 'names username')
      .populate('following', 'names username')
      .populate('posts', 'content createdAt');
  };
  

export default {
    getAllUsers
};
