import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ModerationService } from './moderation.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

describe('ModerationService', () => {
  let service: ModerationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ModerationService],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when content is not flagged', async () => {
    const mockResponse = { data: { results: [{ flagged: false }] } };
    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(of(mockResponse as any));
    await expect(service.checkContent('safe text')).resolves.toBe(true);
  });

  it('should return false when content is flagged', async () => {
    const mockResponse = { data: { results: [{ flagged: true }] } };
    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(of(mockResponse as any));
    await expect(service.checkContent('bad text')).resolves.toBe(false);
  });

  it('should throw if the API call fails', async () => {
    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(throwError(() => new Error('API error')));
    await expect(service.checkContent('any text')).rejects.toThrow('API error');
  });
});
