import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { PostComponent } from './views/post/post.component';
import { FeedComponent } from './views/feed/feed.component';
import { SignInComponent } from './public/sign-in/sign-in.component';
import { AuthGuard } from './shared/auth.guard';
import { UsersService } from './services/users.service';
import { BaseComponent } from './views/base/base.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PostComponent,
    FeedComponent,
    SignInComponent,
    BaseComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  providers: [AuthGuard, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
