import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBancos, ResultadoTodosBancos } from 'src/app/interfaces/bancos';
import { Comuna, ResultadoObtenerComunas } from 'src/app/interfaces/comuna';
import { exportarPdf } from 'src/app/interfaces/exportar';
import { ResultadoObtenerFichaComite } from 'src/app/interfaces/fichaComite';
import { Iregiones, ResultadoObtenerTodasRegiones } from 'src/app/interfaces/regiones';
import { ResultadoObtenerSimulacionPorCliente } from 'src/app/interfaces/simulador';
import { BancoService } from 'src/app/services/banco.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ComunaService } from 'src/app/services/comuna.service';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { RegionService } from 'src/app/services/region.service';
import { SimuladorService } from 'src/app/services/simulador.service';
import {
  agregarMayusculas,
  formateadorMilesDesdeBase,
  formateadorMiles,
  formatearRut,
  soloNumeros,
  dejarNumeroBrutos
} from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { rutValidator, soloNumerosFormulario } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'cliente-ficha-comite',
  templateUrl: './ficha-comite.component.html',
  styleUrls: ['./ficha-comite.component.css']
})
export class FichaComiteComponent {

  selectComunas: Comuna[] = []
  selectRegiones: Iregiones[] = []
  selectBancos: IBancos[] = []

  selectInversionista = [
    { id: 1, nombre: 'BOC', comision: 0, tasa: 1.4 },
    { id: 2, nombre: 'Quest', comision: 2.5, tasa: 1.08 },
  ]

  formFichaComite: FormGroup = this.fb.group({
    id_fichaComite: [, []],
    id_cliente: ['', []],
    nom_cliente: ['', []],
    rut: ['', [
      rutValidator
    ]],
    profesion: ['', []],
    direccion: ['', []],
    id_region: [, []],
    id_comuna: [, []],
    id_codigo_telefono: ['', []],
    telefono: [, []],
    tel_empresa: [, []],
    email: ['', []],
    web: ['', []],
    resena_cliente: ['', []],
    nom_compania: ['', []],
    rut_empresa: ['', [
      rutValidator
    ]],
    participacion_empresa: ['', []],
    giro_empresa: ['', []],
    desResCli: ['', []],
    desNesOpe: ['', []],
    desComReaCom: ['', []],
    desComReaCom_obs: ['', []],
    desComentario: ['', []],
    perInfCom: ['', []],
    perInfCom_cant: ['', []],
    perInfCom_monto: ['', []],
    perInfCom_obs: ['', []],
    perdeu: ['', []],
    perdeu_est: ['', []],
    perdeu_obs: ['', []],
    percip: ['', []],
    percip_obs: ['', []],
    percerdeuhip: ['', []],
    percerdeuhip_cant: ['', []],
    percerdeuhip_obs: ['', []],
    percerdeucon: ['', []],
    percerdeucon_cant: ['', []],
    percerdeucon_obs: ['', []],
    perinflegal: ['', []],
    perinflegal_tip: ['', []],
    perinflegal_cant: ['', []],
    perinflegal_obs: ['', []],
    cominfcom: ['', []],
    cominfcom_cant: ['', []],
    cominfcom_monto: ['', []],
    cominfcom_obs: ['', []],
    comdeu: ['', []],
    comdeu_est: ['', []],
    comdeu_obs: ['', []],
    comcip: ['', []],
    comcip_obs: ['', []],
    comcerdeuhip: ['', []],
    comcerdeuhip_cant: ['', []],
    comcerdeuhip_obs: ['', []],
    comcerdeucontr: ['', []],
    comcerdeucontr_cant: ['', []],
    comcerdeucontr_obs: ['', []],
    cominfper: ['', []],
    cominfper_tip: ['', []],
    cominfper_cant: ['', []],
    cominfper_obs: ['', []],
    destinoSII: ['', []],
    tipoInmueble: ['', []],
    estaBodega: ['', []],
    id_tasador: [, []],
    fechaTasacion: ['', []],
    detprositlegpro: ['', []],
    detprositlegpro_banco: [, []],
    situacionLegalPro: ['', []],
    id_tipoConstruccion: [, []],
    regularizacion: ['', []],
    quienViveInmueble: ['', []],
    quienViveInmueble_obs: ['', []],
    terrenoEstimado_uf: ['', [
      soloNumerosFormulario
    ]],
    terrenoEstimado_m2: ['', [
      soloNumerosFormulario
    ]],
    cinstruccionEstimado_uf: ['', [
      soloNumerosFormulario
    ]],
    cinstruccionEstimado_m2: ['', [
      soloNumerosFormulario
    ]],
    propiedadEstimado_uf: ['', [
      soloNumerosFormulario
    ]],
    precioLiquidacion: ['', [
      soloNumerosFormulario
    ]],
    avaluoFiscal: ['', [
      soloNumerosFormulario
    ]],
    velocidadVenta: ['', []],
    valor_uf: ['', [
      soloNumerosFormulario
    ]],
    ltv: ['', [
      soloNumerosFormulario
    ]],
    compraventa: ['', [
      soloNumerosFormulario
    ]],
    renta_anual: ['', [
      soloNumerosFormulario
    ]],
    gastos_operacionales: ['', [
      soloNumerosFormulario
    ]],
    alzamiento: ['', [
      soloNumerosFormulario
    ]],
    administracion: ['', [
      soloNumerosFormulario
    ]],
    contribuciones: ['', [
      soloNumerosFormulario
    ]],
    provicion_contribuciones: ['', [
      soloNumerosFormulario
    ]],
    liquido_cliente: ['', [
      soloNumerosFormulario
    ]],
    tasa: ['', []],
    comision: ['', []],
  })

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService,
    private sComuna: ComunaService,
    private sRegion: RegionService,
    private sBanco: BancoService,
    private sSimulador: SimuladorService,
    private sExpotarPdf: ExportarPdfService,
  ) { }

  ngOnInit(): void {
    this.obtenerDataInicial();
    this.selectRegion();
    this.selectBanco();
  }

  formatearRut(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = formatearRut(input.value)
    this.formFichaComite.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formFichaComite.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  soloNumeros(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = soloNumeros(input.value)
    this.formFichaComite.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formFichaComite.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  selectBanco() {
    this.sBanco.obtenerTodosBancos()
      .subscribe({
        next: (response: ResultadoTodosBancos) => {
          this.selectBancos = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
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

  changeComuna(event: Iregiones | undefined): void {

    const region = event?.id_region
    this.selectComunas = []
    this.formFichaComite.get('id_comuna')?.patchValue([]);

    // modificar esta parte de aca para generarse de forma automatica
    if (region) {
      this.sComuna.obtenerComunasPorRegion(region)
        .subscribe({
          next: ({ data }: ResultadoObtenerComunas) => {
            this.selectComunas = data
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
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

  detalleComitePropuesta() {

    let ltv = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('ltv')?.value || 0));
    ltv = ltv / 100;

    /**VALOR CONTRATO */
    let valor_propiedad = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('propiedadEstimado_uf')?.value || 0));
    if (valor_propiedad >= 0) {

      let tasa = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('tasa')?.value || 0));
      let comision = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('comision')?.value || 0));


      tasa = tasa / 100;
      comision = comision / 100;
      let valor_contrato = valor_propiedad * ltv;
      let renta_anual = (valor_contrato * tasa * 12).toFixed(2);
      let administracion = (valor_contrato * comision).toFixed(2);

      this.formFichaComite.patchValue({
        compraventa: formateadorMilesDesdeBase(valor_contrato),
        renta_anual: formateadorMilesDesdeBase(renta_anual),
        administracion: formateadorMilesDesdeBase(administracion),
      });

      this.calcularLiquidoFichaComite();

    }
  }

  calcularLiquidoFichaComite = () => {

    let compraventa = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('compraventa')?.value || 0));
    let renta_anual = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('renta_anual')?.value || 0));
    let gastos_operacionales = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('gastos_operacionales')?.value || 0));
    let alzamiento = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('alzamiento')?.value || 0));
    let administracion = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('administracion')?.value || 0));
    let contribuciones = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('contribuciones')?.value || 0));
    let provicion_contribuciones = parseFloat(dejarNumeroBrutos(this.formFichaComite.get('provicion_contribuciones')?.value || 0));

    let liquido = compraventa - renta_anual - gastos_operacionales - alzamiento - administracion - contribuciones - provicion_contribuciones;

    this.formFichaComite.patchValue({
      liquido_cliente: formateadorMilesDesdeBase(liquido)
    })

  }

  obtenerDataInicial() {
    this.sCliente.obtenerFichaComiteByCliente()
      .subscribe({
        next: (response: ResultadoObtenerFichaComite) => {
          if (response.ok) {
            this.formFichaComite.patchValue({
              id_fichaComite: response.data.id_fichaComite || '',
              id_cliente: response.data.id_cliente || '',
              nom_cliente: response.data.nom_cliente || '',
              rut: response.data.rut || '',
              profesion: response.data.profesion || '',
              direccion: response.data.direccion || '',
              id_region: response.data.id_region || '',
              id_comuna: response.data.id_comuna || '',
              id_codigo_telefono: 1 || '',
              telefono: response.data.telefono || '',
              tel_empresa: response.data.tel_empresa || '',
              email: response.data.email || '',
              web: response.data.web || '',
              resena_cliente: response.data.resena_cliente || '',
              nom_compania: response.data.nom_compania || '',
              rut_empresa: response.data.rut_empresa || '',
              participacion_empresa: response.data.participacion_empresa || '',
              giro_empresa: response.data.giro_empresa || '',
              desResCli: response.data.desResCli || '',
              desNesOpe: response.data.desNesOpe || '',
              desComReaCom: response.data.desComReaCom || '',
              desComReaCom_obs: response.data.desComReaCom_obs || '',
              desComentario: response.data.desComentario || '',
              perInfCom: response.data.perInfCom || '',
              perInfCom_cant: response.data.perInfCom_cant || '',
              perInfCom_monto: response.data.perInfCom_monto || '',
              perInfCom_obs: response.data.perInfCom_obs || '',
              perdeu: response.data.perdeu || '',
              perdeu_est: response.data.perdeu_est || '',
              perdeu_obs: response.data.perdeu_obs || '',
              percip: response.data.percip || '',
              percip_obs: response.data.percip_obs || '',
              percerdeuhip: response.data.percerdeuhip || '',
              percerdeuhip_cant: formateadorMilesDesdeBase(response.data.percerdeuhip_cant),
              percerdeuhip_obs: response.data.percerdeuhip_obs || '',
              percerdeucon: response.data.percerdeucon || '',
              percerdeucon_cant: formateadorMilesDesdeBase(response.data.percerdeucon_cant),
              percerdeucon_obs: response.data.percerdeucon_obs || '',
              perinflegal: response.data.perinflegal || '',
              perinflegal_tip: response.data.perinflegal_tip || '',
              perinflegal_cant: response.data.perinflegal_cant || '',
              perinflegal_obs: response.data.perinflegal_obs || '',
              cominfcom: response.data.cominfcom || '',
              cominfcom_cant: response.data.cominfcom_cant || '',
              cominfcom_monto: response.data.cominfcom_monto || '',
              cominfcom_obs: response.data.cominfcom_obs || '',
              comdeu: response.data.comdeu || '',
              comdeu_est: response.data.comdeu_est || '',
              comdeu_obs: response.data.comdeu_obs || '',
              comcip: response.data.comcip || '',
              comcip_obs: response.data.comcip_obs || '',
              comcerdeuhip: response.data.comcerdeuhip || '',
              comcerdeuhip_cant: formateadorMilesDesdeBase(response.data.comcerdeuhip_cant),
              comcerdeuhip_obs: response.data.comcerdeuhip_obs || '',
              comcerdeucontr: response.data.comcerdeucontr || '',
              comcerdeucontr_cant: formateadorMilesDesdeBase(response.data.comcerdeucontr_cant),
              comcerdeucontr_obs: response.data.comcerdeucontr_obs || '',
              cominfper: response.data.cominfper || '',
              cominfper_tip: response.data.cominfper_tip || '',
              cominfper_cant: response.data.cominfper_cant || '',
              cominfper_obs: response.data.cominfper_obs || '',
              destinoSII: response.data.destinoSII || '',
              tipoInmueble: response.data.tipoInmueble || '',
              estaBodega: response.data.estaBodega || '',
              id_tasador: response.data.id_tasador,
              fechaTasacion: response.data.fechaTasacion || '',
              detprositlegpro: response.data.detprositlegpro || '',
              detprositlegpro_banco: response.data.detprositlegpro_banco,
              situacionLegalPro: response.data.situacionLegalPro || '',
              id_tipoConstruccion: response.data.id_tipoConstruccion,
              regularizacion: response.data.regularizacion || '',
              quienViveInmueble: response.data.quienViveInmueble || '',
              quienViveInmueble_obs: response.data.quienViveInmueble_obs || '',
              terrenoEstimado_uf: formateadorMilesDesdeBase(response.data.terrenoEstimado_uf),
              terrenoEstimado_m2: formateadorMilesDesdeBase(response.data.terrenoEstimado_m2),
              cinstruccionEstimado_uf: formateadorMilesDesdeBase(response.data.cinstruccionEstimado_uf),
              cinstruccionEstimado_m2: formateadorMilesDesdeBase(response.data.cinstruccionEstimado_m2),
              propiedadEstimado_uf: formateadorMilesDesdeBase(response.data.propiedadEstimado_uf),
              precioLiquidacion: formateadorMilesDesdeBase(response.data.precioLiquidacion),
              avaluoFiscal: formateadorMilesDesdeBase(response.data.avaluoFiscal),
              velocidadVenta: response.data.velocidadVenta || '',
              valor_uf: formateadorMilesDesdeBase(response.data.valor_uf),
              ltv: formateadorMilesDesdeBase(response.data.ltv),
              compraventa: formateadorMilesDesdeBase(response.data.compraventa),
              renta_anual: formateadorMilesDesdeBase(response.data.renta_anual),
              gastos_operacionales: formateadorMilesDesdeBase(response.data.gastos_operacionales),
              alzamiento: formateadorMilesDesdeBase(response.data.alzamiento),
              administracion: formateadorMilesDesdeBase(response.data.administracion),
              contribuciones: formateadorMilesDesdeBase(response.data.contribuciones),
              provicion_contribuciones: formateadorMilesDesdeBase(response.data.provicion_contribuciones),
              liquido_cliente: formateadorMilesDesdeBase(response.data.liquido_cliente),
              tasa: formateadorMilesDesdeBase(response.data.tasa),
              comision: formateadorMilesDesdeBase(response.data.comision),
            })
          } else {
            this.sSimulador.obtenerSimulacionPorIdCliente()
              .subscribe({
                next: ({ data }: ResultadoObtenerSimulacionPorCliente) => {

                  this.formFichaComite.patchValue({
                    id_cliente: response.data.id_cliente,
                    nom_cliente: response.data.nom_cliente,
                    rut: response.data.rut,
                    direccion: response.data.direccion,
                    id_comuna: response.data.id_comuna,
                    telefono: response.data.telefono,
                    email: response.data.email,
                    id_region: response.data.id_region,
                  });

                  if (!data) return

                  this.formFichaComite.patchValue({
                    ltv: formateadorMilesDesdeBase(data.descuento),
                    compraventa: formateadorMilesDesdeBase(data.valor_contrato),
                    gastos_operacionales: formateadorMilesDesdeBase(data.gastos_operacionales),
                    alzamiento: formateadorMilesDesdeBase(data.deuda_hipotecaria),
                    contribuciones: formateadorMilesDesdeBase(data.contribuciones),
                    liquido_cliente: formateadorMilesDesdeBase(data.liquido_cliente),
                    tasa: formateadorMilesDesdeBase(data.renta_mensual),
                    propiedadEstimado_uf: formateadorMilesDesdeBase(data.valor_comercial),
                  })
                  this.detalleComitePropuesta()
                },
                error: (error: HttpErrorResponse) => {
                  errorConexionServidor(error)
                },
              })
          }
          this.selectComunaPorRegionById(response.data.id_region);
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  guardarFicha() {
    this.sCliente.guardarFichaComite(this.formFichaComite.value)
      .subscribe({
        next: (response) => {
          console.log(response);
          
          if (response.ok) {
            this.formFichaComite.patchValue({
              id_fichaComite: response.data.id_fichaComite
            })
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: 'Exito'
            })
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  exportarFicha() {

    this.sExpotarPdf.exportarFichaComitePdf(this.formFichaComite.get('id_cliente')?.value)
      .subscribe({
        next: (response: exportarPdf) => {
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

  cambiarInversionistaComisionTasa(event: any) {
    if (event) {
      this.formFichaComite.patchValue({
        comision: formateadorMilesDesdeBase(event.comision),
        tasa: formateadorMilesDesdeBase(event.tasa),
      });
    } else {
      this.formFichaComite.patchValue({
        comision: 0,
        tasa: 0,
      });
    }

    this.detalleComitePropuesta();

  }

}
