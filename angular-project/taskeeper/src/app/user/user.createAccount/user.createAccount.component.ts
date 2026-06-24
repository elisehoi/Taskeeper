import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-user-createAccount',
  templateUrl: './user.createAccount.component.html',
  styleUrls: ['../../../styles.css']
})
export class UserCreateAccountComponent implements OnInit {

  public formError: string = '';

  public pageContent = {
    header: {
      title: 'Create account',
      strapline: ''
    },
    sidebar: ''
  };

  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private appComponent: AppComponent
  ) { }

  public credentials = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  ngOnInit() {
  }
  
  public onSignupSubmit(): void {
    this.formError = '';
    if (
      !this.credentials.firstName ||
      !this.credentials.lastName ||
      !this.credentials.userName ||
      !this.credentials.email ||
      !this.credentials.password ||
      !this.credentials.confirmPassword
    ) {
      this.formError = 'All fields are required for signing up';
    } else if (this.credentials.password !== this.credentials.confirmPassword) { 
      // Complain if passwords do not match
      this.formError = 'Passwords do not match. Please check if there is no typing errors';
    } else if (this.credentials.password.length<12 || /\d/.test(this.credentials.password) === false || /[a-zA-Z]/.test(this.credentials.password) === false) { 
      // Complain if password is too short or not safe enough
      this.formError = 'Password must at least contain both letters and digits, and be 12 characters long';
    } else {
      this.userAuthService.createAccount(this.credentials.firstName, this.credentials.lastName, this.credentials.userName, this.credentials.email, this.credentials.password)
        .then(() => this.router.navigateByUrl('/home'))
        .catch( (error) => { this.formError = error.message });
        //this.router.navigateByUrl('/home');
    }
  }

}
