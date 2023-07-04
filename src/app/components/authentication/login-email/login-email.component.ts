import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_Services/auth.service';

@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.component.html',
  styleUrls: ['./login-email.component.scss'],
})
export class LoginEmailComponent implements OnInit {
  loginForm!: FormGroup;
  error: any;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((auth) => {
      if (auth) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) return;
    this.authService
      .loginEmailAndPassword(this.loginForm.value)
      .then((success) => {
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.error = err;
      });
  }
}
