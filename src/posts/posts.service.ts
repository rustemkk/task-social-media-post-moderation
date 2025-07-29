import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import { ModerationService } from '../moderation/moderation.service';
import { CreatePostDto } from './dto/create-post-dto';

@Injectable()
export class PostsService {
  private twitterClient: TwitterApi;

  constructor(private readonly moderationService: ModerationService) {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY as string,
      appSecret: process.env.TWITTER_API_KEY_SECRET as string,
      accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
    });
  }

  async create(input: CreatePostDto): Promise<string> {
    const checkResult = await this.moderationService.checkContent(input.text);
    if (!checkResult)
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Content violates moderation policy',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    let postId: string = '';
    switch (input.platform) {
      case 'twitter': {
        const result = await this.twitterClient.v2.tweet(input.text);
        postId = result.data.id;
        break;
      }
      default:
        throw new BadRequestException('Unsupported platform');
    }

    return `Post created on ${input.platform} with id=${postId}`;
  }
}
