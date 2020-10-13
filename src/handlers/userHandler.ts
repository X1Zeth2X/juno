import { Request, Response } from "express";
import { serverErrResponse } from "../helpers/response";

import { UserInterface } from "../db/userRepository";
import logger from "../middleware/logger";
import { filterUser } from "../helpers/filter";

const userNotFound = (res: Response) => {
  res.status(404).json({
    message: 'User not found.',
    error: 'user_404',
  });
}

class UserHandler {
  userRepository: UserInterface;

  constructor(userRepository: UserInterface) {
    this.userRepository = userRepository;
  }

  getByEmail = async (req: Request, res: Response) => {
    // Get user email from params
    const userEmail = req.params.email;

    // Post pagination
    const includePosts = Boolean(req.query.includePosts);

    try {
      const user = await this.userRepository.getByEmail(userEmail, includePosts);

      if (!user) {
        return userNotFound(res);
      }

      res.status(200).json({
        message: 'Sent user data.',
        user: filterUser(user),
      });
      
    } catch (error) {
      logger.log('error', `An error occured while logging in --> ${error}`);
      serverErrResponse(res);
    }
  }
}

export default UserHandler;