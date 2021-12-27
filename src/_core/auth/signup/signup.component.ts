import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AUTH_API_URL } from '../auth.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public signupForm: FormGroup;
  public usernameError$: Observable<string> | undefined;
  public passwordError$: Observable<string> | undefined;
  public confirmPasswordError$: Observable<string> | undefined;
  public matchPasswordError$: Observable<string> | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.passwordMatches,
      }
    );

    this.usernameError$ = this.signupForm.statusChanges.pipe(
      map((status) => {
        if (status === 'VALID') {
          return '';
        }

        const usernameControl = this.signupForm.get('username');
        if (usernameControl && usernameControl.hasError('required')) {
          return 'You must enter an email';
        }

        return usernameControl ? 'Not a valid email' : '';
      })
    );

    this.passwordError$ = this.signupForm.statusChanges.pipe(
      map((status) => {
        if (status === 'VALID') {
          return '';
        }

        const passwordControl = this.signupForm.get('password');
        if (passwordControl && passwordControl.hasError('required')) {
          return 'You must enter a password';
        }
        if (passwordControl && passwordControl.hasError('minlength')) {
          return 'The length of password must be greater than or equal 6 characters';
        }

        return passwordControl ? 'Not a valid password' : '';
      })
    );

    this.confirmPasswordError$ = this.signupForm.statusChanges.pipe(
      map((status) => {
        if (status === 'VALID') {
          return '';
        }

        const confirmPasswordControl = this.signupForm.get('confirmPassword');

        if (confirmPasswordControl && confirmPasswordControl.hasError('required')) {
          return 'You must enter a password';
        }
        if (confirmPasswordControl && confirmPasswordControl.hasError('minlength')) {
          return 'The length of password must be greater than or equal 6 characters';
        }

        return confirmPasswordControl ? 'Not a valid password' : '';
      })
    );

    this.matchPasswordError$ = this.signupForm.statusChanges.pipe(
      map((status) => {
        if (status === 'VALID') {
          return '';
        }

        if (this.signupForm.hasError('passwordEquals')) {
          return 'Confirm password is not equal to password';
        }

        return '';
      })
    );
  }

  passwordMatches(form: AbstractControl) {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');
    const password = passwordControl?.value;
    const confirmPassword = confirmPasswordControl?.value;
    return passwordControl?.touched && confirmPasswordControl?.touched && password !== confirmPassword
      ? { passwordEquals: true }
      : null;
  }

  ngOnInit() {}

  public signup(): void {
    this.signupForm.updateValueAndValidity();

    if (this.signupForm.invalid) {
      return;
    }

    const { username, password, confirmPassword } = this.signupForm.getRawValue();

    this.http
      .post(`${AUTH_API_URL}/signup`, {
        username,
        password,
        confirmPassword,
      })
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.status === 409) {
            console.log('🚀 ~ errorResponse', errorResponse);
          }
          return throwError(errorResponse);
        })
      )
      .subscribe((response: any) => {
        console.log('🚀 ~ response', response);
        this.navigateToLogin();
      });
  }

  public navigateToLogin() {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
