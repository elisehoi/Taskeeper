import { IProject } from "./project.interfcace";
import { Task } from "../task/task";
import { User } from "../user/user";
import { Team } from "../teams/team";

export class Project implements IProject {
    name: string;
    description: string;
    projectID: string; //user ID on 5 characters + projectID relative to the user's ID on 4 charcters (if we admit that a user may not have more than 9999 projects)
    subID: string; //
    labelsList: string[];
    tasksList: Task[];
    ownerUser: User;
    team?: Team;
  
    constructor(name: string, description: string, labels: string[], ownerUser: User, team?: Team) { //team is optional as the user may create a project for themselves
        this.name = name;
        this.description = description;
        this.labelsList = labels;
        this.tasksList = []; //empty to push tasks in later
        this.ownerUser = ownerUser;

        //ID
        if (this.ownerUser.projectsList.length===0){
          this.subID = (1).toString().padStart(4, '0'); //initializes the subID with 0s until its length is 4
          } else {
          var intID: number = parseInt(this.ownerUser.projectsList[this.ownerUser.projectsList.length-1].subID+1); 
          // ID of the previous item +1
          // not the length because it might cause duplicate IDs since the list is dynamic and items might be removed
          this.subID = (intID).toString().padStart(4, '0'); //initializes the subID with 0s until its length is 4
          }
          this.projectID = this.ownerUser.userID.toString().padStart(5, '0')+this.subID; //user ID on 5 digits + the subID


        if (typeof team === 'undefined') {
          this.team = undefined;
          ownerUser.projectsList.push(this);
        } else {  // checks whether the porject user is inside the team already or not
          this.team = team;
          this.team.projects.push(this);
          var isPartOfTeam: Boolean = false;
          if (team.ownerUser === this.ownerUser ){
            isPartOfTeam = true;
          }
          for (let i = 0; i < this.team.teamMembers.length; i++) {
            if (this.team.teamMembers[i] === this.ownerUser) {
              isPartOfTeam = true;
            }
          }
          if (!isPartOfTeam){
            throw new Error ("You cannot assign a project to a team you are not part of!")
          }
          this.team.ownerUser.projectsList.push(this);
          for (let user of this.team.teamMembers){
            user.projectsList.push(this);
          }
        }
    }
    
}