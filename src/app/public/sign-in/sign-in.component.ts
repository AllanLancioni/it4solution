import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';

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

  constructor(private usersService: UsersService) { }

  ngOnInit() {
  }

  async login() {
    this.usersService.login(this.loginForm);
  }

  async register() {
    this.usersService.register(this.registerForm);
  }

}
