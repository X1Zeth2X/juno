import { Response } from 'express';

const badRequestResponse = (res: Response, message: string) => {
  res.status(400).json({
    message,
    error: 'data_invalid',
  });
}

const serverErrResponse = (res: Response) => {
  res.status(500).json({
    message: 'An error occured!',
    error: 'server_error',
  });
}

export { badRequestResponse, serverErrResponse };