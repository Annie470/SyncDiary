import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Homepage } from './components/homepage/homepage';
import { Shell } from './components/shell/shell';
import { authGuard } from './shared/utils/auth.guard';

export const routes: Routes = [
  // ROTTE PUBBLICHE
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },


  // ROTTE PROTETTE 
  {
    path: '',
    component: Shell,       
    canActivate: [authGuard],
    children: [
      { path: 'homepage',  component: Homepage }
    ]
  }
];