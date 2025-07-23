import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AdminComponent } from './components/admin/admin.component';
import { InversorComponent } from './components/inversor/inversor.component';
import { InversionistaGuard } from '../guards/inversionista.guard';
import { InversionistaAdminGuard } from '../guards/inversionista-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    children: [
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [InversionistaGuard],
        data: { perfil: [1, 2, 10] }
      },
      {
        path: 'inversor',
        component: InversorComponent,
        canActivate: [InversionistaAdminGuard],
        data: { perfil: [1, 2, 10] }
      },
      {
        path: '**',
        redirectTo: 'inversor',
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
export class InversionistaRoutingModule { }
