import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cliente',
    loadChildren: () => import('./clientes/clientes.module').then(m => m.ClientesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mantenedores',
    loadChildren: () => import('./mantenedores/mantenedores.module').then(m => m.MantenedoresModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'inversionista',
    loadChildren: () => import('./inversionista/inversionista.module').then(m => m.InversionistaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'salidas',
    loadChildren: () => import('./salidas/salidas.module').then(m => m.SalidasModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'formularios',
    loadChildren: () => import('./formularios/formularios.module').then(m => m.FormulariosModule),
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
