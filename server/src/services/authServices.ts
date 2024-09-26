import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../modules/auth/authRepository';

class AuthService {
  // Hash the user password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Validate password
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  generateToken(user: any): string {
    return jwt.sign({ userId: user._id, email: user.email }, 'jwt_secret', { expiresIn: '1h' });
  }
}

export default new AuthService();
