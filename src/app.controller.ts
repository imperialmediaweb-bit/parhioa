import { Controller, Get, Param, Query, Render, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  private async menu() {
    const m = await this.prisma.menu.findUnique({
      where: { slug: 'primary' },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    return m?.items.filter((i) => !i.parentId) || [];
  }

  @Get()
  @Render('home')
  async home() {
    const homePage =
      (await this.prisma.page.findUnique({ where: { slug: 'acasa' }, include: { featured: true } })) ||
      (await this.prisma.page.findUnique({ where: { slug: 'home' }, include: { featured: true } }));
    const posts = await this.prisma.post.findMany({
      where: { status: 'publish' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      include: { featured: true },
    });
    return { page: homePage, posts, menu: await this.menu(), year: new Date().getFullYear() };
  }

  @Get('blog')
  @Render('blog')
  async blog(@Query('category') category?: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        status: 'publish',
        ...(category && { categories: { some: { slug: category } } }),
      },
      include: { featured: true, categories: true },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });
    return { posts, category, menu: await this.menu(), year: new Date().getFullYear() };
  }

  @Get('blog/:slug')
  @Render('post')
  async post(@Param('slug') slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: { featured: true, categories: true, tags: true },
    });
    if (!post || post.status !== 'publish') throw new NotFoundException();
    return { post, menu: await this.menu(), year: new Date().getFullYear() };
  }

  @Get(':slug')
  @Render('page')
  async page(@Param('slug') slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: { featured: true },
    });
    if (!page || page.status !== 'publish') throw new NotFoundException();
    return { page, menu: await this.menu(), year: new Date().getFullYear() };
  }
}
