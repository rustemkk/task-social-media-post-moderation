import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

interface ModerationResponse {
  results: { flagged: boolean }[];
  [key: string]: any;
}

@Injectable()
export class ModerationService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Checks if the provided text passes OpenAI moderation.
   * @param text The text to be checked for moderation.
   * @returns Promise resolving to true if content is NOT flagged, false otherwise.
   */
  async checkContent(text: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.httpService.post<ModerationResponse>(
        'https://api.openai.com/v1/moderations',
        { input: text },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } },
      ),
    );

    return !response.data.results[0].flagged;
  }
}
