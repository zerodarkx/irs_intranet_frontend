import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChileComponent } from './components/chile/chile.component';
import { FormularioComponent } from './pages/formulario/formulario.component';

const routes: Routes = [
  {
    path: 'base',
    component: FormularioComponent,
    children: [
      {
        path: 'chile/:plataforma',
        component: ChileComponent
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
