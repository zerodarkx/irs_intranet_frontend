import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { ContactanosChileComponent } from './components/chile/contactanos-chile/contactanos-chile.component';
import { IngresoChileComponent } from './components/chile/ingreso-chile/ingreso-chile.component';

const routes: Routes = [
  {
    path: 'base',
    component: FormularioComponent,
    children: [
      {
        path: 'chile/:plataforma',
        component: IngresoChileComponent
      },
      {
        path: 'chile/:plataforma/contactanos',
        component: ContactanosChileComponent
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
