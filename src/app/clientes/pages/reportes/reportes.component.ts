import { Component } from '@angular/core';
import { ErrorHttpCustom } from 'src/app/interfaces';
import { ExportarExcelService } from 'src/app/services';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  constructor(
    private sExportar: ExportarExcelService
  ) { }


  exportarExcel() {
    let fechaHoy = new Date().toLocaleDateString();
    let nombreArchivo = `exportarCliente_${fechaHoy}.xlsx`;

    this.sExportar.exportarGestionesCormercialesCLiente("a")
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
        }
      });
  }

}
