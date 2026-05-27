import { Controller, Get, Param } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly menus: MenusService) {}

  @Get()
  findAll() {
    return this.menus.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.menus.findBySlug(slug);
  }
}
