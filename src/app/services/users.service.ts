import { Injectable } from '@angular/core';
import { users } from '../../database-simulation/users';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  static loggedInUser = users.collection[0];
  // static loggedInUser = null;

  constructor(private route: Router) {}

  login(form) {
    const userFound = users.collection.find(x => x.user === form.user && x.password === form.password);
    if (!userFound) {
      Swal.fire('Error', 'Invalid user or password!', 'error');
      return;
    }
    UsersService.loggedInUser = userFound;
    this.route.navigateByUrl('feed');

  }

  register(form) {

    if (form.password !== form.passwordConfirm) {
      Swal.fire('Error', 'Passwords doesn\'t match!', 'error');
      return;
    }

    const userFound = users.collection.find(x => x.user === form.user || x.email === form.email);
    if (userFound) {
      Swal.fire('Error', 'User with same username or email already registered!', 'error');
      return;
    }

    delete form.confirmPassword;
    users.lastId++;
    const user = {...form, id: users.lastId };
    users.collection.push(user);
    this.login(user);
  }

  logout() {
    UsersService.loggedInUser = null;
    this.route.navigateByUrl('sign-in');
  }

}
