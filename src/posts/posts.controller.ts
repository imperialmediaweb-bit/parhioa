import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
    @Query('category') category?: string,
  ) {
    return this.posts.findAll({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
      category,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.posts.findBySlug(slug);
  }
}
