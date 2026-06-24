
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserCreateAccountComponent } from './user/user.createAccount/user.createAccount.component';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user/user.Login/user.logIn.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // start at login page
  { path: 'create-account', component: UserCreateAccountComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TaskComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
