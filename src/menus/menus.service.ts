import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.menu.findMany({
      include: { items: { orderBy: { order: 'asc' } } },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.menu.findUnique({
      where: { slug },
      include: { items: { orderBy: { order: 'asc' } } },
    });
  }
}
