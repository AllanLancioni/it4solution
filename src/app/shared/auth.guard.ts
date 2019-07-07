import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {UsersService} from '../services/users.service';
import Swal from 'sweetalert2';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    if (!UsersService.loggedInUser) {
      this.router.navigate(['/sign-in']);
      // Swal.fire('Sorry', 'Please, login to access this page.', 'warning').then(() => {});
      return false;
    }
    return true;
  }
}
