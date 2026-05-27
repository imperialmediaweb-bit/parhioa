import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: { take?: number; skip?: number; category?: string } = {}) {
    const { take = 20, skip = 0, category } = params;
    return this.prisma.post.findMany({
      where: {
        status: 'publish',
        ...(category && { categories: { some: { slug: category } } }),
      },
      include: { featured: true, categories: true, tags: true },
      orderBy: { publishedAt: 'desc' },
      take,
      skip,
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { featured: true, categories: true, tags: true },
    });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return post;
  }
}
