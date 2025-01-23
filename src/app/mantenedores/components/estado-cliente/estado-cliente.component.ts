import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ClienteEstados, ResultadoClienteEstados } from 'src/app/interfaces';
import { ClienteEstadosService } from 'src/app/services';

import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-estado-cliente',
  templateUrl: './estado-cliente.component.html',
  styleUrls: ['./estado-cliente.component.css']
})
export class EstadoClienteComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';
  estadoCliente: ClienteEstados[] = []

  formCanalSimulacion: FormGroup = this.fb.group({
    id_canal: [0],
    nombre_canal: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sEstadoCliente: ClienteEstadosService
  ) { }
  ngOnInit(): void {
    this.obtenerTodosEstadosCliente();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formCanalSimulacion.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  obtenerTodosEstadosCliente() {
    this.sEstadoCliente.obtenerTodosTipoCanales()
      .subscribe({
        next: (response: ResultadoClienteEstados) => {
          this.estadoCliente = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }


}
