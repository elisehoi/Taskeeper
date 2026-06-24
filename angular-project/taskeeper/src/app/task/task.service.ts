import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Task } from './task';
import { Project } from '../project/project';
import { IUser } from '../user/user.interface';
import { User } from '../user/user';

@Injectable({
providedIn: 'root'
})

//NOTE: IN THESE SERVICE CLASSES EVERYTHING IS STATIC BECAUSE IT WOULDN'T NECESSARY MAKE SENSE TO INSTANCIATE SERVICES
// (as we do not have several servers...)

export class TaskService {
  public static allGlobalTasks: Task[] = []; 

  constructor() {
   }

   // Observable:   
  getAllGlobalTasks(): Observable <Task[]>{

    var allTasksObservable = of(TaskService.allGlobalTasks);
    return allTasksObservable;
  }


  //TASK CREATION

  public static newTask(name: string, description: string, finishDate: Date, labelsList: string[], ownerUser: User, project?: Project, assignedMembers?: User[]) {
    var task = new Task(name, description, finishDate, labelsList, ownerUser, project, assignedMembers);
    TaskService.allGlobalTasks.push(task);
    return task;
  }

  //FINISH TASK
  
  public static finishTask(achievedTask: Task) {
    //its useless to delete a finished task here we simply want to change its done status
    achievedTask.isDone = true;
    TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === achievedTask.taskID ? achievedTask : t); //updates the list in the storage
  }

  public static redoTask(task: Task){
    task.isDone = false;
    TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === task.taskID ? task : t); //updates the list in the storage
  }

  // DELETE TASK (COMPLETELY)
  public static deleteTask(task2delete: Task){
    if (task2delete.assignedMembers!== undefined){  ////// - {
      var index = 0
      for (let user of task2delete.assignedMembers){
        index = user.fullToDolist.indexOf(task2delete);
        if (index !== -1) {
          user.fullToDolist.splice(index, 1); 
        }                                         //      Deletes the tasks from the assigned users' to do lists
      } 
    } else {
        const index = task2delete.ownerUser.fullToDolist.indexOf(task2delete);
        if (index !== -1) {
          task2delete.ownerUser.fullToDolist.splice(index, 1); 
        }
    }                      /////// - }

    if (task2delete.project!==undefined){ // Removes the task from the project it is in
      const index = task2delete.project.tasksList.indexOf(task2delete); 
      if (index !== -1) {
        task2delete.project.tasksList.splice(index, 1); 
      }
    }

    TaskService.allGlobalTasks = TaskService.allGlobalTasks.filter((task) => task.taskID !== task2delete.taskID); //updates the list in the storage

  }
    

  //ADD NEW ASSIGNED MEMBERS TO THE TASK
  // ??? should we add a condition that checks wether the new users are part of the project here? because it wouldn't make sense assigning tasks to just anyone
  // also we need to define some sort of invite system in the user component because if anyone can add anyone to their projects it would be dangerous
  public static addNewAssignedMembers(task : Task, newAssignedMembers : User[]) {
    
      if (task.assignedMembers===undefined){ // if there is no assigned members other than the owner user who is automatically assigned to the task
        task.assignedMembers = newAssignedMembers; //simply set them to the provided users
      } else {
        for (let member of newAssignedMembers) { //if there already are some add the new ones
        task.assignedMembers.push(member);
        }
      }
      TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === task.taskID ? task : t); //updates the list in the storage

  }

  //REMOVE ASSIGNED MEMBER(S) FROM THE TASK
  public static removeAssignedMember(task: Task, assignedMemberToRemove: User) {
    // Message to Aurélien: 1-here the assigned members may be undefined so we need to check that first and throw an error if needed
    if (task.assignedMembers===undefined){
      throw new Error ("There are no assigned members to remove in this task!") 
    } else if (task.project===undefined || task.project.team ===undefined) {
      // if the task is local on the user's account (in which case they shouldd just delete it), or they are alone in the project, throw an error
      throw new Error ("You are the only user assigned to this task! If you don't want to finish it please delete it instead!") 
    } else {
      const index = task.assignedMembers.indexOf(assignedMemberToRemove); // 2 - FROM HERE
      if (index !== -1) {
        task.assignedMembers.splice(index, 1); // 2 - TO HERE: we take away the user to remove from the assigned users
      }
      const index2 = assignedMemberToRemove.fullToDolist.indexOf(task); // 3 !!!!! important !!!!! take the task away from the full to-do list of the user too
      if (index2 !== -1) {
        assignedMemberToRemove.fullToDolist.splice(index2, 1); // 3
      }
    }
    TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === task.taskID ? task : t); //updates the list in the storage

  }
  
  public static removeSeveralAssignedMembers(task: Task, assignedMembersToRemove : User[]) {
      
    for (let member of assignedMembersToRemove) {
        TaskService.removeAssignedMember(task, member);
      }
      TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === task.taskID ? task : t); //updates the list in the storage

  }

  //ADD LABELS TO TASK
  public static addLabels(task: Task, newLabels: string[]){
    for (let i of newLabels){
      task.labelsList.push(i);
    }
    TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === task.taskID ? task : t); //updates the list in the storage

  }

  // CHANGE THE DETAILS OF A TASK (ALL PARAMETERS ARE OPTIONAL, I THOUGHT IT WOULD MAKE MORE SENSE TO HAVE IT ALL LIKE THIS IN ONE METHOD)
  public static changeTaskDetails(taskToChange: Task, newName?: string, newDescription?: string, newDeadline?: Date, changedisDone?: boolean, newLabelsList?: string[], newProject?: Project){
    if (newName!==undefined){
      taskToChange.name=newName;
    }
    if (newDescription!==undefined){
      taskToChange.description=newDescription;
    }
    if (newDeadline!==undefined){
      taskToChange.Deadline=newDeadline;
    }
    if (changedisDone!==undefined){
      taskToChange.isDone=changedisDone;
    }
    if (newLabelsList!==undefined){
      taskToChange.labelsList=newLabelsList;
    }
    if (newProject!==undefined){
      if (taskToChange.project!==undefined){
        
      }
      taskToChange.project = newProject;

      //TO DO: remove it from the prev project and from the full toDo lists of all the users in there
    }
    TaskService.allGlobalTasks = TaskService.allGlobalTasks.map(t => t.taskID === taskToChange.taskID ? taskToChange : t); //updates the list in the storage

  }


}
