import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BaseLoginComponent } from './pages/base-login/base-login.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BaseLoginComponent,
    LoginComponent,
    RecuperarContrasenaComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ]
})
export class AuthModule { }
