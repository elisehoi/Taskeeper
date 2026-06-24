import { AppComponent } from '../app.component';
import { Injectable } from '@angular/core';
import { Task } from './task';
import { TaskService } from './task.service';
import { NgForm } from '@angular/forms';
import { Component,  OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Project } from '../project/project';
import { User } from '../user/user';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

@Injectable ({
  providedIn: 'root'
})

export class TaskComponent {

  @Input() task?: Task;
    // service and list of all tasks
  allTasks = AppComponent.allTasks;
  allUsers = AppComponent.allUsers;
  allTeams = AppComponent.allTeams;
  allGlobalProjects = AppComponent.allGlobalProjects;
  ID: Task | string = "-1"; 
  isTableVisible = true;

  assignedMembers = this.task?.assignedMembers;

  constructor(private service: TaskService, private cdr: ChangeDetectorRef, private router: Router, private location: Location){

  }

  displayTasks() {
    let taskGetList: HTMLElement = new HTMLElement;
    taskGetList.innerHTML = '<li>' + AppComponent.allTasks.join('</li><li>') + '</li>';
    this.cdr.detectChanges();
  }

  createTask(taskForm: NgForm) { // TEMPORARILY DEFINED AS THE FOLLOWING HERE TO MAKE THE TESTDATA WORKING
    const taskName = taskForm.value.taskName;
    const taskDescription = taskForm.value.taskDescription;
    const stringLabel = taskForm.value.taskLabels;
    const deadline =  new Date(taskForm.value.taskDeadline);
    const taskLabels = stringLabel.split(",");
    const isDone = taskForm.value.taskStatus === 'done';
    console.log(taskForm.value.project);
    const projectId = taskForm.value.project;
    const project: Project | undefined = AppComponent.allGlobalProjects.find((p) => p.projectID === projectId);
    const users: User[] = [];
    for (let user of  taskForm.value.selectedMembers){
      var member = AppComponent.allUsers.find((p) => p.userID === user);
      if (member!==undefined){ 
        users.push(member);}
    }
    console.log(users)
    this.task = TaskService.newTask(taskName, taskDescription, deadline, taskLabels,AppComponent.allUsers[0], project, users);
    console.log(this.task.assignedMembers) 
    this.task.isDone = isDone;
    // TO-DO: RETREIVE CURRENT USER AT LOGIN
    AppComponent.allTasks.push(this.task);

    // DATABASE ------------------------------------------------------------------------------- 
    var tL: String = '';
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
  }


  openEditingMode(task2edit: Task){
    this.ID = task2edit.taskID;
    this.task = task2edit;

    const table = document.getElementById("task-table-container");
    if (table!=null){
      table.classList.toggle("hide");}

      const form = document.getElementById("task-form");
      if (form!=null){
        form.classList.toggle("hide");}
    
      this.isTableVisible = false
    this.cdr.detectChanges();
  }
  // MODIFY TASK

  modifyTask(taskForm: NgForm) {
    
    const taskId = this.ID; // We save the id when entering editing mode
    const taskName = taskForm.value.taskName;
    const taskDescription = taskForm.value.taskDescription;
    const stringLabel = taskForm.value.taskLabels;
    const deadline =  new Date(taskForm.value.taskDeadline);
    const taskLabels =[""]
    if (stringLabel!= null){
    const taskLabels = stringLabel.split(",");
    }
     
  
    //if ( taskForm.value.taskStatus == )
    const isDone = taskForm.value.taskStatus === 'done';
    console.log(taskForm.value.project);
    const projectId = taskForm.value.project;
    const project: Project | undefined = AppComponent.allGlobalProjects.find((p) => p.projectID === projectId);
    const users: User[] = [];
    if (taskForm.value.selectedMembers !== undefined){
    for (let user of  taskForm.value.selectedMembers){
      var member = AppComponent.allUsers.find((p) => p.userID === user);
      if (member!==undefined){ 
        users.push(member);}
    } }
  
    const modifiedTaskIndex = AppComponent.allTasks.findIndex((task) => task.taskID === taskId);
    if (modifiedTaskIndex !== -1 && modifiedTaskIndex !== null) {
      const modifiedTask = AppComponent.allTasks[modifiedTaskIndex];
      modifiedTask.name = taskName;
      modifiedTask.description = taskDescription;
      modifiedTask.Deadline = deadline;
      modifiedTask.labelsList = taskLabels;
      modifiedTask.assignedMembers = users;
      modifiedTask.isDone = isDone;
      modifiedTask.project = project;
    }
    
    // Optionally, you can clear the form or perform any other necessary actions after modifying the task
    taskForm.resetForm();
   
    const table = document.getElementById("task-table-container");
    if (table!=null){
      table.classList.toggle("hide");}

      const form = document.getElementById("task-form");
      if (form!=null){
        form.classList.toggle("hide");}
    
      this.isTableVisible = true
    this.cdr.detectChanges();
  }

  public jsonFetchTasks(){
    for (let i = 0; i < localStorage.length; i++){ //get the tasks
      const key = localStorage.key(i);
      if (key !== null) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
          const taskObj = JSON.parse(value);
          const dateObject = new Date(taskObj.taskDate); //fetch the date as a date
          const labelsArray = taskObj.taskLabels.split(','); // store labels in an array

          const ownerUserID = parseInt(taskObj.taskOwnerUser);
          const taskownerUser = this.findUserById(ownerUserID);

          const taskID = taskObj.taskID;
          /* const assignedMembersStringArray = taskObj.taskAssignedUsers.split(',');
          var amArray = [];
          for (const id of assignedMembersStringArray){ // fetch the assigned users
            const ID = parseInt(id);
            const user = this.findUserById(ID);
            amArray.push(user);
          } NOT USED NOW BUT WILL BE USEFUL FOR THE PROJECT */

          const taskProject = this.findProjectById(taskObj.taskProject); // fetch the project
          
          if (taskownerUser !== undefined){
          var task = TaskService.newTask(taskObj.taskName, taskObj.taskDescription, dateObject, labelsArray, taskownerUser, taskProject);
          task.taskID = taskID;
          AppComponent.allTasks.push(task);}
        
        } catch (e) { // catch the error if there is one
          console.error(`Error parsing JSON for key ${key}: ${e}`);
          continue; 
        }
        }
      }
    }
      //LISTEN TO CHANGES
      this.cdr.detectChanges();
  }


  // TEMPORARILY DEFINED AS THE FOLLOWING HERE TO MAKE THE TESTDATA WORKING
  deleteTask(task: Task) {
    localStorage.removeItem(task.taskID);
    AppComponent.allTasks = AppComponent.allTasks.filter(t => t !== task);
    this.allTasks = AppComponent.allTasks;
    this.cdr.detectChanges();
  }
  
  

  // Find a user by their userID (to assign tasks to the right ones)
 findUserById(userId: number): User | undefined {
  for (let user of AppComponent.allUsers) {
    if (user.userID === userId) {
      return user;
    }
  }
  return undefined; // User not found
}

  // Find a project by ID 
  findProjectById(projectId: string): Project | undefined {
    for (let p of AppComponent.allGlobalProjects) {
      if (p.projectID === projectId) {
        return p;
      }
    }
    return undefined; // Project not found /!\ could possibly create an error when assigning it to the project
  }


  
    //GET ALL TASKS - subscribe
     getAllGloabalTasks(): void {
            this.service.getAllGlobalTasks()
            .subscribe(tasks => this.allTasks = tasks); //retreives the tasks stored in all tasks of the service
            this.cdr.detectChanges();
          }
    

  // HTML buttons:
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
    this.jsonFetchTasks();
    
  }
}
