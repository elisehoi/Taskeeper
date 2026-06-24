import { Injectable } from '@angular/core';
import { Team } from './team';
import { ITask } from '../task/task.interface';
import { User } from '../user/user';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


//NOTE: IN THESE SERVICE CLASSES EVERYTHING IS STATIC BECAUSE IT WOULDN'T NECESSARY MAKE SENSE TO INSTANCIATE SERVICES
// (as we do not have several servers...)

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  public static allTeams: Team[]; // list of all teams updated automatically

  constructor() { 
    TeamsService.allTeams = []; // set to empty as base
  }

  // OBSERVABLE
  getAllObservableTeams(): Observable <Team[]>{

    var allTeamsObservable = of(TeamsService.allTeams);
    return allTeamsObservable;
  }

  //TEAM CREATION

  public static newTeam(name: string, description: string, labels: string[], ownerUser: User, teamMembers: User[]) {

    for (let team of ownerUser.teams) {
      if (team.name == name){
        throw new Error(" You already have a team with this name. Please provide another one.")
      }
    }
    var team = new Team(name, description, labels, ownerUser, teamMembers);

    // ID
    if (TeamsService.allTeams.length===0){
      team.teamID = -1;
      } else {
      team.teamID = TeamsService.allTeams[TeamsService.allTeams.length-1].teamID-1; // ID of the previous item -1, here we define ids in the negatives to avoid confusion with other types of IDs
      // not the length because it might cause duplicate IDs since the list is dynamic and items might be removed
      }

    TeamsService.allTeams.push(team); // PUSHES INTO THE LIST OF ALL TEAMS
    return team;
    
    //NOTE: MAYBE PUT THE TEAM CREATION IN USER (to use this.newTeam with this as the ownerUser)?
  }
  
  //TEAM DELETION

  public static removeTeam(teamToRemove: Team) {
    for (let project of teamToRemove.projects) {
      project.team = undefined;
    }
    teamToRemove.ownerUser.teams = teamToRemove.ownerUser.teams.filter((team) => team.teamID !== teamToRemove.teamID); //ID but if it doesn't work replace it by name
    for (let user of teamToRemove.teamMembers) {
      user.teams = user.teams.filter((team) => team.teamID !== teamToRemove.teamID); 
    }
    //Takes away the team given as argument from the teams of the users it contained. 
    TeamsService.allTeams = TeamsService.allTeams.filter((team) => team.teamID !== teamToRemove.teamID);
    //removes the team from the list of all teams

  }
  
  //JOIN A TEAM

  public static joinTeam(newMember: User, team2join: Team) {
    team2join.teamMembers.push(newMember);
    newMember.teams.push(team2join);

    TeamsService.allTeams = TeamsService.allTeams.map(team => team.teamID === team2join.teamID ? team2join : team); //updates the list in the storage

  } 
  
  //LEAVE A TEAM

  public static leaveTeam(member: User, team2leave: Team) { //Todo: make sure it is only the current user who can leave the team in a way that anyone cannot remove random other members
    if (member == team2leave.ownerUser){
      throw new Error("The owner of the team cannot quit the team! Please transfer ownership or delete the team instead.")
    }
    member.teams = member.teams.filter((team) => team.name !== Team.name); //removes the team from the member's teamlist
    const index = team2leave.teamMembers.indexOf(member);
    if (index !== -1) { 
      team2leave.teamMembers.splice(index, 1); //takes the member away from the members list of the team
    }

    TeamsService.allTeams = TeamsService.allTeams.map(team => team.teamID === team2leave.teamID ? team2leave : team); //updates the list in the storage
  }

  //TRANSFER OWNERSHIP
  public static transferOwnership(team: Team, newOwner : User) {
    var currentOwner: User = team.ownerUser;
    team.setOwner(newOwner);
    team.teamMembers.push(currentOwner);

    TeamsService.allTeams = TeamsService.allTeams.map(t => t.teamID === team.teamID ? team : t); //updates the list in the storage
  }

  //ADD A MEMBER
  public static addMember2Team(team: Team, newMember : User) {
    team.teamMembers.push(newMember);
    newMember.teams.push(team);
    TeamsService.allTeams = TeamsService.allTeams.map(t => t.teamID === team.teamID ? team : t); //updates the list in the storage
  } 
  
  //REMOVE A MEMBER - (FROM THE OWNER'S PERSPECTIVE?)
  removeMemberFromTeam(team: Team, member : User){
    //TO-DO
  }
}
