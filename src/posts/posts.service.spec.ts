import { Test, TestingModule } from '@nestjs/testing';
import { ModerationModule } from '../moderation/moderation.module';
import { PostsService } from './posts.service';
import { ModerationService } from '../moderation/moderation.service';
import { CreatePostDto } from './dto/create-post-dto';

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

describe('PostsService', () => {
  let service: PostsService;
  let moderationService: ModerationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ModerationModule],
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
    moderationService = module.get<ModerationService>(ModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if moderation fails', async () => {
    jest.spyOn(moderationService, 'checkContent').mockResolvedValueOnce(false);
    await expect(
      service.create({
        platform: 'twitter',
        text: 'bad text',
      } as CreatePostDto),
    ).rejects.toThrow('Content violates moderation policy');
  });

  it('should post to X and return post id', async () => {
    jest.spyOn(moderationService, 'checkContent').mockResolvedValueOnce(true);
    const result = await service.create({
      platform: 'twitter',
      text: 'hello world',
    } as CreatePostDto);
    expect(result).toContain('Post created on twitter with id=mocked-tweet-id');
  });

  it('should throw for unsupported platform', async () => {
    jest.spyOn(moderationService, 'checkContent').mockResolvedValueOnce(true);
    await expect(
      service.create({ platform: 'reddit', text: 'test' } as CreatePostDto),
    ).rejects.toThrow('Unsupported platform');
  });
});
