import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PagesModule } from './pages/pages.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { CategoriesModule } from './categories/categories.module';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CloudinaryModule,
    PagesModule,
    PostsModule,
    MediaModule,
    CategoriesModule,
    MenusModule,
  ],
})
export class AppModule {}
