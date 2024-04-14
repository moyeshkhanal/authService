import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
    email: string;
    username: string;
    password: string;
    roles: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserDoc extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ['user'] },
}, {
    // Automatically include createdAt and updatedAt fields
    timestamps: true 
});

userSchema.pre<UserDoc>('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDoc>('User', userSchema);

export default User;
