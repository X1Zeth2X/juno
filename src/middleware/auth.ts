import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';

import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
  Strategy,
  VerifyCallback
} from 'passport-jwt';
import { User } from '@prisma/client';

import UserRepository from '../db/userRepository';
import { filterUser } from '../helpers/filter';
import getClient from '../db/prismaClient';

// Instantiate User handler.
const userHandler = new UserRepository(getClient());

// Local JWT
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'ch4ng31nPr0d',
}

const verify: VerifyCallback = async (payload, done) => {
  try {
    const user = await userHandler.getById(payload.sub);

    if (user) {
      const filteredUser = filterUser(user);
      return done(null, filteredUser);
    }

    return done(null, false)

  } catch (error) {
    return done(error, null);
  }
}

const strategy: Strategy = new JWTStrategy(options, verify);

// Issue JWT Token
interface JWTData {
  token: string;
  expires: string;
}

const issueJWT = (user: User): JWTData => {
  const _id = user.id;
  const expiresIn = '1d';

  // IMPORTANT: Set JWT_SECRET in dotenv!
  const secret: string = process.env.JWT_SECRET || 'ch4ng31nPr0d';

  // Create JWT Payload.
  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  }

  const signedToken = jsonwebtoken.sign(payload, secret, {
    expiresIn: expiresIn
  })

  return {
    token: signedToken,
    expires: expiresIn,
  }
}

export default passport.use(strategy);
export { issueJWT, JWTData };