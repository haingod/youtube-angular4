import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyvideoComponent } from './myvideo/myvideo.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import {AuthGuard} from './auth-guard.service';
@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'myvideo', component: MyvideoComponent, canActivate: [AuthGuard]},
      { path: 'upload', component: UploadComponent, canActivate: [AuthGuard]}
    ])
  ],
  providers: [AuthGuard],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
