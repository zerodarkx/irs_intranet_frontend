import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'inicio-base-inversionista',
  templateUrl: './base-inversionista.component.html',
  styleUrls: ['./base-inversionista.component.css']
})
export class BaseInversionistaComponent {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['inversionista', 'inversor'])
  }
}
