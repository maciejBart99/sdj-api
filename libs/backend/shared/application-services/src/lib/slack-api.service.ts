import { SlackChannel } from '@sdj/backend/shared/domain';

export abstract class SlackApiService {
  abstract getChannelList(token: string): Promise<SlackChannel[]>;

  abstract getUserId(token: string): Promise<string>;
}
