import { Router } from 'express';

import { authRoutes } from './authRouter';
import { userRoutes } from './userRouter';
import { postRoutes } from './postRouter';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);

export { router as routeIndex };