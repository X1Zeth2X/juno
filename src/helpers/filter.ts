import { User } from "@prisma/client";

export type FilteredUser = {
  joinedAt: Date;
  email: string;
  fullName: string;
  bio: string | null;
}

type FilteredPost  = {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  imageUrl: string | null;
  author: FilteredUser | undefined;
}

export const filterUser = (user: User) => {
  const filteredUser: FilteredUser = {
    joinedAt: user.joinedAt,
    email: user.email,
    fullName: user.fullName,
    bio: user.bio,
  };

  return filteredUser;
}

export const filterPost = (post: any, excludeAuthor?: boolean) => {
  const filteredPost: FilteredPost = {
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl,
    
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: excludeAuthor ? undefined : filterUser(post.author),
  }

  return filteredPost;
}