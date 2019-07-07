import { Injectable } from '@angular/core';
import { usersCollection } from '../../database-simulation/collections/users';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  static loggedInUser = null;

  constructor(private router: Router) {
    // Start app logged in
    setTimeout(() => this.login({user: 'admin', password: '123'}).then(() => this.router.navigateByUrl('feed')), 2000);
  }

  async login(form): Promise<void> {

    try {
      const [userFound] = await usersCollection.get({user: form.user, password: form.password});
      UsersService.loggedInUser = userFound || null;
      return Promise.resolve();
    } catch (err) {
      return Promise.reject();
    }

  }

  async register(form) {

    if (form.password !== form.passwordConfirm) {
      Swal.fire('Error', 'Passwords doesn\'t match!', 'error');
      return Promise.reject();
    }
    if ((await usersCollection.get()).some(x => x.user === form.user || x.email === form.email)) {
      Swal.fire('Error', 'User with same username or email already registered!', 'error');
      return Promise.reject();
    }

    try {
      delete form.confirmPassword;
      await usersCollection.insert(form);
      return this.login(form);
    } catch (err) {
      console.error(err);
      return Promise.reject();
    }
  }

  logout() {
    UsersService.loggedInUser = null;
    this.router.navigateByUrl('sign-in');
  }

}
