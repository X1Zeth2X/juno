import passport from 'passport';
import { Router } from 'express';

import PostRepository from '../db/postRepository';
import getClient from '../db/prismaClient';
import PostHandler from '../handlers/postHandler';

const router = Router();

const repository = new PostRepository(getClient());
const handler = new PostHandler(repository);

router.get(
  '/:postID',
  handler.get
)

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  handler.create
);

router.put(
  '/:postID',
  passport.authenticate('jwt', { session: false }),
  handler.update
)

router.delete(
  '/:postID',
  passport.authenticate('jwt', { session: false }),
  handler.delete
)

export { router as postRoutes };