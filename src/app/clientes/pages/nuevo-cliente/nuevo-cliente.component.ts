import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Comuna, Plataforma, Iregiones, TipoPropiedad, ErrorHttpCustom } from 'src/app/interfaces';
import { ClienteService, ComunaService, PlataformaService, RegionService, TipoPropiedadService } from 'src/app/services';

import { agregarMayusculas, formateadorMiles, formatearRut, soloNumeros } from 'src/app/shared/utils/formateadores';
import { mostrarMensaje, IconoSweetAlert, errorConexionServidor } from 'src/app/shared/utils/sweetAlert';
import { rutValidator, soloNumerosFormulario, validarCorreoInstitucional } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'cliente-nuevo',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent {

  //variables para los select
  selectComunas: Comuna[] = []
  selectRegiones: Iregiones[] = []
  selectPlataformas: Plataforma[] = []
  selectTipoPropiedades: TipoPropiedad[] = []

  //variable del formulario
  miFormulario: FormGroup = this.fb.group({
    rut_cli: ['', [
      Validators.required,
      rutValidator
    ]],
    nombre_cli: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    correo_cli: ['', [
      Validators.required,
      Validators.email,
      validarCorreoInstitucional
    ]],
    cod_telefono: ['', [
      Validators.required
    ]],
    telefono_cli: ['', [
      Validators.required,
      soloNumerosFormulario
    ]],
    plataforma_cli: [[], [
      Validators.required
    ]],
    tipo_propiedad: [[], [
      Validators.required
    ]],
    selectRegion: [[], [
      Validators.required
    ]],
    selectComuna: [[], [
      Validators.required
    ]],
    direccion_cli: ['', [
      Validators.required
    ]],
    valorComercial_cli: ['', [
      Validators.required,
      soloNumerosFormulario
    ]],
    deudaEstimada_cli: ['', [
      Validators.required,
      soloNumerosFormulario
    ]],
    mTerreno: ['', [
      Validators.required,
      soloNumerosFormulario
    ]],
    mConstruidos: ['', [
      Validators.required,
      soloNumerosFormulario
    ]],
    obs_cli: ['']
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sRegion: RegionService,
    private sComuna: ComunaService,
    private sPlataforma: PlataformaService,
    private sTipoPropiedad: TipoPropiedadService,
    private sCLiente: ClienteService,
  ) { }

  ngOnInit(): void {
    this.selectRegion();
    this.selectPlataforma();
    this.selectTipoPropiedad();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.miFormulario.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formatearRut(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = formatearRut(input.value)
    this.miFormulario.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.miFormulario.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  soloNumeros(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = soloNumeros(input.value)
    this.miFormulario.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  validarDatos(campo: string): boolean {
    return this.miFormulario.controls[campo].touched &&
      this.miFormulario.controls[campo].invalid
  }

  validarExitoso(campo: string): boolean {
    return this.miFormulario.controls[campo].touched &&
      this.miFormulario.controls[campo].valid
  }

  selectRegion() {
    this.sRegion.obtenerTodasLasRegiones()
      .subscribe({
        next: ({ data }) => {
          this.selectRegiones = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }

  selectPlataforma() {
    this.sPlataforma.obtenerTodasLasPlataformas()
      .subscribe({
        next: ({ data }) => {
          this.selectPlataformas = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }

  selectTipoPropiedad() {
    this.sTipoPropiedad.obtenerTodasLosTipoPropiedad()
      .subscribe({
        next: ({ data }) => {
          this.selectTipoPropiedades = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }

  changeComuna(event: Iregiones | null): void {

    const region = event?.id_region
    this.selectComunas = []
    this.miFormulario.get('selectComuna')?.patchValue([]);

    if (region) {
      this.sComuna.obtenerComunasPorRegion(region)
        .subscribe({
          next: ({ data }) => {
            this.selectComunas = data
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error);
          }
        });
    }
  }

  guardarDatos(): void {
    const data = this.miFormulario.value;
    this.sCLiente.crearNuevoCliente(data)
      .subscribe({
        next: (resultado) => {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            mensaje: resultado.data.mensaje,
            titulo: 'Exito'
          })

          if (resultado.ok) {
            this.router.navigate(["/cliente", resultado.data.id_cliente])
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }
}
