import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {

  constructor(
    private sAuth: AuthService,
  ) { }

  async ngOnInit() {
    await this.generarTokenTemporal()
  }

  async generarTokenTemporal() {
    const response = await firstValueFrom(this.sAuth.generarTokenTemporal());
    localStorage.setItem('token', response.token);
  }

}
