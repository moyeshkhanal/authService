import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, comparePassword } from '../repository/userRepository.js';


dotenv.config(); // Loads environment variables from a .env file into process.env

const authRouter: Router = express.Router();

interface AuthRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}
authRouter.get('/api', (req: Request, res: Response) => {
    res.json({ message: "Auth API is working!" });
});

authRouter.post('/register', async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await createUser(email, password);
        const token = jwt.sign({ userId: user.insertedId }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        res.status(201).send({ token });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
});

authRouter.post('/login', async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user || !(await comparePassword(user.password, password))) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        res.send({ token });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
});

export default authRouter;
