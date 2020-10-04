import { PrismaClient, User } from "@prisma/client";

type CreateUserData = {
  email: string;
  password: string;
  fullName: string;
  bio?: string;
}

type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

type FilteredUser = {
  joinedAt: Date
  email: string
  fullName: string
  bio: string | null
}

interface UserInterface {
  create(data: CreateUserData): Promise<User | undefined>;
  getByEmail(email: string, includePosts?: boolean): Promise<User | null>;
  getById(userId: number, includePosts?: boolean): Promise<User | null>;
  update(userId: number, data: UpdateUserData): Promise<User | null>;
}

class UserRepository implements UserInterface {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create = (data: CreateUserData) => this.prisma.user.create({ data });

  getByEmail = (email: string, includePosts?: boolean) => this.prisma.user.findOne({
    where: { email },
    include: {
      posts: includePosts,
    },
  });

  getById = (userId: number, includePosts?: boolean) => this.prisma.user.findOne({
    where: {
      id: userId
    },
    include: {
      posts: includePosts,
    },
  });

  update = (userId: number, data: UpdateUserData)  => this.prisma.user.update({
    data,
    where: {
      id: userId
    },
  });
}

export default UserRepository;
export { CreateUserData, UpdateUserData, UserInterface };