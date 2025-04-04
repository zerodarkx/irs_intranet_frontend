import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ErrorHttpCustom } from 'src/app/interfaces';

import { GraficosService } from 'src/app/services';

import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'inicio-base-ejecutivo',
  templateUrl: './base-ejecutivo.component.html',
  styleUrls: ['./base-ejecutivo.component.css']
})
export class BaseEjecutivoComponent {
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

    this.sGrafico.obtenerGraficosEjecutivo()
      .subscribe({
        next: (response) => {
          const cantidades = [
            response.data.propiedad.contadorPorPropiedad.map((item) => item.cant),
            response.data.mensuales.contadorPorCasosMensuales.map((item) => item.cant),
            response.data.historico.contadorPorcasosTotales.map((item) => item.cant)
          ]
          const leyendas = [
            response.data.propiedad.contadorPorPropiedad.map((item) => item.leyenda),
            response.data.mensuales.contadorPorCasosMensuales.map((item) => item.leyenda),
            response.data.historico.contadorPorcasosTotales.map((item) => item.leyenda)
          ]
          const titulos = [
            response.data.propiedad.titulo,
            response.data.mensuales.titulo,
            response.data.historico.titulo,
          ]

          cantidades.forEach((d, i) => {
            this.data.push({
              labels: leyendas[i].length > 0 ? leyendas[i] : ['No Hay Casos Aun'],
              datasets: [
                {
                  data: d.length > 0 ? d : [1],
                  backgroundColor: this.backgroundColor,
                  borderColor: this.borderColor,
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
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }
}
