import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user.logIn.component.html',
  styleUrls: ['../../../styles.css']
})
export class UserLoginComponent implements OnInit {

  public formError: string = '';

  public pageContent = {
    header: {
      title: 'User Login',
      strapline: ''
    },
    sidebar: ''
  };

  constructor(
    private router: Router,
    private userAuthService: UserAuthService
  ) { }

  public credentials = {
    userName: '',
    password: ''
  };

  ngOnInit() {
  }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.userName || !this.credentials.password) {
      this.formError = 'Please fill out the username and password fields';
    } else {
      this.userAuthService.login(this.credentials.userName, this.credentials.password)
        .then( () => this.router.navigateByUrl('/home'))
        .catch( (error) => { this.formError = error.message });
    }
  }

}
