import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Comuna, ResultadoObtenerComunas } from 'src/app/interfaces/comuna';
import { ComunaService } from 'src/app/services/comuna.service';
import { Iregiones, ResultadoObtenerTodasRegiones } from 'src/app/interfaces/regiones';
import { LineaNegocio, ResultadoObtenerTodasLineasNegocio } from 'src/app/interfaces/lineaNegocio';
import { LineaNegocioService } from 'src/app/services/linea-negocio.service';
import { Plataforma, ResultadoObtenerTodasPlataformas } from 'src/app/interfaces/plataforma';
import { PlataformaService } from 'src/app/services/plataforma.service';
import { RegionService } from 'src/app/services/region.service';

import { agregarMayusculas, formatearRut, formateadorMiles, soloNumeros } from 'src/app/shared/utils/formateadores';
import { rutValidator, validarCorreoInstitucional, soloNumerosFormulario } from 'src/app/shared/utils/validadores';
import { TipoPropiedadService } from 'src/app/services/tipo-propiedad.service';
import { ResultadoObtenerTodosTipoPropiedad, TipoPropiedad } from 'src/app/interfaces/tipoPropiedad';
import { nombreApellidoEjecutivoId, ResultadoCambiarEstado, ResultadoCrearCliente, ResultadoObtenerClienteById, ResultadoObtenerEjecutivoYbroker } from 'src/app/interfaces/cliente';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { IconoSweetAlert, mostrarMensaje, errorConexionServidor } from 'src/app/shared/utils/sweetAlert';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'cliente-detalle',
  templateUrl: './detalle-cliente.component.html',
  styles: []
})
export class DetalleClienteComponent implements OnInit {

  //variables para datos que son solo visuales
  estado_cliente: number = 0;
  nombreEstado: string = '';
  nombre_inversionista: string = '';

  //variables para los select
  selectComunas: Comuna[] = []
  selectRegiones: Iregiones[] = []
  selectPlataformas: Plataforma[] = []
  selectLineaNegocios: LineaNegocio[] = []
  selectTipoPropiedades: TipoPropiedad[] = []
  selectEjecutivosBrokers: nombreApellidoEjecutivoId[] = []

  permisos!: Record<string, any>;

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
    f_ingreso_cli: ['2024-12-12'],
    f_contacto_cli: ['', [
      Validators.required
    ]],
    rol_cli: ['', [
      Validators.required
    ]],
    l_plataforma_cli: [[], [
      Validators.required
    ]],
    l_negocio_cli: [[], [
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
    obs_cli: [''],
    selectEjecutivo: [[], [
      Validators.required
    ]
    ]
  })

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService,
    private sRegion: RegionService,
    private sComuna: ComunaService,
    private sPlataforma: PlataformaService,
    private sLineaNegocio: LineaNegocioService,
    private sTipoPropiedad: TipoPropiedadService,
    private sUsuario: UsuarioService,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.obtenerCliente();
    this.permisos = this.sPermiso.obtenerPermisos();
  }

  obtenerPermiso(modulo: string = '', categoria: string = '', subcategoria: string = '') {
    if (!modulo) return false;
    if (!categoria) return this.permisos[modulo].activo
    if (!subcategoria) return this.permisos[modulo].categorias[categoria].activo
    return this.permisos[modulo].categorias[categoria].subcategorias[subcategoria].activo
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
        next: ({ data }: ResultadoObtenerTodasRegiones) => {
          this.selectRegiones = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  selectPlataforma() {
    this.sPlataforma.obtenerTodasLasPlataformas()
      .subscribe({
        next: ({ data }: ResultadoObtenerTodasPlataformas) => {
          this.selectPlataformas = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  selectLineaNegocio() {
    this.sLineaNegocio.obtenerTodasLasLineasNegocio()
      .subscribe({
        next: ({ data }: ResultadoObtenerTodasLineasNegocio) => {
          this.selectLineaNegocios = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  selectTipoPropiedad() {
    this.sTipoPropiedad.obtenerTodasLosTipoPropiedad()
      .subscribe({
        next: ({ data }: ResultadoObtenerTodosTipoPropiedad) => {
          this.selectTipoPropiedades = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  selectEjecutivoBroker() {
    this.sUsuario.obtenerEjecutivosBrokers()
      .subscribe({
        next: ({ data }: ResultadoObtenerEjecutivoYbroker) => {
          this.selectEjecutivosBrokers = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  changeComuna(event: Iregiones | undefined): void {

    const region = event?.id_region
    this.selectComunas = []
    this.miFormulario.get('selectComuna')?.patchValue([]);

    // modificar esta parte de aca para generarse de forma automatica
    if (region) {
      this.sComuna.obtenerComunasPorRegion(region)
        .subscribe({
          next: ({ data }: ResultadoObtenerComunas) => {
            this.selectComunas = data
          },
          error: (error: HttpErrorResponse) => {
            // this.errorMessage = 'Error al obtener los datos';
            console.error('Error al obtener los datos:', error);
          }
        });
    }
  }

  selectComunaPorRegionById(id_region: number) {
    this.sComuna.obtenerComunasPorRegion(id_region)
      .subscribe({
        next: ({ data }: ResultadoObtenerComunas) => {
          this.selectComunas = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  obtenerCliente() {
    this.sCliente.obtenerClientePorId()
      .subscribe({
        next: (response: ResultadoObtenerClienteById) => {
          if (response.ok) {
            this.miFormulario.patchValue({
              rut_cli: response.data.cli_rut,
              nombre_cli: response.data.cli_nombre,
              correo_cli: response.data.cli_correo,
              cod_telefono: response.data.id_codigo_telefono,
              telefono_cli: response.data.cli_telefono,
              f_ingreso_cli: response.data.cli_fecha_ingreso,
              f_contacto_cli: response.data.cli_fecha_contacto,
              rol_cli: response.data.rol,
              l_plataforma_cli: response.data.id_plataforma,
              l_negocio_cli: response.data.id_lineaNegocio,
              tipo_propiedad: response.data.id_tipoPropiedad,
              selectRegion: response.data.id_region,
              selectComuna: response.data.id_comuna,
              direccion_cli: response.data.cli_direccion,
              valorComercial_cli: response.data.cli_valor_comercial,
              deudaEstimada_cli: response.data.cli_deuda_estimada,
              mTerreno: response.data.mTerreno,
              mConstruidos: response.data.mConstruidos,
              obs_cli: response.data.cli_obs,
              selectEjecutivo: response.data.id_ejecutivo,
            })

            this.estado_cliente = response.data.id_estado;
            this.nombreEstado = response.data.nombre_estado;
            this.nombre_inversionista = response.data.inversionista;

            this.selectRegion();
            this.selectPlataforma();
            this.selectLineaNegocio();
            this.selectTipoPropiedad();
            this.selectEjecutivoBroker()
            this.selectComunaPorRegionById(response.data.id_region)
          } else {
            console.log("no hay cliente redirigir al buscador de cliente");

          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  guardarDatos(): void {
    this.sCliente.modificarClientePorId(this.miFormulario.value)
      .subscribe({
        next: (response: ResultadoCrearCliente) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Warning,
            titulo: response.ok ? 'Exito' : "Atención",
            mensaje: response.data.mensaje
          })

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  pasarSiguienteEstado() {
    this.sCliente.cambiarSiguienteEstado()
      .subscribe({
        next: (response: ResultadoCambiarEstado) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Warning,
            titulo: response.data.titulo,
            mensaje: response.data.mensaje
          })
          if (response.ok) this.nombreEstado = response.data.estado!;

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

}
