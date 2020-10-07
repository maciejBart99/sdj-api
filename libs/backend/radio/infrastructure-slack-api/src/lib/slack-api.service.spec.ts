import { TestBed } from '@angular/core/testing';
import { Test } from '@nestjs/testing';
import { SlackApiService } from './http-slack-api.service';

describe('SlackApiService', () => {
  beforeEach(() =>
    Test.createTestingModule({
      providers: [SlackApiService],
    })
  );

  it('should be created', () => {
    const service: SlackApiService = TestBed.inject(SlackApiService);
    expect(service).toBeTruthy();
  });
});
