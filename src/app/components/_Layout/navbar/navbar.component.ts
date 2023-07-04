import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/app/_Services/auth.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser!: Observable<User | null>;
  constructor(
    public auth: AuthService,
    private router: Router,
    public userService: UserService
  ) {
    if (this.auth.authenticated) {
      this.currentUser = this.auth.currentUser$;
    }
  }

  ngOnInit() {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/blog']);
  }
}
