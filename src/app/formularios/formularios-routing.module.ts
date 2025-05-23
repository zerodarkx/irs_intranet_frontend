import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { ContactanosComponent } from './components/chile/contactanos/contactanos.component';
import { IngresoComponent } from './components/chile/ingreso/ingreso.component';

const routes: Routes = [
  {
    path: 'base',
    component: FormularioComponent,
    children: [
      {
        path: 'chile/:plataforma',
        component: IngresoComponent
      },
      {
        path: 'chile/:plataforma/contactanos',
        component: ContactanosComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'base',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulariosRoutingModule { }
