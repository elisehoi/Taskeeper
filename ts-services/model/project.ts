import { IProject } from "./iproject";

export class Project implements IProject {

    name: string;
    description: string;
    projectID: string; 
    labelsList: string[];
    tasksList: string[]; //ID
    ownerUser: number;
    team?: number;

    constructor() {
        this.name = "";
        this.description = "";
        this.projectID = "";
        this.labelsList = [];
        this.tasksList = [];
        this.ownerUser = -1;
    }

}
