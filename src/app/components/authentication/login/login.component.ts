import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error: string = '';
  constructor(
    private authenicationService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}
  loginGoogle() {
    this.authenicationService
      .loginGoogle()
      .then((success) => {
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.error = err;
      });
  }

  loginEmail() {}
}
