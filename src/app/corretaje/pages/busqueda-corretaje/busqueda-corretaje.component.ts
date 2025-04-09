import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ErrorHttpCustom, Propiedad } from 'src/app/interfaces';
import { PropiedadesService } from 'src/app/services';
import { comunasConvecta, regionesConvecta, usuariosConvecta } from 'src/app/shared/utils/convetaUtils';
import { formateadorMilesSinDecimal } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

import { validarFechas } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'app-busqueda-corretaje',
  templateUrl: './busqueda-corretaje.component.html',
  styleUrls: ['./busqueda-corretaje.component.css']
})
export class BusquedaCorretajeComponent {

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  formFiltroBusqueda: FormGroup = this.fb.group({
    id_propiedad: [],
    estado_propiedad: [],
    ejecutivo: [],
    fechasIngreso: this.fb.group({
      fechaDesde: ['', []],
      fechaHasta: ['', []],
    }, { validators: [validarFechas('fechaDesde', 'fechaHasta')] }),
  });

  estadosMostrar = [
    { nombre: 'REVISIÓN Y ASIGNACIÓN', id_estado: 1 },
    { nombre: 'MONITOREO AL AGENTE', id_estado: 2 },
    { nombre: 'COMITÉ', id_estado: 3 },
    { nombre: 'MÓDULO INTERMADIO', id_estado: 4 },
    { nombre: 'LEGAL/OPERACIONES', id_estado: 5 },
    { nombre: 'NOTARÍA', id_estado: 6 },
    { nombre: 'CIERRE', id_estado: 7 },
  ];
  selectCorredores = usuariosConvecta;
  propiedades: Propiedad[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sPropiedades: PropiedadesService,
  ) { }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  borrarFiltrosTabla() { }
  irDetallePropiedad(id_propiedad: string) {
    // localStorage.setItem('filtrosBusquedaCliente', JSON.stringify(this.formFiltroBusqueda.value));
    this.router.navigate(['/propiedades', id_propiedad])
  }

  obtenerPropiedadesPorFiltro() {
    this.sPropiedades.obtenerPropiedadesPorFiltro(this.formFiltroBusqueda.value)
      .subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.propiedades = resp.data;
          }
        },
        error: (error: ErrorHttpCustom) => {
          console.log(error);
          errorConexionServidor(error)
        }
      });
  }

  exportarExcel() { }

  obtenerTipoArriendoVenta(venta: boolean, arriendo: boolean) {
    let tipo = [];
    if (venta) { tipo.push('Venta') }
    if (arriendo) { tipo.push('Arriendo') }

    return tipo.join(' / ');
  }

  obtenerValoresFormateados(venta: number, arriendo: number) {
    let tipo = [];
    if (venta) { tipo.push(formateadorMilesSinDecimal(venta)) }
    if (arriendo) { tipo.push(formateadorMilesSinDecimal(arriendo)) }

    return tipo.join(' / ');
  }

  obtenerTipoMoneda(venta: number, arriendo: number) {
    let tipo = [];
    if (venta) { tipo.push('UF') }
    if (arriendo) { tipo.push('CLP') }

    return tipo.join(' / ');
  }

  obtenerComunaConRegion(comuna: number) {
    let comunas = comunasConvecta.find(c => c.idBorough === comuna);
    let region = regionesConvecta.find(r => r.idRegion === comunas?.idRegion);

    return `${comunas?.name}, ${region?.name}`;
  }

  obntenerUsuario(id_usuario: number) {
    let usuario = this.selectCorredores.find(c => c.idUser === id_usuario);
    return usuario?.nombreCompleto;
  }

}
