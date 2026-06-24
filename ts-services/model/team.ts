import { ITeam } from "./iteam"

export class Team implements ITeam {

    name: string
    description: string
    labels: string[] 
    ownerUser: number //ID
    teamMembers: number[] 
    
    constructor() {
        this.name = "";
        this.description = "";
        this.labels = [];
        this.ownerUser = -1;
        this.teamMembers = [];
    }

}
