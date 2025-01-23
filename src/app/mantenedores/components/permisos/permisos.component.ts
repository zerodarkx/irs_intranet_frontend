import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { PermisoConId, PermisosModulo } from 'src/app/interfaces';
import { EstadoClientesService, TipoSimulacionCanalService } from 'src/app/services';

import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

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
            { nombre: 'Exportar Excel', activo: false, permiso: 'BTN_EXPORTAREXCEL_CLIENTE' },
            { nombre: 'Filtrar Por Ejecutivo', activo: false, permiso: 'PER_FILTRAREJECUTIVO_CLIENTE' },
            { nombre: 'Rechazar Masivo', activo: false, permiso: 'PER_RECHAZOMASIVO_CLIENTE' },
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
            { nombre: 'Asignar Ejecutivo', activo: false, permiso: 'PER_ASIGNAR_EJECUTIVO' },
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
            { nombre: 'Modificiar Comision', activo: false, permiso: 'PER_MODIFICAR_COMISION' },
            { nombre: 'Modificar Rentar', activo: false, permiso: 'PER_MODIFICAR_RENTA' },
          ],
          activo: false,
          permiso: 'VER_SIMULADOR_CLIENTE'
        },
        {
          nombre: 'Canales Simulador',
          subcategorias: [],
          activo: false,
          permiso: 'VER_CANALES_CLIENTE'
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
        {
          nombre: 'Estados Cliente',
          activo: false,
          subcategorias: [],
          permiso: 'VER_ESTADOS_CLIENTE'
        },
      ],
      activo: false,
      permiso: 'VER_MODULO_CLIENTE'
    },
    {
      nombre: 'Negocios',
      activo: false,
      permiso: 'VER_MODULO_NEGOCIO',
    },
    {
      nombre: 'Mantenedores',
      activo: false,
      permiso: 'VER_MODULO_MANTENEDORES'
    },
    {
      nombre: 'Salidas',
      activo: false,
      permiso: 'VER_MODULO_SALIDAS'
    }
  ];

  permisosForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sCanalesSimulacion: TipoSimulacionCanalService,
    private sEstadosCliente: EstadoClientesService
  ) {
    this.obtenerCanalesSimulacion();
    this.obtenerEstadosClientes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioPermisos']) {
      this.permisosForm = this.fb.group({
        id: this.usuarioPermisos?.id,
        modulos: this.fb.array([]),
      });

      const permisos = this.combinarPermisos();
      this.cargarFormulario(permisos);
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

  obtenerCanalesSimulacion() {
    const dataModulo = this.modulos.find(modulo => modulo.nombre == 'Cliente');
    const dataCategoria = dataModulo?.categorias?.find(categoria => categoria.nombre == 'Canales Simulador');
    this.sCanalesSimulacion.obtenerTodosTipoCanales()
      .subscribe({
        next: (response) => {
          for (const sub of response.data) {
            dataCategoria!.subcategorias!.push({ nombre: sub.nombre_canal, activo: false, permiso: sub.det_canalSimulacion.toLocaleUpperCase() });
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
  }

  obtenerEstadosClientes() {
    const dataModulo = this.modulos.find(modulo => modulo.nombre == 'Cliente');
    const dataCategoria = dataModulo?.categorias?.find(categoria => categoria.nombre == 'Estados Cliente');
    this.sEstadosCliente.obtenerTodosLosEstados()
      .subscribe({
        next: (response) => {
          for (const sub of response.data) {
            dataCategoria!.subcategorias!.push({ nombre: sub.nombre_estado, activo: false, permiso: sub.det_estado.toLocaleUpperCase() });
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
  }

  combinarPermisos(): PermisosModulo[] {
    const backend = (this.usuarioPermisos?.permisos) ? this.usuarioPermisos.permisos : this.modulos;

    return this.modulos.map((modulo, i) => {
      const moduloBackend = backend[i];
      // Si no existe en backend, agregar el módulo completo (ajusta según tus necesidades)
      if (!moduloBackend) {
        return modulo;
      }
      return {
        ...moduloBackend,
        categorias: modulo.categorias?.map(categoria => {
          const categoriaBackend = moduloBackend.categorias?.find(cat => cat.nombre === categoria.nombre) || categoria;

          return {
            ...categoriaBackend,
            // Si no existe en backend, mantener subcategorías del inicial
            subcategorias: categoria.subcategorias?.map(subCategoria => {
              const subCategoriaBackend = categoriaBackend.subcategorias?.find(cat => cat.nombre === subCategoria.nombre) || subCategoria;
              return subCategoriaBackend
            })
          };
        })
      };
    });

  }
}
