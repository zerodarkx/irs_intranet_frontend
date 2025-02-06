import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { CategoriaGastoCliente, GastoClienteTipo } from 'src/app/interfaces';
import { ClienteService, ExportarPdfService } from 'src/app/services';

import { formateadorMilesSinDecimal, formateadorMilesSinDecimalDesdeBase } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-gastos-cliente',
  templateUrl: './gastos-cliente.component.html',
  styleUrls: ['./gastos-cliente.component.css']
})
export class GastosClienteComponent implements OnInit {

  id_ficha: number = 0;
  totalGastos: string = '0';
  saldoFavor: string = '0';

  categorias: GastoClienteTipo[] = [
    { clave: 'abonos', titulo: 'Abonos', data: [], total: '0' },
    { clave: 'tasacion', titulo: 'Tasación', data: [], total: '0' },
    { clave: 'seguros', titulo: 'Seguros', data: [], total: '0' },
    { clave: 'conservadores', titulo: 'Conservadores', data: [], total: '0' },
    { clave: 'notaria', titulo: 'Notaria', data: [], total: '0' },
    { clave: 'abogados', titulo: 'Abogados', data: [], total: '0' },
    { clave: 'contribuciones', titulo: 'Contribuciones', data: [], total: '0' },
    { clave: 'otros', titulo: 'Otros', data: [], total: '0' },
  ];

  constructor(
    private sCliente: ClienteService,
    private sExpotarPdf: ExportarPdfService,
  ) { }

  ngOnInit(): void {
    this.cargarDatosInicio();
  }

  formateadorMilesSinDecimal(event: Event) {
    const input = (event.target as HTMLInputElement);
    input.value = formateadorMilesSinDecimal(input.value);
  }

  eliminarFormato(event: Event) {
    const input = (event.target as HTMLInputElement);
    input.value = input.value.toString().replace(/\./g, '') || '';
  }

  guardarGastos() {
    let data = {
      id_ficha: this.id_ficha,
      totalGastos: this.totalGastos,
      saldoFavor: this.saldoFavor,
      categorias: this.categorias
    }
    this.sCliente.agregarGastosCliente(data)
      .subscribe({
        next: (response: any) => {
          if (response.ok) {
            this.id_ficha = response.data.id_ficha;
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: "Exito",
              mensaje: response.data.mensaje
            });
          }

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  cargarDatosInicio() {

    this.sCliente.obtenerGastosCliente()
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.id_ficha = response.data.id_gasto;
            this.categorias[0].data = response.data.abonos;
            this.categorias[1].data = response.data.tasacion;
            this.categorias[2].data = response.data.seguros;
            this.categorias[3].data = response.data.conservador;
            this.categorias[4].data = response.data.notaria;
            this.categorias[5].data = response.data.abogados;
            this.categorias[6].data = response.data.contribuciones;
            this.categorias[7].data = response.data.otros;

            this.categorias.forEach(ele => this.sumarPorCategoria(ele.clave));
            this.sumarTotalGastos();

            this.categorias.forEach(categoria => {
              categoria.data.forEach(gasto => {
                gasto.monto = formateadorMilesSinDecimal(gasto.monto);
              });
            });

          }
        },
        error: (error) => {
          errorConexionServidor(error);
        }
      })
  }

  agregarGasto(categoria: string) {
    const nuevaFila = { tipo: '', monto: '', fecha: '' };
    const categoriaEncontrada = this.categorias.find((cat: GastoClienteTipo) => cat.clave === categoria);
    categoriaEncontrada?.data.push(nuevaFila);
  }

  eliminarGasto(categoria: string, index: number) {
    const categoriaEncontrada = this.categorias.find((cat: GastoClienteTipo) => cat.clave === categoria);
    categoriaEncontrada?.data.splice(index, 1);
    this.sumarPorCategoria(categoria);
    this.sumarTotalGastos()
  }

  sumarPorCategoria(categoriaKey: string): void {
    const categoria = this.categorias.find((cat: GastoClienteTipo) => cat.clave === categoriaKey);

    if (categoria) {
      categoria.total = categoria.data.reduce((total: number, gasto: CategoriaGastoCliente) =>
        total + (parseInt(formateadorMilesSinDecimalDesdeBase(gasto.monto)) || 0),
        0
      ).toString();
      categoria.total = formateadorMilesSinDecimal(categoria.total)

    }
    this.sumarTotalGastos();
  }

  sumarTotalGastos() {
    this.totalGastos = this.categorias
      .filter((categoria: GastoClienteTipo) => categoria.clave !== 'abonos') // Excluye la categoría "abonos".
      .reduce((total: number, categoria: GastoClienteTipo) => {
        const sumaCategoria = categoria.data.reduce(
          (subtotal: number, gasto: CategoriaGastoCliente) => subtotal + parseInt(formateadorMilesSinDecimalDesdeBase(gasto.monto)),
          0
        );

        return total + sumaCategoria; // Suma el total de cada categoría al acumulador.
      }, 0).toString();

    this.saldoFavor = (parseInt(formateadorMilesSinDecimalDesdeBase(this.categorias[0].total)) - parseInt(formateadorMilesSinDecimalDesdeBase(this.totalGastos))).toString();
    this.saldoFavor = formateadorMilesSinDecimal(this.saldoFavor)
    this.totalGastos = formateadorMilesSinDecimal(this.totalGastos)
  }

  descargarGastoCliente(id_ficha: number) {
    this.sExpotarPdf.exportarGastosClientePdf(id_ficha)
      .subscribe({
        next: (response) => {
          const blob = new Blob([new Uint8Array(response.archivo.data).buffer])
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.nombre_archivo;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
  }

}
