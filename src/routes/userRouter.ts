import { Router } from 'express';

import getClient from '../db/prismaClient';
import UserRepository from '../db/userRepository';
import UserHandler from '../handlers/userHandler';

const router = Router();

const repository = new UserRepository(getClient());
const handler = new UserHandler(repository);

router.get('/:email', handler.getByEmail);

export { router as userRoutes };