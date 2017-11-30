import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { YoutubeAPIService } from './youtube-api.service';

import { AppComponent } from './app.component';
import { MyvideoComponent } from './myvideo/myvideo.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    AppComponent,
    MyvideoComponent,
    HomeComponent,
    NavbarComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [YoutubeAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
