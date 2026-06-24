import { ITask } from "./itask";
import { IUser } from "./iuser";

export class Task implements ITask {

    name: string;
    description: string;
    taskID: string;
    Deadline: Date;
    isDone: boolean;
    labelsList: string[];
    ownerUser: number; //ID
    assignedMembers?: number[];
    project?: string;

    constructor() {
        this.name = "";
        this.description = "";
        this.taskID = "";
        this.Deadline = new Date;
        this.isDone = false;
        this.labelsList = [];
        this.ownerUser = -1;
    }

}
