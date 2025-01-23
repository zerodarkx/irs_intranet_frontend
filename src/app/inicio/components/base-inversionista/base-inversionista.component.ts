import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

import { GraficosService } from 'src/app/services';

import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'inicio-base-inversionista',
  templateUrl: './base-inversionista.component.html',
  styleUrls: ['./base-inversionista.component.css']
})
export class BaseInversionistaComponent {
  data: ChartData[] = [];
  options: ChartOptions[] = [];

  backgroundColor = [
    'rgba(255, 99, 132, 0.2)', // Rojo
    'rgba(54, 162, 235, 0.2)', // Azul
    'rgba(255, 206, 86, 0.2)', // Amarillo
    'rgba(75, 192, 192, 0.2)', // Verde claro
    'rgba(153, 102, 255, 0.2)', // Morado
    'rgba(255, 159, 64, 0.2)', // Naranja
    'rgba(201, 203, 207, 0.2)' // Gris claro
  ];
  borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(201, 203, 207, 1)'
  ];

  constructor(
    private sGrafico: GraficosService
  ) { }

  ngOnInit() {
    this.iniciarGrafico();
  }

  iniciarGrafico() {

    this.sGrafico.obtenerGraficosInversionista()
      .subscribe({
        next: (response) => {
          const cantidades = [
            response.data.casosPendientes.dataPendiente.map((item) => item.cant),
            response.data.casosSaldos.dataSaldos.map((item) => item.suma!),
          ]
          const leyendas = [
            response.data.casosPendientes.dataPendiente.map((item) => item.leyenda),
            response.data.casosSaldos.dataSaldos.map((item) => item.leyenda),
          ]
          const titulos = [
            response.data.casosPendientes.titulo,
            response.data.casosSaldos.titulo,
          ]

          cantidades.forEach((d, i) => {

            this.data.push({
              labels: leyendas[i].length > 0 ? leyendas[i] : ['No Hay Casos Aun'],
              datasets: [
                {
                  data: d.length > 0 ? d : [1],
                  backgroundColor: this.backgroundColor,
                  borderColor: this.borderColor,
                  borderWidth: 1,
                }
              ]
            })

            this.options.push({
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true,
                  },
                  position: 'bottom',
                  display: false
                },
                title: {
                  display: true,
                  text: titulos[i],
                  font: {
                    weight: 'bold',
                    size: 35
                  }
                }
              }
            })
          })
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }
}
