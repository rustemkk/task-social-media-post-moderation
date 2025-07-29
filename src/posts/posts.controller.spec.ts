import { Test, TestingModule } from '@nestjs/testing';
import { ModerationModule } from '../moderation/moderation.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

jest.mock('twitter-api-v2', () => {
  return {
    TwitterApi: jest.fn().mockImplementation(() => ({
      v2: {
        tweet: jest.fn((text: string) => ({
          data: { id: 'mocked-tweet-id', text },
        })),
      },
    })),
  };
});

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ModerationModule], // Add necessary imports if needed
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
