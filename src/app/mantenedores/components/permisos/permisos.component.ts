import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { PermisoConId, PermisosModulo } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantenedores-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css']
})
export class PermisosComponent implements OnChanges {
  @Input('permisos') usuarioPermisos?: PermisoConId;

  modulos: PermisosModulo[] = [
    {
      nombre: 'Cliente',
      categorias: [
        {
          nombre: 'Buscar Cliente',
          subcategorias: [
            { nombre: 'Agregar Cliente', activo: false, permiso: 'BTN_AGREGAR_CLIENTE' },
            { nombre: 'Exportar Excel', activo: false, permiso: 'BTN_EXPORTAREXCEL_CLIENTE' }
          ],
          activo: false,
          permiso: 'VER_BUSCAR_CLIENTE',
        },
        {
          nombre: 'Informacion',
          subcategorias: [
            { nombre: 'Rechazar', activo: false, permiso: 'BTN_RECHAZAR_CLIENTE' },
            { nombre: 'Volver Estado', activo: false, permiso: 'BTN_VOLVER_CLIENTE' },
            { nombre: 'Guardar Cliente', activo: false, permiso: 'BTN_GUARDAR_CLIENTE' },
            { nombre: 'Siguiente Estado', activo: false, permiso: 'BTN_SIGUIENTE_CLIENTE' },
          ],
          activo: false,
          permiso: 'VER_DETALLE_CLIENTE'
        },
        {
          nombre: 'Curse',
          activo: false,
          permiso: 'VER_CURSE_CLIENTE'
        },
        {
          nombre: 'Reservas',
          activo: false,
          permiso: 'VER_RESERVA_CLIENTE'
        },
        {
          nombre: 'Documentos e Imagenes',
          subcategorias: [
            { nombre: 'Guardar Documento', activo: false, permiso: 'BTN_GUARDAR_DOCUMENTO' },
            { nombre: 'Eliminar Documento', activo: false, permiso: 'BTN_ELIMINAR_DOCUMENTO' },
            { nombre: 'Guardar Imagen', activo: false, permiso: 'BTN_GUARDAR_IMAGEN' },
            { nombre: 'Eliminar Imagen', activo: false, permiso: 'BTN_ELIMINAR_IMAGEN' },
          ],
          activo: false,
          permiso: 'VER_DOCUMENTOS_CLIENTE'
        },
        {
          nombre: 'Simulador',
          subcategorias: [
            { nombre: 'Nueva Simulacion', activo: false, permiso: 'BTN_NUEVA_SIMULACION' },
            { nombre: 'Ver Simulacion', activo: false, permiso: 'BTN_VER_SIMULACION' },
            { nombre: 'Descargar Simulacion', activo: false, permiso: 'BTN_DESCARGAR_SIMULACION' },
          ],
          activo: false,
          permiso:'VER_SIMULADOR_CLIENTE'
        },
        {
          nombre: 'Gestion',
          activo: false,
          permiso: 'VER_GESTION_CLIENTE'
        },
        {
          nombre: 'Ficha Comite',
          activo: false,
          permiso: 'VER_FICHACOMITE_CLIENTE'
        },
        {
          nombre: 'Gastos Cliente',
          activo: false,
          permiso: 'VER_GASTOS_CLIENTE'
        },
      ],
      activo: false,
      permiso: 'VER_MODULO_CLIENTE'
    },
    {
      nombre: 'Negocios',
      activo: false,
      permiso: 'VER_MODULO_NEGOCIO'
    },
    {
      nombre: 'Mantenedores',
      activo: false,
      permiso: 'VER_MODULO_MANTENEDORES'
    }
  ];

  modulosMostrar: PermisosModulo[] = [];

  permisosForm!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioPermisos']) {
      this.permisosForm = this.fb.group({
        id: this.usuarioPermisos?.id,
        modulos: this.fb.array([]),
      });

      this.modulosMostrar = (this.usuarioPermisos?.permisos) ? this.usuarioPermisos?.permisos : this.modulos;
      this.cargarFormulario(this.modulosMostrar);
    }
  }

  cargarFormulario(permisos: PermisosModulo[]): void {
    const modulosFormArray = this.permisosForm.get('modulos') as FormArray;

    permisos.forEach((modulo) => {
      const categoriasFormArray = modulo.categorias
        ? this.fb.array(
          modulo.categorias.map((categoria) => {
            const subcategoriasFormArray = categoria.subcategorias
              ? this.fb.array(
                categoria.subcategorias.map((subcategoria) =>
                  this.fb.group({
                    nombre: [subcategoria.nombre],
                    activo: [subcategoria.activo],
                    permiso: [subcategoria.permiso]
                  })
                )
              )
              : this.fb.array([]);

            return this.fb.group({
              nombre: [categoria.nombre],
              activo: [categoria.activo],
              subcategorias: subcategoriasFormArray,
              permiso: [categoria.permiso]
            });
          })
        )
        : this.fb.array([]);

      modulosFormArray.push(
        this.fb.group({
          nombre: [modulo.nombre],
          activo: [modulo.activo],
          categorias: categoriasFormArray,
          permiso: [modulo.permiso]
        })
      );
    });
  }

  obtenerModulos(): FormArray {
    return this.permisosForm.get('modulos') as FormArray;
  }

  obtenerCategorias(moduloIndex: number): FormArray {
    return this.obtenerModulos().at(moduloIndex).get('categorias') as FormArray;
  }

  obtenerSubcategorias(moduloIndex: number, categoriaIndex: number): FormArray {
    return this.obtenerCategorias(moduloIndex).at(categoriaIndex).get('subcategorias') as FormArray;
  }
}
