import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-rechazar-masivo',
  templateUrl: './rechazar-masivo.component.html',
  styleUrls: ['./rechazar-masivo.component.css']
})
export class RechazarMasivoComponent {

  formRechazar: FormGroup = this.fb.group({
    archivo: ['', Validators.required]
  })
  selectedDocuemento: File | null = null;

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    this.selectedDocuemento = input.files ? input.files[0] : null;
  }

  insertarDocumento() {
    if (!this.selectedDocuemento) {
      mostrarMensaje({
        icono: IconoSweetAlert.Error,
        mensaje: "Seleccione un archivo",
        titulo: "Atención"
      })
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.selectedDocuemento);

    this.sCliente.rechazarMasivoCliente(formData)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            mensaje: response.data.mensaje,
            titulo: response.ok ? "Exito" : "Atención"
          })
          this.formRechazar.reset();
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

}
