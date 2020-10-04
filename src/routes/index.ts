import { Router } from 'express';

import { authRoutes } from './authRouter';
import { postRoutes } from './postRouter';

const router = Router();

router.use('/auth', authRoutes);
router.use('/post', postRoutes);

export { router as routeIndex };