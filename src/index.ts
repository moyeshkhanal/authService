import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import { connectDB } from './config/database.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// Middleware
app.use(cors());          // Enable CORS
app.use(helmet());        // Helps secure Express apps by setting various HTTP headers
app.use(morgan('dev'));   // HTTP request logger
app.use(express.json());  // Parse JSON bodies
app.use('/api/auth', authRouter);
// Basic Route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// A route example that could be used for testing
app.get('/api', (req: Request, res: Response) => {
    res.json({ message: "API is working!" });
});

// 404 Error Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry, that route does not exist.");
});

// General Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB();
});

