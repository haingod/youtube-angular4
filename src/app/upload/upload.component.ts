import { Component, OnInit } from '@angular/core';
import {YoutubeAPIService} from '../youtube-api.service';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  location: any = '';
  video: any;
  title = '';
  description = '';
  recentUploadId: any = '';
  baseUrl = 'https://www.youtube.com/embed/';
  constructor(private youtubeAPIService: YoutubeAPIService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.video = fileInput.target.files[0];
      this.youtubeAPIService.getUrlUpload(fileInput.target.files[0], this.title, this.description).subscribe(res => {
        const entry = res.headers['_headers'].entries();
        for (let i = 0;i < 5; i++) {
          entry.next().value;
        }
        const location = entry.next().value;
        this.location = location[1][0];
      });
    }
  }
  upload() {
   this.youtubeAPIService.uploadToYoutube(this.video, this.location).then((res:any) => {
     this.recentUploadId =  this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + res.id);
   });
  }
}
