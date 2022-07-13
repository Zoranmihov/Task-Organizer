import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
//Guards
import { LoginGuard } from './guards/login.guard';
import { ReverseLoginGuard } from './guards/reverse-login.guard';
import { VerifiedGuard } from './guards/verified.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [ReverseLoginGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ReverseLoginGuard],
  },
  {
    path: 'verify',
    component: VerifyComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [LoginGuard, VerifiedGuard],
  },
  {
    path: 'project/:id',
    component: ProjectComponent,
    canActivate: [LoginGuard,VerifiedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
