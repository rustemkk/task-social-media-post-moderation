import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  platform: 'twitter' | 'reddit' | 'facebook' | 'instagram';

  @IsString()
  text: string;
}
