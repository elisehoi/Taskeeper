import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { TeamComponent } from './teams/team.component';
import { HomeComponent } from './home/home.component';
import { UserCreateAccountComponent } from './user/user.createAccount/user.createAccount.component';
import { UserLoginComponent } from './user/user.Login/user.logIn.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TaskComponent,
    ProjectComponent,
    UserComponent,
    UserCreateAccountComponent,
    UserLoginComponent,
    TeamComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
