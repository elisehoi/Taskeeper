import { Component, OnInit } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { UserService } from './user.service';
import { User } from './user';
import { TeamComponent } from '../teams/team.component';
import { ProjectComponent } from '../project/project.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

      //service and static list of all users
  
  allUsers: User[] = [];
 
  constructor(private service: UserService){
  }

  //GET ALL USERS
    getAllUsers(): void {
    this.service.getObservableAllUsers()
    .subscribe(users  => this.allUsers = users); //retreives the users stored in all users of the service
    }
  
// NG
ngOnInit(): void {

  //this.allUsers = UserService.AllUsers;
 this.getAllUsers(); // real fetch
}

}
