import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { Payload } from '../interfaces/auth';
import { PermisosCategoria, PermisosModulo, PermisosSubCategoria } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private permisosSubject = new BehaviorSubject<Record<string, any>>(this.cargaInicial());
  permisos$ = this.permisosSubject.asObservable();

  constructor() { }

  cargaInicial(): Record<string, any> {
    const token = localStorage.getItem('token');
    if (!token) return []
    const decodedToken = jwtDecode<Payload>(token);
    const permisos: PermisosModulo[] = decodedToken.permisos;
    return this.generarPermisosJson(permisos);
  }

  guardarPermisos(modulos: PermisosModulo[]): void {
    this.permisosSubject.next(this.generarPermisosJson(modulos));
  }

  obtenerPermisos(): Record<string, any> {
    return this.permisosSubject.getValue();
  }

  generarPermisosJson(arreglo: PermisosModulo[]): Record<string, any> {
    return arreglo.reduce((resultado: Record<string, any>, modulo: PermisosModulo) => {
      const categoriasTransformadas = modulo.categorias
        ? modulo.categorias.reduce((obj: Record<string, any>, categoria: PermisosCategoria) => {
          obj[categoria.permiso] = {
            ...categoria,
            subcategorias: categoria.subcategorias
              ? categoria.subcategorias.reduce((subObj: Record<string, any>, subcategoria: PermisosSubCategoria) => {
                subObj[subcategoria.permiso] = { ...subcategoria };
                return subObj;
              }, {})
              : {},
          };
          return obj;
        }, {})
        : {};

      resultado[modulo.permiso] = {
        ...modulo,
        categorias: categoriasTransformadas,
      };

      return resultado;
    }, {});
  }
}
