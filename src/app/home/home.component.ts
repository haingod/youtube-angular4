import { Component, OnInit } from '@angular/core';
import {YoutubeAPIService} from '../youtube-api.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  videos: any[] = [];

  baseUrl = 'https://www.youtube.com/embed/';
  totalResults: any;
  resultsPerPage: any;
  nextPageToken: any;
  queryStr = 'Hoai Linh';
  videoId: any = '';
  videoUrl: any = '';
  videoTitle: any = '';
  signInStatus: any;
  constructor(private youtubeAPIService: YoutubeAPIService,
              private sanitizer: DomSanitizer) {
    setTimeout(() => {
      this.youtubeAPIService.getUserChannel().then((res: any) => {
        const likedId = res.contentDetails.relatedPlaylists.likes;
        this.youtubeAPIService.setLikePlaylist(likedId);
      });
      this.signInStatus = JSON.parse(localStorage.getItem('status'))
      this.youtubeAPIService.getSigninStatus().subscribe(status => {
        this.signInStatus = status;
        console.log(this.signInStatus)
      });
      this.Search();
    }, 2000);

  }
  ngOnInit() {
  }
  Search() {
    this.youtubeAPIService.searchVideos(this.queryStr).then((response: any) => {
      this.videos = response.items;
      console.log(this.videos);
    });
  }
  setVideoId(videoId, videoTitle) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + videoId);
    this.videoId = videoId;
    this.videoTitle = videoTitle;
  }
  addToLike(id) {
    this.youtubeAPIService.addVideoToFavorite(id).then(res => {
      alert('Added To Liked Success')
    });
  }
}
