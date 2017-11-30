import { TestBed, inject } from '@angular/core/testing';

import { YoutubeAPIService } from './youtube-api.service';

describe('YoutubeAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YoutubeAPIService]
    });
  });

  it('should be created', inject([YoutubeAPIService], (service: YoutubeAPIService) => {
    expect(service).toBeTruthy();
  }));
});
