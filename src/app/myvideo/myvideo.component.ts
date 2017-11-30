import { Component, OnInit} from '@angular/core';
import {YoutubeAPIService} from '../youtube-api.service';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-myvideo',
  templateUrl: './myvideo.component.html',
  styleUrls: ['./myvideo.component.css']
})
export class MyvideoComponent implements OnInit {
  playlistLiked: any = '';
  playlistUploaded: any = '';
  constructor(private youtubeAPIService: YoutubeAPIService,
              private sanitizer: DomSanitizer) {
    setTimeout(() => { this.get(); }, 2000);
  }
  ngOnInit() {
  }
  get() {
    this.youtubeAPIService.getUserChannel().then((res: any) => {
      const uploadId = res.contentDetails.relatedPlaylists.uploads
      this.playlistUploaded = this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://www.youtube.com/embed?listType=playlist&list=${uploadId}&autoplay=0`);

      const likedId = res.contentDetails.relatedPlaylists.likes;
      this.playlistLiked = this.sanitizer.bypassSecurityTrustResourceUrl(
        `http://www.youtube.com/embed?listType=playlist&list=${likedId}&autoplay=0`);
    });
  }
}
