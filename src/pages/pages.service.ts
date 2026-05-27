import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.page.findMany({
      where: { status: 'publish' },
      include: { featured: true },
      orderBy: { menuOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: { featured: true },
    });
    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }
}
