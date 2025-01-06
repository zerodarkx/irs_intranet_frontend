import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Comuna } from 'src/app/interfaces/comuna';
import { Iregiones } from 'src/app/interfaces/regiones';
import { TipoCanalContacto } from 'src/app/interfaces/tipoContacto';
import { TipoPropiedad } from 'src/app/interfaces/tipoPropiedad';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ComunaService } from 'src/app/services/comuna.service';
import { RegionService } from 'src/app/services/region.service';
import { TipoContactoService } from 'src/app/services/tipo-contacto.service';
import { TipoPropiedadService } from 'src/app/services/tipo-propiedad.service';
import { agregarMayusculas, formateadorMiles, formatearRut } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { rutValidator } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'app-chile',
  templateUrl: './chile.component.html',
  styleUrls: ['./chile.component.css']
})
export class ChileComponent implements OnInit {
  plataforma: string = ''
  simulacion: string = ''

  selectTipoPropiedad: TipoPropiedad[] = []
  selectRegiones: Iregiones[] = []
  selectComunas: Comuna[] = []
  selectComoSupoNosotros: TipoCanalContacto[] = []

  formCliente: FormGroup = this.fb.group({
    id_plataforma: [],
    id_canal: [, [
      Validators.required
    ]],
    id_comuna: [, [
      Validators.required
    ]],
    id_tipoPropiedad: [, [
      Validators.required
    ]],
    cli_rut: [, [
      Validators.required,
      rutValidator
    ]],
    cli_nombre: [, [
      Validators.required

    ]],
    cli_telefono: [, [
      Validators.required
    ]],
    cli_correo: [, [
      Validators.required,
      Validators.email
    ]],
    cli_direccion: [, [
      Validators.required
    ]],
    cli_obs: [, []],
    cli_deuda_estimada: [, [
      Validators.required
    ]],
    cli_valor_comercial: [, [
      Validators.required
    ]],
  })

  constructor(
    private fb: FormBuilder,
    private sRegion: RegionService,
    private sComuna: ComunaService,
    private sTipoPropiedad: TipoPropiedadService,
    private sCanaContacto: TipoContactoService,
    private sAuth: AuthService,
    private activedRouter: ActivatedRoute,
    private sCliente: ClienteService
  ) { }

  async ngOnInit() {
    this.activedRouter.params
      .subscribe(({ plataforma }) => {
        this.plataforma = plataforma
        this.formCliente.get('id_plataforma')?.setValue(plataforma)
      })
    await this.generarTokenTemporal()
    this.obtenerRegiones()
    this.obtenerTipoPropiedad()
    this.obtenerCanalesComoSupo()
  }

  async generarTokenTemporal() {
    const response = await firstValueFrom(this.sAuth.generarTokenTemporal());
    localStorage.setItem('token', response.token);
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formCliente.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formatearRut(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = formatearRut(input.value)
    this.formCliente.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formCliente.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  obtenerRegiones() {
    this.sRegion.obtenerTodasLasRegiones()
      .subscribe({
        next: (response) => {
          this.selectRegiones = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  obtenerComunasPorRegion(event: Iregiones | null) {
    const region = event?.id_region
    this.selectComunas = []
    this.formCliente.get('id_comuna')?.patchValue([]);

    if (region) {
      this.sComuna.obtenerComunasPorRegion(region)
        .subscribe({
          next: ({ data }) => {
            this.selectComunas = data
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error al obtener los datos:', error);
          }
        });
    }
  }

  obtenerTipoPropiedad() {
    this.sTipoPropiedad.obtenerTodasLosTipoPropiedad()
      .subscribe({
        next: (response) => {
          this.selectTipoPropiedad = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  obtenerCanalesComoSupo() {
    this.sCanaContacto.obtenerTodosTipoContacto()
      .subscribe({
        next: (response) => {
          this.selectComoSupoNosotros = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  enviarFormulario() {
    this.sCliente.crearClienteFormularioExterno(this.formCliente.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: 'Exito',
            mensaje: response.data.mensaje
          })

          this.formCliente.reset()
          this.formCliente.get('id_plataforma')?.setValue(this.plataforma)
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }
}
