import { Component, OnInit } from '@angular/core';
import {YoutubeAPIService} from '../youtube-api.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  signInStatus: any;
  constructor(private youtubeAPIService: YoutubeAPIService) {
    this.signInStatus = JSON.parse(localStorage.getItem('status'))
    this.youtubeAPIService.getSigninStatus().subscribe(status => {
      this.signInStatus = status;
      console.log(this.signInStatus)
    });
  }

  ngOnInit() {
  }
  handleAuthClick() {
    this.youtubeAPIService.handleAuthClick();
  }
}
