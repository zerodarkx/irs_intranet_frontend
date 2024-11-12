import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-base-login',
  templateUrl: './base-login.component.html',
  styleUrls: ['./base-login.component.css']
})
export class BaseLoginComponent implements OnInit {

  constructor(
    private sAuth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.sAuth.isLoggedIn()) {
      this.sAuth.verificarToken()
        .subscribe({
          next: (response) => {
            if (response) {
              this.router.navigate(['/inicio']);
            }
          },
          error: (error: HttpErrorResponse) => { }
        })
    }
  }

}
