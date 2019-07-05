import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PostComponent} from './views/post/post.component';
import {FeedComponent} from './views/feed/feed.component';
import {AuthGuard} from './shared/auth.guard';
import {SignInComponent} from './public/sign-in/sign-in.component';
import {BaseComponent} from './views/base/base.component';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'post',
        component: PostComponent,
      },
      {
        path: 'post/:id',
        component: PostComponent,
      },
      {
        path: 'feed',
        component: FeedComponent,
      },
    ]
  },
  // otherwise redirect to feed
  { path: '**', redirectTo: 'feed' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
