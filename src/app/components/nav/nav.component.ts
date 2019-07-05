import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  user = UsersService.loggedInUser;

  public menuItems: any[] = [
    { title: 'Feed', path: '/feed' },
    { title: 'Post', path: '/post' },
  ];

  constructor(public router: Router, public usersService: UsersService) {}

  ngOnInit() {
  }

}
