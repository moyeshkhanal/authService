// repositories/userRepository.ts
import { getDb } from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const createUser = async (email: string, password: string) => {
    const db = getDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return db.collection('users').insertOne({
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    });
};

export const findUserByEmail = async (email: string) => {
    const db = getDb();
    return db.collection('users').findOne({ email });
};

export const comparePassword = async (userPassword: string, candidatePassword: string): Promise<boolean> => {
    return bcrypt.compare(candidatePassword, userPassword);
};
