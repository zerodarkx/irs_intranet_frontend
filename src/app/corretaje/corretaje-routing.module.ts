import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioCorretajeComponent } from './pages/inicio-corretaje/inicio-corretaje.component';
import { DetalleCorretajeComponent } from './components/detalle-corretaje/detalle-corretaje.component';
import { BusquedaCorretajeComponent } from './pages/busqueda-corretaje/busqueda-corretaje.component';
import { CaracteristicasCorretajeComponent } from './components/caracteristicas-corretaje/caracteristicas-corretaje.component';
import { DocumentosCorretajeComponent } from './components/documentos-corretaje/documentos-corretaje.component';
import { BitacoraCorretajeComponent } from './components/bitacora-corretaje/bitacora-corretaje.component';
import { ImagenesCorretajeComponent } from './components/imagenes-corretaje/imagenes-corretaje.component';
import { RespuestaBitacoraComponent } from './components/respuesta-bitacora/respuesta-bitacora.component';

const routes: Routes = [
  {
    path: 'buscarPropiedad',
    component: BusquedaCorretajeComponent,
  },
  {
    path: 'respuestaBitacora/:idRespuesta',
    component: RespuestaBitacoraComponent,
  },
  {
    path: ':idPropiedad',
    component: InicioCorretajeComponent,
    children: [
      { path: 'detalle', component: DetalleCorretajeComponent },
      // { path: 'caracteristicas', component: CaracteristicasCorretajeComponent },
      { path: 'documentos', component: DocumentosCorretajeComponent },
      { path: 'bitacora', component: BitacoraCorretajeComponent },
      { path: 'imagenes', component: ImagenesCorretajeComponent },
      { path: '**', redirectTo: 'detalle', pathMatch: 'full' },
    ],
  },
  {
    path: '**',
    redirectTo: 'buscarPropiedad',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorretajeRoutingModule {}
