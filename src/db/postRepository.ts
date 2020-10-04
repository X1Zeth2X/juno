import { Post, PrismaClient } from "@prisma/client";

type CreatePostData = {
  title: string;
  content: string;
  imageUrl?: string;
}

type UpdatePostData = {
  title?: string;
  content?: string;
}

interface PostInterface {
  create(authorEmail: string, postData: CreatePostData): Promise<Post | undefined>;
  getById(id: number, includeAuthor?: boolean): Promise<Post | null>;
  update(id: number, updateData: UpdatePostData): Promise<Post | null>;
  delete(id: number): void;
}

class PostRepository implements PostInterface {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create = (authorEmail: string, postData: CreatePostData) => this.prisma.post.create({
    data: {
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl,

      // Create Author relationship by connecting ID.
      author: {
        connect: {
          email: authorEmail
        }
      }
    }
  });

  getById = (id: number, includeAuthor?: boolean) => this.prisma.post.findOne({
    where: { id },
    include: {
      author: includeAuthor
    },
  });

  update = (id: number, data: UpdatePostData) => this.prisma.post.update({
    data,
    where: { id },
  });

  delete = (id: number) => this.prisma.post.delete({
    where: { id },
  });
}

export default PostRepository;
export { CreatePostData, UpdatePostData, PostInterface };