import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/_Services/auth.service';
import { UserService } from 'src/app/_Services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  error: any;
  signUpForm = new FormGroup({});

  constructor(
    public authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.signUpForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: passwordsMatchValidator() }
    );
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      return;
    }
    const { email } = this.signUpForm.value;
    this.authService
      .createNewUserWthEmailAndPassword(this.signUpForm.value)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.userService.addUser({
            uid,
            email,
            displayName: email,
            lastLoggedIn: new Date(Date.now()),
          })
        )
      )
      .subscribe({
        next: (success: any) => {
          this.signUpForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.error = err;
        },
      });
  }
}

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}
