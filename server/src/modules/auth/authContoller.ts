// server\src\modules\auth\authContoller.ts
import { Request, Response } from 'express';
import authRepository from './authRepository';
import httpStatus from 'http-status';
import { hashPassword, comparePassword } from '../../utils/passwordutils'; 
import { createSession } from '../../utils/sessionUtils';

const registerUser = async (req: Request, res: Response) => {
    const { names, email, password, username } = req.body;
    
    try {
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ 
                message: 'User already exists' 
            });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await authRepository.createUser({ names, email, password: hashedPassword, username });
        res.status(httpStatus.CREATED).json({ user: {newUser} });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
            message: 'Server error', 
            error 
        });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                message: 'Invalid credentials' 
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                message: 'Invalid credentials' 
            });
        }

        const token = await createSession(user.id, user.names, user.role, '28h'); 

        res.status(httpStatus.OK).json({ 
            message: 'Login successful', 
            token,  
            user: {
                id: user._id,
                names: user.names,
                email: user.email,
                role: user.role
            }
        });

      
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
            message: 'Server error', 
            error 
        });
    }
};

export default {
    registerUser,
    loginUser,
};
