import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Http, Headers, RequestOptions} from '@angular/http';

declare var gapi; // Google Auth object.
@Injectable()
export class YoutubeAPIService {
  SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
  isAuthorized: Subject<boolean> = new Subject<boolean>();
  GoogleAuth: any;
  playlistId: string;
  stream: any;
  constructor(private http: Http) {
    this.googleInit();
  }

  googleInit() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        'apiKey': 'AIzaSyBs4yI3CihXOI0xnUL0HXMEzQ0mfg9g-F0',
        'clientId': '691851578623-1qogan88n6ualqdu8htj4jn5nodolphr.apps.googleusercontent.com',
        'scope': this.SCOPE,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
      }).then(() => {
        this.GoogleAuth = gapi.auth2.getAuthInstance();
        // Listen for sign-in state changes.
        this.GoogleAuth.isSignedIn.listen(() => {
          this.setSigninStatus();
          console.log(this.getAccessToken())
        });
        // Handle initial sign-in state. (Determine if user is already signed in.)
        this.setSigninStatus();
      });
    });
  }

  handleAuthClick() {
    if (this.GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      this.GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      this.GoogleAuth.signIn();
    }
  }

  setSigninStatus() {
    const user = this.GoogleAuth.currentUser.get();
    this.isAuthorized.next(user.hasGrantedScopes(this.SCOPE));
    localStorage.setItem('status', user.hasGrantedScopes(this.SCOPE))
  }

  getSigninStatus(): Observable<any> {
    return this.isAuthorized.asObservable();
  }

  searchVideos(queryStr) {
    var request = gapi.client.youtube.search.list({
      q: queryStr,
      part: 'snippet'
    });

    return new Promise((resolve, reject) => {
      request.execute(function (response) {
        return resolve(response);
      });
    });
  }

  getUserChannel() {
    // Also see: https://developers.google.com/youtube/v3/docs/channels/list
    var request = gapi.client.youtube.channels.list({
      // Setting the "mine" request parameter's value to "true" indicates that
      // you want to retrieve the currently authenticated user's channel.
      mine: true,
      part: 'id,contentDetails'
    });

    return new Promise((resolve, reject) => {
      request.execute((response) => {
        if ('error' in response) {
          console.log(response.error.message);
        } else {
          resolve(response.items[0]);
        }
      });
    });
  }
  setLikePlaylist(id) {
    this.playlistId = id;
  }
  addVideoToFavorite(Id) {
    const request = gapi.client.youtube.playlistItems.insert({
      part: 'snippet',
      snippet: {
        playlistId: this.playlistId,
        resourceId: {
          videoId: Id,
          kind: 'youtube#video'
        }
      }
    });
    return new Promise((resolve, reject) => {
      request.execute(function (response) {
        if ('error' in response) {
          console.log(response.error.message);
        } else {
          resolve(response);
        }
      });
    });
  }
  getAccessToken() {
    return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  }
  getUrlUpload(video, title, description) {
    const body = {
      snippet: {
        title: title,
        description: description,
        tags: ['tag1', 'tag2'],
        categoryId: 22
      },
      status: {
        privacyStatus: 'public',
        embeddable: true,
        license: 'youtube'
      }
    }
    const headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    headers.append('Authorization', 'Bearer ' + this.getAccessToken());
    headers.append('X-Upload-Content-Length', video.size);
    headers.append('x-upload-content-type', 'video/*');
    return this.http.post
    ('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,contentDetails',
      body , new RequestOptions({headers: headers})).map(res => res);
  }
  uploadToYoutube(video, location) {
    // Return a new promise.
    return new Promise((resolve, reject) => {
      // Do the usual XHR stuff
      let req = new XMLHttpRequest();
      req.open('PUT', location);
      req.setRequestHeader('Authorization', 'Bearer ' + this.getAccessToken());
      req.setRequestHeader('Content-Length', video.size);
      req.setRequestHeader('Content-Type', 'video/*');
      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status === 200) {
          // Resolve the promise with the response text
          resolve(JSON.parse(req.response));
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function() {
        reject('error');
      };

      // Make the request
      req.send(video);
    });
  }

}
