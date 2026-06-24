import { ChangeDetectorRef, Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles.css']
})
export class HomeComponent {

  allUsers = AppComponent.allUsers;
  allTeams = AppComponent.allTeams;
  allGlobalProjects = AppComponent.allGlobalProjects;
  allTasks = AppComponent.allTasks;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private taskcomp: TaskComponent){
    this.allTasks = taskcomp.allTasks;
  }

  //GET ALL TASKS - subscribe
  getAllGloabalTasks(): void {
    //this.taskcomp.jsonFetchTasks();
    //.subscribe(taskcomp => this.allTasks = tasks); //retreives the tasks stored in all tasks of the service
    

}
  
  /* HTML FUNCTIONALITY BUTTONS ------------------------------------ */ 

  toggleUserbar() {
    const userbar = document.getElementById("userbar");
    if (userbar!=null){
    userbar.classList.toggle("hide");}
    this.cdr.detectChanges();
  } 
  
  toggleProjectbar() {
    const projectbar = document.getElementById("projectbar");
    if (projectbar!=null){
    projectbar.classList.toggle("hide");}
    this.cdr.detectChanges();
  }

  logOut(){
    // to do: change the login status of the current user
    this.cdr.detectChanges();
    this.router.navigateByUrl('/home');
  }

  ngOnInit(): void {
    this.taskcomp.jsonFetchTasks();
    this.cdr.detectChanges();
  }
}
