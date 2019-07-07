import { Injectable } from '@angular/core';
import { usersCollection } from '../../database-simulation/collections/users';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  static loggedInUser = null;
  static readonly storageKey: string = 'loggedUser';

  constructor(private router: Router) {}

  async login(form): Promise<void> {

    try {
      const [userFound] = await usersCollection.get({user: form.user, password: form.password});
      UsersService.loggedInUser = userFound || null;
      if (userFound) {
        console.log(userFound);
        localStorage.setItem(btoa(UsersService.storageKey), btoa(JSON.stringify(userFound)));
        return Promise.resolve();
      }
      return Promise.reject();
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
    localStorage.setItem(btoa(UsersService.storageKey), '');
    this.router.navigateByUrl('sign-in');
  }

}

// Load user from session
if (!UsersService.loggedInUser) {
  UsersService.loggedInUser = (str => str ? JSON.parse(atob(str)) : null)(localStorage.getItem(btoa(UsersService.storageKey)));
}
