import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ShareModule } from 'src/_share/share.module';

@NgModule({
  imports: [ShareModule, AuthRoutingModule],
  declarations: [LoginComponent],
})
export class AuthModule {}
