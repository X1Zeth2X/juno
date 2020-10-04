import { Router } from 'express';

import AuthHandler from '../handlers/authHandler';
import getClient from '../db/prismaClient';
import UserRepository from '../db/userRepository';

const router = Router();

const userRepository = new UserRepository(getClient());
const handler = new AuthHandler(userRepository);

router.post('/login', handler.login);
router.post('/signup', handler.signUp);

export { router as authRoutes };