import { Injectable } from '@angular/core';
import { Project } from './project';
import { User } from '../user/user';
import { Team } from '../teams/team';
import { Task } from '../task/task';
import { Observable, of } from 'rxjs';

//NOTE: IN THESE SERVICE CLASSES EVERYTHING IS STATIC BECAUSE IT WOULDN'T NECESSARY MAKE SENSE TO INSTANCIATE SERVICES
// (as we do not have several servers...)

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public static allGlobalProjects: Project[] = [];

  constructor() { }

  // OBSERVABLE

  getAllGlobalProjects(): Observable <Project[]>{ 

    var allProjectsObservable = of(ProjectService.allGlobalProjects);
    return allProjectsObservable;
  }

  // MAIN FACTORY METHOD

  public static newProject(name: string, description: string, labels: string[], ownerUser: User, team?: Team){
      var project = new Project(name, description, labels, ownerUser, team);
      ProjectService.allGlobalProjects.push(project); // PUSHES INTO THE LIST OF ALL PROJECTS
      return project; 
  }

  //ADD AN EXISTING TASK TO THE PROJECT
  public static addTask(project: Project, task: Task){
    project.tasksList.push(task); 
    //TODO: add a part to push the tasks onto the full to-do list of other users in the project if they do not already have it
    ProjectService.allGlobalProjects = ProjectService.allGlobalProjects.map(p => p.projectID === project.projectID ? project : p); //updates the list in the storage
  }
  
  //CREATE A TASK TO ADD TO THE PROJECT 
  public static addNewTask(project: Project, name: string, description: string, assignedMembers: User[], finishDate: Date, labelsList: string[], ownerUser: User){ 
    //These parameters are required for the creation of a task

    var task = new Task(name, description, finishDate, labelsList, ownerUser, project);
      project.tasksList.push(task);
    if (project.team?.teamMembers != undefined){
      project.team.ownerUser.fullToDolist.push(task);
      for (let user of project.team?.teamMembers){
        for (let task of project.tasksList){
          user.fullToDolist.push(task);
        }
      }}else{
        project.ownerUser.fullToDolist.push(task);
      }

      ProjectService.allGlobalProjects = ProjectService.allGlobalProjects.map(p => p.projectID === project.projectID ? project : p); //updates the list in the storage
  } //TODO: use new task method here

  //REMOVE A TASK FROM A PROJECT:
  public static removeTaskFromProject(project: Project, task: Task){
    if (!project.tasksList.includes(task)){
      throw new Error ("You can't remove this task from the project since it is not part of it!")
    }
    const index = project.tasksList.indexOf(task); 
    if (index !== -1) {                                     /// TAKES AWAY THE TASK FROM THE PROJECT
      project.tasksList.splice(index, 1);
    }


    if (task.assignedMembers!==undefined){
    var notOwnerUsers: User[] = task.assignedMembers;
    const index = notOwnerUsers.indexOf(task.ownerUser);                 // AND HENCE ALSO TAKES IT AWAY FROM THE TO FO LIST OF THE USERS IN THE PROJECT
    if (index !== -1) {                                                  // EXCEPT FOR THE USER WHO CREATED IT
      notOwnerUsers.splice(index, 1);
    }
    var i2 =0;
    for (let user of notOwnerUsers){
      i2 = user.fullToDolist.indexOf(task);
      user.fullToDolist.splice(index, 1);
    }
    }
    ProjectService.allGlobalProjects = ProjectService.allGlobalProjects.map(p => p.projectID === project.projectID ? project : p); //updates the list in the storage
  }

  //DELETE A TASK COMPLETELY, THROUGH THE PROJECT
  public static deleteProjectTask(project: Project, task: Task){
    const index = project.tasksList.indexOf(task); 
    //TODO: maybe add a part to check wether the task is part of the project here
    if (index !== -1) {
      project.tasksList.splice(index, 1);
    }
    var index2 = 0; 
    index2 = project.ownerUser.fullToDolist.indexOf(task);
    if (index2 !== -1) {
      project.ownerUser.fullToDolist.splice(index2, 1);
    }
    if (project.team !== undefined){
    for (let user of project.team?.teamMembers){
      index2 = user.fullToDolist.indexOf(task);
      user.fullToDolist.splice(index2, 1);
    }
    }
    ProjectService.allGlobalProjects = ProjectService.allGlobalProjects.map(p => p.projectID === project.projectID ? project : p); //updates the list in the storage
  }

  // DELETE THE ENTIRE PROJECT

  public static deleteProject(projectToDelete: Project){ //we can admit that deleting a project meansdeleting all the tasks within it too 
    
    for (let task of projectToDelete.tasksList){
      projectToDelete.ownerUser.fullToDolist = projectToDelete.ownerUser.fullToDolist.filter((t) => t.taskID !== task.taskID);
    //deletes all the tasks of the project from the fulltodolist of the owner user
    }
    projectToDelete.ownerUser.projectsList = projectToDelete.ownerUser.projectsList.filter((project) => project.projectID !== projectToDelete.projectID);
    //takes away the project from the owner user's project list

    if (projectToDelete.team !== undefined){
    for (let user of projectToDelete.team?.teamMembers){
      for (let task of projectToDelete.tasksList){
        user.fullToDolist = user.fullToDolist.filter((t) => t.taskID !== task.taskID);
      //deletes all the tasks of the project from the fulltodolist of the team user
      }
      user.projectsList = user.projectsList.filter((project) => project.projectID !== projectToDelete.projectID);
    }
    projectToDelete.team.projects.filter((project) => project.projectID !== projectToDelete.projectID);
    }
    //takes away the project from the team members' project lists

    ProjectService.allGlobalProjects = ProjectService.allGlobalProjects.filter((project) => project.projectID !== projectToDelete.projectID); //removes the project from the list in the storage
  }
  

}
