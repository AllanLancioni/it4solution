import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import Swal from "sweetalert2";
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  loginForm = {
    user: '',
    password: ''
  };

  registerForm = {
    user: '',
    email: '',
    password: '',
    passwordConfirm: ''
  };

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit() {
    this.usersService.logout();
  }

  async login() {
    this.usersService.login(this.loginForm)
      .then(() => this.router.navigateByUrl('feed'))
      .catch(() => Swal.fire('Error', 'Invalid user or password!', 'error'));
  }

  async register() {
    this.usersService.register(this.registerForm)
      .then(() => this.router.navigateByUrl('feed'));
  }

}
