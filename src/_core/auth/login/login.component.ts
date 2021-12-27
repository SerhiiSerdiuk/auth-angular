import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AUTH_API_URL } from '../auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public usernameError$: Observable<string> | undefined;
  public passwordError$: Observable<string> | undefined;

  constructor(private readonly http: HttpClient, private readonly fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.usernameError$ = this.loginForm.statusChanges.pipe(
      map((status) => {
        if (status === 'VALID') {
          return '';
        }

        const usernameControl = this.loginForm.get('username');
        if (usernameControl && usernameControl.hasError('required')) {
          return 'You must enter an email';
        }

        return usernameControl ? 'Not a valid email' : '';
      })
    );

    this.passwordError$ = this.loginForm.statusChanges.pipe(
      map((status) => {
        if (status === 'VALID') {
          return '';
        }

        const passwordControl = this.loginForm.get('password');
        if (passwordControl && passwordControl.hasError('required')) {
          return 'You must enter a password';
        }
        if (passwordControl && passwordControl.hasError('minlength')) {
          return 'The length of password must be greater than or equal 6 characters';
        }

        return passwordControl ? 'Not a valid password' : '';
      })
    );
  }

  ngOnInit() {}

  public login(): void {
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.http
      .post(`${AUTH_API_URL}/login`, {
        username,
        password,
      })
      .subscribe((response) => {
        console.log('🚀 ~ response', response);
      });
  }
}
