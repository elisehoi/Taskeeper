import { IUser } from "./iuser";

export interface ITask {
    name: string;
    description: string;
    taskID: string;
    Deadline: Date;
    isDone: boolean;
    labelsList: string[];
    ownerUser: number; //ID
    assignedMembers?: number[];
    project?: string;
}
