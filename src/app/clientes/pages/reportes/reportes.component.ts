import { Component } from '@angular/core';
import {
  ErrorHttpCustom,
  SelectInversionistaDisponibles,
} from 'src/app/interfaces';
import { ExportarExcelService, UsuarioService } from 'src/app/services';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent {
  selectInversionista: SelectInversionistaDisponibles[] = [];
  selectedInversionista!: number;

  constructor(
    private sExportar: ExportarExcelService,
    private sInversionistas: UsuarioService,
  ) {
    this.sInversionistas.obtenerSelectInversionista().subscribe({
      next: (res) => {
        this.selectInversionista = res.data;
      },
      error: (error: ErrorHttpCustom) => {
        errorConexionServidor(error);
      },
    });
  }

  exportarExcel() {
    let fechaHoy = new Date().toLocaleDateString();
    let nombreArchivo = `exportarCliente_${fechaHoy}.xlsx`;

    this.sExportar.exportarGestionesCormercialesCLiente('a').subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: ErrorHttpCustom) => {
        errorConexionServidor(error);
      },
    });
  }

  exportarGastosOperacionales() {
    let fechaHoy = new Date().toLocaleDateString();
    let nombreArchivo = `exportarGastoOperacionales_${fechaHoy}.xlsx`;

    this.sExportar
      .exportarGastosOperacionales({ id_inv: this.selectedInversionista })
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nombreArchivo;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        },
      });
  }
}
