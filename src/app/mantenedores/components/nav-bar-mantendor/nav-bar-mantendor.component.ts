import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'mantendor-nav-bar',
  templateUrl: './nav-bar-mantendor.component.html',
  styleUrls: ['./nav-bar-mantendor.component.css']
})
export class NavBarMantendorComponent {
  constructor(
    private sAuth: AuthService
  ){}

  cerrarSession(){
    this.sAuth.cerrarSession();
  }
}
