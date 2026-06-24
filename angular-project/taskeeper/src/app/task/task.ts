import { ITask } from "./task.interface";
import { Project } from "../project/project";
import { User } from "../user/user";

export class Task implements ITask {
    
  name: string;
  description: string;
  taskID: string; //changed to string: project ID on 11 digits + task subID on 5 digits
  subID: string;
  Deadline: Date;
  isDone: boolean;
  labelsList: string[];
  ownerUser: User;
  assignedMembers?: User[];
  project?: Project;

    constructor(name: string, description: string, Deadline: Date, labelsList: string[],  ownerUser: User, project?: Project, assignedMembers?: User[]) {
        this.name = name;
        this.description = description;
        this.Deadline = Deadline; //Deadline (basically the day on which it appears on the calendar)
        this.isDone = false; //DefaultValue
        this.labelsList = labelsList;
        this.ownerUser = ownerUser;
        this.assignedMembers = assignedMembers;
        if (project!==undefined){
            this.project = project;

            // ID ---------------
            const IDprefix: string = this.project.projectID; // the prefix is the id of the project

            var intIDsuffix: number;
            if (this.project.tasksList.length === 0){
            intIDsuffix = 1;
            } else {
            intIDsuffix = (parseInt(this.project.tasksList[this.project.tasksList.length-1].subID)+1); //id of previous task +1
            }
            this.subID = intIDsuffix.toString().padStart(5, '0'); //user ID on 5 digits + 4 zeros for the project + the subID
            this.taskID = IDprefix+this.subID; //we set the id of the project to the one of the project + the number of its tasks
            //------------------------

            this.project.tasksList.push(this);
            if (project.team!==undefined){
                    for (let i = 0; i < project.team.teamMembers.length; i++) {
                        project.team.teamMembers[i].fullToDolist.push(this); //pushes the task onto every member's to-do list 
                    }
                    /*this.assignedMembers=project.team.teamMembers;
                    this.assignedMembers.push(project.ownerUser);*/
                }
            
         

        } else { //if the task is not part of a project but just of the user's full to do list

          // ID ------------
            const IDprefix: string = this.ownerUser.userID.toString().padStart(5, '0')+"0000"; //user ID on 5 digits + 4 zeros for the project 
            var intIDsuffix: number;
            if (this.ownerUser.fullToDolist.length === 0){
            intIDsuffix = 1;
            } else {
            intIDsuffix = (parseInt(this.ownerUser.fullToDolist[this.ownerUser.fullToDolist.length-1].subID)+1); //id of previous task +1
            }
            this.subID = intIDsuffix.toString().padStart(5, '0'); //user ID on 5 digits + 4 zeros for the project + the number of tasks in the project
            this.taskID = IDprefix+this.subID; 
        }

        this.ownerUser.fullToDolist.push(this);
    }
    
  //GETTERS METHODS
  getName() : string {return this.name;}
  getDescription() : string {return this.description;}
  getTaskID() : string {return this.taskID;}
  getDeadline() : Date {return this.Deadline;}
  getDone() : boolean {return this.isDone;}
  getOwner() : User {return this.ownerUser;}
  
  getAssignedMembers() {
    if (this.assignedMembers!=undefined){return this.assignedMembers;} 
    else {return null;}
  }

  getLabelsList() : string { //GETTER AS STRING
    let labelsList = "";
    for (let i = 0; i < this.labelsList.length; i++) {
      labelsList += this.labelsList[i];
      if (i !== this.labelsList.length - 1) {
        labelsList += ", ";
      } 
    } 
    return labelsList;
  }

  //SETTERS METHODS
  setName(name : string) {this.name = name;}
  setDescription(description : string) {this.description = description;}
  setDeadline(Deadline : Date) {this.Deadline = Deadline;}
  setDone(isDone : boolean) {this.isDone = isDone;}
  setOwner(ownerUser : User) {this.ownerUser = ownerUser;}
  setAssignedMember(assignedMembers : User[]) {this.assignedMembers = assignedMembers;}
  setLabelsList(labelsList : string[]) {this.labelsList = labelsList;}
}