import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ModerationModule } from './moderation/moderation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
    PostsModule,
    ModerationModule,
  ],
})
export class AppModule {}
