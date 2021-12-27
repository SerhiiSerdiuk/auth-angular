import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ShareModule } from 'src/_share/share.module';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [ShareModule, AuthRoutingModule],
  declarations: [LoginComponent, SignupComponent],
})
export class AuthModule {}
