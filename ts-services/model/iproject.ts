export interface IProject {
    name: string;
    description: string;
    projectID: string; 
    labelsList: string[];
    tasksList: string[]; //ID
    ownerUser: number;
    team?: number;
}
