import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorHttpCustom } from 'src/app/interfaces';
import { ClienteService } from 'src/app/services';
import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-contactanos-chile',
  templateUrl: './contactanos-chile.component.html',
  styleUrls: ['./contactanos-chile.component.css']
})
export class ContactanosChileComponent {
plataforma: string = '';

  form_contactanos = this.fb.group({
    id_plataforma: [''],
    cli_nombre: [, [
      Validators.required
    ]],
    cli_telefono: [, [
      Validators.required
    ]],
    cli_correo: [, [
      Validators.required
    ]],
    cli_obs: ['', []],
  })

  constructor(
    private fb: FormBuilder,
    private activedRouter: ActivatedRoute,
    private sCliente: ClienteService
  ) { }

  ngOnInit(): void {
    this.activedRouter.params
      .subscribe(({ plataforma }) => {
        this.plataforma = plataforma
        this.form_contactanos.get('id_plataforma')?.setValue(plataforma)
      })

  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.form_contactanos.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  enviarFormulario() {

    this.sCliente.crearClienteFormularioContactanos(this.form_contactanos.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: 'Formulario enviado',
            mensaje: response.data.mensaje
          });

          this.form_contactanos.reset();
          this.form_contactanos.get('id_plataforma')?.setValue(this.plataforma);
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }
}
