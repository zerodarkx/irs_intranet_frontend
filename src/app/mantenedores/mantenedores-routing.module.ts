import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseMantenedorComponent } from './pages/base-mantenedor/base-mantenedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { TipoPropiedadComponent } from './components/tipo-propiedad/tipo-propiedad.component';
import { TipoImagenesComponent } from './components/tipo-imagenes/tipo-imagenes.component';
import { TipoDocumentosComponent } from './components/tipo-documentos/tipo-documentos.component';
import { TipoContactoComponent } from './components/tipo-contacto/tipo-contacto.component';
import { LineaNegocioComponent } from './components/linea-negocio/linea-negocio.component';
import { CanalSimulacionComponent } from './components/canal-simulacion/canal-simulacion.component';
import { EstadoClienteComponent } from './components/estado-cliente/estado-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: BaseMantenedorComponent,
    children: [
      {
        path: 'usuario',
        component: UsuarioComponent
      },
      {
        path: 'tipoPerfiles',
        component: PerfilUsuarioComponent
      },
      {
        path: 'tipoPropiedad',
        component: TipoPropiedadComponent
      },
      {
        path: 'tipoImagen',
        component: TipoImagenesComponent
      },
      {
        path: 'tipoDocumento',
        component: TipoDocumentosComponent
      },
      {
        path: 'tipoCanalContacto',
        component: TipoContactoComponent
      },
      {
        path: 'lineaNegocio',
        component: LineaNegocioComponent
      },
      {
        path: 'canalSimulacion',
        component: CanalSimulacionComponent
      },
      {
        path: 'estadoCliente',
        component: EstadoClienteComponent
      },
      {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenedoresRoutingModule { }
