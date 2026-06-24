import { Component } from '@angular/core';
import { Team } from './team';
import { TeamsService } from './team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {

    //service and static list of all teams
  
    allTeams: Team[] = [];
 
    constructor(private service: TeamsService){  
    }

     //GET ALL TEAMS - subscribe
     getAllTeams(): void {
      this.service.getAllObservableTeams()
      .subscribe(teams  => this.allTeams = teams); //retreives the users stored in all users of the service
      }


  // NG
  ngOnInit(): void {
    this.getAllTeams() //fetch data
  }
}
