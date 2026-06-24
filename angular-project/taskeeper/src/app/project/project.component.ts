import { Component, Input } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { User } from '../user/user';
import { UserComponent } from '../user/user.component';
import { TeamComponent } from '../teams/team.component';
import { Project } from './project';
import { ProjectService } from './project.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgForm } from '@angular/forms';
import { Task } from '../task/task';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent {

  @Input() project?: Project;
  // list of all projects
  allTasks = AppComponent.allTasks;
  allUsers = AppComponent.allUsers;
  allTeams = AppComponent.allTeams;
  allGlobalProjects: Project[] = [];
  ID: Project | string = "-1"; 
  isTableVisible = true;
  
constructor(private service: ProjectService, private cdr: ChangeDetectorRef, private router: Router, private location: Location){ // (Same as field + this.service = service;)
}

  //GET ALL PROJECTS - subscribe
  getAllGlobalProjects(): void {
    this.service.getAllGlobalProjects()
    .subscribe(projects  => this.allGlobalProjects = projects); //retreives the teams stored in all teams of the service
  }

  createProject(projectForm: NgForm) { // TEMPORARILY DEFINED AS THE FOLLOWING HERE TO MAKE THE TESTDATA WORKING
    const projectName = projectForm.value.projectName;
    const projectDescription = projectForm.value.projectDescription;
    const stringLabel = projectForm.value.projectLabels;
    const projectLabels = stringLabel.split(",");
    const projectOwner = projectForm.value.projectOwner;
    console.log(projectForm.value.project);
    const projectId = projectForm.value.project;
    const project: Project | undefined = AppComponent.allGlobalProjects.find((p) => p.projectID === projectId);
    const projectTeam = projectForm.value.projectTeam;
    this.project = ProjectService.newProject(projectName, projectDescription, projectLabels, projectOwner, projectTeam);
    // TO-DO: RETREIVE CURRENT USER AT LOGIN
    AppComponent.allGlobalProjects.push(this.project);

    // DATABASE ------------------------------------------------------------------------------- 
    // TODO
    
    /*var tL: String = '';
    for (let l of this.task.labelsList){
      tL= tL+l+",";
    }
    var tAU: String = '';
    if (this.task.assignedMembers!==undefined){
    for (let u of this.task.assignedMembers){
      tAU= tAU+u.userID.toString()+",";
    } }
    const taskObj = { // save task as string for the database 
      taskName: this.task.name,
      taskDescription: this.task.description,
      taskID: this.task.taskID,
      taskSubID: this.task.subID,
      taskDate: this.task.Deadline.toISOString(),
      taskStatus: this.task.isDone.toString(),
      taskLabels: tL,
      taskOwnerUser: this.task.ownerUser.userID.toString(),
      taskAssignedUsers: tAU,
      taskProject: this.task.project?.projectID.toString()
    }
    const taskjson = JSON.stringify(taskObj); // stringify json 
    localStorage.setItem(this.task.taskID, taskjson); // TO-DO: DEFINE METHOD TO REGENERATE OBJECT FROM THE SAVED JSON FILE
   
    //LISTEN TO CHANGES
    this.cdr.detectChanges();
    */
  }

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
  }
}