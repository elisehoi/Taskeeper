import { ITeam } from "./team.interface";
import { User } from "../user/user";

import { Injectable } from "@angular/core";
import { Project } from "../project/project";

export class Team implements ITeam {
 
    name: string;
    description: string;
    teamID: number; //to avoid confusion with userIDs we will define teamIDs in the negative
    labels: string[];
    ownerUser: User;
    teamMembers: User[]; // NOTE: THE TEAM MEMBERS SHOULD INCLUDE THE OWNERUSER, AT LEAST FOR NOW
    projects: Project[];
  
    constructor(name: string, description: string, labels: string[], ownerUser: User, teamMembers: User[]) {
      this.name = name;
      this.description = description;
      this.teamID = 0; //defined later in the team service newTeam method
      this.labels = []; //TODO
      this.ownerUser = ownerUser;
      this.teamMembers = [];
      this.projects = []; // projects get automatically pushed into it
    }

    
  //GETTER METHODS
  getName() : string {return this.name;}
  getDescription() : string {return this.description;}
  getOwner() : User {return this.ownerUser;}
  getTeamMembers() : User[] {return this.teamMembers;}
  getLabels() : string {
    let labels = "";
    for (let i = 0; i < this.labels.length; i++) {
      labels += this.labels[i];
      if (i !== this.labels.length - 1) {
        labels += ", ";
      } 
    } 
    return labels;
  }

  // SETTERS METHODS
  setName(name : string) {this.name = name;}
  setDescription(description : string) {this.description = description;}
  setOwner(ownerUser : User) {this.ownerUser = ownerUser;}
  setTeamMembers(teamMembers : User[]) {
    for (let i = 0; i < teamMembers.length; i++) {
      this.teamMembers.push(teamMembers[i]);
    }
  }
  setLabels(labels : string[]) {
    for (let i = 0; i < labels.length; i++) {
      this.labels.push(labels[i]);
    }
  }
}