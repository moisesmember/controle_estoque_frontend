import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './pages/login/loggedIn.guard';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'dashboard', 
    canLoad: [LoggedInGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'dashboard2', 
    canLoad: [LoggedInGuard],
    loadChildren: () => import('./pages/dashboard2/dashboard2.module').then(m => m.Dashboard2Module)
  },
  {
    path: 'entrada', 
    canLoad: [LoggedInGuard],
    loadChildren: () => import('./pages/entrada/entrada.module').then(m => m.EntradaModule)
  },
  {
    path: 'saida', 
    canLoad: [LoggedInGuard],
    loadChildren: () => import('./pages/saida/saida.module').then(m => m.SaidaModule)
  },
  {
    path: 'percentual-critico', 
    canLoad: [LoggedInGuard],
    loadChildren: () => import('./pages/percentual-critico/percentual-critico.module').then(m => m.PercentualCriticoModule)
  },
  {
    path: 'consulta', 
    canLoad: [LoggedInGuard],
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./pages/consulta/consulta.module').then(m => m.ConsultaModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
