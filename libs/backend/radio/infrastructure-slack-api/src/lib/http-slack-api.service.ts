import { HttpService, Injectable } from '@nestjs/common';
import { SlackChannel } from '@sdj/backend/shared/domain';
import { SlackApiService } from '@sdj/ng/shared/core/application-services';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpSlackApiService implements SlackApiService {
  readonly baseSlackUrl: string = 'https://slack.com/api/';
  private readonly endpoints = {
    channelList:
      this.baseSlackUrl +
      'conversations.list?types=public_channel%2C%20private_channel&pretty=1',
    userIdentity: `${this.baseSlackUrl}users.identity`,
  };

  constructor(private http: HttpService) {}

  getChannelList(token: string): Promise<SlackChannel[]> {
    return this.http
      .get<{ channels: SlackChannel[] }>(this.endpoints.channelList, {
        params: { token },
      })
      .pipe(
        map((response) => {
          console.log(response.data, token);
          return response.data.channels;
        })
      )
      .toPromise();
  }

  getUserId(token: string): Promise<string> {
    return this.http
      .get<{
        user: {
          name: string;
          id: string;
        };
      }>(`${this.endpoints.userIdentity}?token=${token}`)
      .pipe(map((response) => response.data.user.id))
      .toPromise();
  }
}
