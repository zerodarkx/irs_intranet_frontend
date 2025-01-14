import { Component, OnInit } from '@angular/core';
import { CargandoService } from './services/cargando.service';
import { PrimeNGConfig } from 'primeng/api';
import { dataLenguage } from "./shared/utils/lenguajePrimeNG";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IRS INTRANET';

  constructor(
    public sCargando: CargandoService,
    private primengConfig: PrimeNGConfig
  ) { }
  ngOnInit(): void {
    this.primengConfig.setTranslation(dataLenguage);

    const version = '1';
    const verficarRefresco = localStorage.getItem('version')

    if (!verficarRefresco) localStorage.setItem('version', version);
    if (verficarRefresco !== version) {
      alert('Favor borrar el cache del sitio web, debido a una modificacion, para hacer esto puedo presionar los botones CONTROL + F5 juntos.');
      localStorage.setItem('version', version)
    }

  }

}
