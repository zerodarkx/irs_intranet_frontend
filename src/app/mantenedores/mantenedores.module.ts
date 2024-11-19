import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenedoresRoutingModule } from './mantenedores-routing.module';
import { SharedModule } from "../shared/shared.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { ReactiveFormsModule } from '@angular/forms';

import { BaseMantenedorComponent } from './pages/base-mantenedor/base-mantenedor.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { TipoContactoComponent } from './components/tipo-contacto/tipo-contacto.component';
import { EstadoClienteComponent } from './components/estado-cliente/estado-cliente.component';
import { TipoPropiedadComponent } from './components/tipo-propiedad/tipo-propiedad.component';
import { TipoDocumentosComponent } from './components/tipo-documentos/tipo-documentos.component';
import { TipoImagenesComponent } from './components/tipo-imagenes/tipo-imagenes.component';
import { LineaNegocioComponent } from './components/linea-negocio/linea-negocio.component';
import { CanalSimulacionComponent } from './components/canal-simulacion/canal-simulacion.component';
import { InicioMantendorComponent } from './components/inicio-mantendor/inicio-mantendor.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';

@NgModule({
  declarations: [
    BaseMantenedorComponent,
    UsuarioComponent,
    TipoContactoComponent,
    EstadoClienteComponent,
    TipoPropiedadComponent,
    TipoDocumentosComponent,
    TipoImagenesComponent,
    LineaNegocioComponent,
    CanalSimulacionComponent,
    InicioMantendorComponent,
    PerfilUsuarioComponent
  ],
  imports: [
    CommonModule,
    MantenedoresRoutingModule,
    SharedModule,
    NgSelectModule,
    TableModule,
    ReactiveFormsModule
  ]
})
export class MantenedoresModule { }
