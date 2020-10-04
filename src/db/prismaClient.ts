import { PrismaClient } from '@prisma/client';

const getClient = () => {
  return new PrismaClient({
    log: ['info', 'warn', 'error']
  });
}

export default getClient;