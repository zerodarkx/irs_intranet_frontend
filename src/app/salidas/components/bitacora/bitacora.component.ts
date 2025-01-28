import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {

  comentariosBitacora = [
    {
      comentario: 'comentario 1',
      fecha_ingreso: new Date(),
      usuario: 'usuario 1'
    },
    {
      comentario: 'comentario 2',
      fecha_ingreso: new Date(),
      usuario: 'usuario 2'
    },
    {
      comentario: 'comentario 3',
      fecha_ingreso: new Date(),
      usuario: 'usuario 3'
    },
    {
      comentario: 'comentario 4',
      fecha_ingreso: new Date(),
      usuario: 'usuario 4'
    },
    {
      comentario: 'comentario 5',
      fecha_ingreso: new Date(),
      usuario: 'usuario 5'
    }
  ];

  formBitacora = this.fb.group({
    comentario: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.obtenerComentarios();
  }

  obtenerComentarios() {
  }

  guardarBitacora() {
    this.comentariosBitacora.push({
      comentario: this.formBitacora.value.comentario || '',
      fecha_ingreso: new Date(),
      usuario: 'usuario 1'
    });
  }

}
