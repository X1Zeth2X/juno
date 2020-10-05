import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import logger from '../middleware/logger';
import { badRequestResponse, serverErrResponse } from '../helpers/response';
import { issueJWT, JWTData } from '../middleware/auth';
import { UserInterface } from '../db/userRepository';
import { emailRegex, nameRegex } from '../helpers/regex';
import { filterUser, FilteredUser } from '../helpers/filter';

type AuthResponse = {
  message: string;
  user: FilteredUser;
  jwt: JWTData
}

type LoginData = {
  email: string;
  password: string;
} 

type SignUpData = {
  email: string;
  password: string;
  fullName: string;
  signUpKey?: string;
}

class AuthHandler {
  userRepository: UserInterface;

  constructor(userRepository: UserInterface) {
    this.userRepository = userRepository;
  }

  login = async (req: Request, res: Response) => {
    // Grab json body content and check if it exists.
    const loginData: LoginData = req.body;
    if (isEmpty(loginData) || !loginData.email || !loginData.password) {
      return badRequestResponse(res, 'Invalid login credentials.');
    } 

    try {
      // Check if the user exists
      const user = await this.userRepository.getByEmail(loginData.email);

      if (!user) {
        return res.status(404).json({
          message: 'There are no accounts associated with this email.',
          error: 'user_404',
        });
      }

      // Validate password
      const isValidPassword: boolean = await bcrypt.compare(loginData.password, user.password);

      if (!isValidPassword) {
        return res.status(403).json({
          message: 'Incorrect password, check login credentials.',
          error: 'password_incorrect',
        });
      }

      const loginResponse: AuthResponse = {
        message: 'Logged in.',
        user: filterUser(user),
        jwt: issueJWT(user),
      }

      res.status(200).json(loginResponse);

    } catch (error) {
      logger.log('error', `An error occured while logging in --> ${error}`);
      serverErrResponse(res);
    }
  }

  signUp = async (req: Request, res: Response) => {
    // Grab json body content and check if it exists.
    const signUpData: SignUpData = req.body;
    if (isEmpty(signUpData)) {
      return badRequestResponse(res, 'Sign up data is incomplete!');
    }

    // Validate email and fullName
    if (
      !emailRegex.test(signUpData.email) ||
      !nameRegex.test(signUpData.fullName)
    ) return badRequestResponse(res, 'Invalid signup data.');

    // Check if sign up Key exists in .env
    if (process.env.SIGNUP_KEY) {
      // Check if it matches.
      if (process.env.SIGNUP_KEY !== signUpData.signUpKey) {
        return res.status(403).json({
          message: 'Sign up key is incorrect.',
          error: 'signupkey_incorrect',
        });
      }
    }

    try {
      // Create a new user
      const newUser = await this.userRepository.create({
        email: signUpData.email,
        fullName: signUpData.fullName,
        password: await bcrypt.hash(signUpData.password, 10),
      });

      if (!newUser) {
        return serverErrResponse(res);
      }

      logger.log('info', `User created <ID: ${newUser.id}>`);

      // Generate a new token
      const authResponse: AuthResponse = {
        message: 'Signed up successfully.',
        user: filterUser(newUser),
        jwt: issueJWT(newUser),
      }

      res.status(201).json(authResponse);

    } catch (error) {
      // Handle used emails
      if (error.code === 'P2002') {
        return res.status(403).json({
          message: 'Email already used.',
          error: 'email_taken'
        });
      }

      logger.log('error', `An error occured while logging in --> ${error}`);
      serverErrResponse(res);
    }
  }
}

export default AuthHandler;