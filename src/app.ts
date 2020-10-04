import express, { Application } from 'express';
import 'dotenv/config';

// Middleware & Utilities
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import logger from './middleware/logger';
import passport from './middleware/auth';
import { routeIndex } from './routes';

const app: Application = express();

// Instantiate Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors({
  optionsSuccessStatus: 200
}));
app.use(morgan('combined'));
app.use(passport.initialize());

// Load imported index routes
app.use(routeIndex);

// Run the application
const port: number = Number(process.env.PORT) || 5000

app.listen(port, () => {
  logger.log('info', `🚀 Server is running on port :${port}`);
});

// Export app for testing.
export default app;