import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Homepage } from './components/homepage/homepage';
import { NewDiary } from './components/new-diary/new-diary';
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
    path: 'homepage',
    component: Homepage,
    canActivate: [authGuard]
  },
  {
    path: 'new-diary',
    component: NewDiary,
    canActivate: [authGuard]
  }
];