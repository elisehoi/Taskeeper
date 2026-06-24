import { Project } from '../project/project';
import { IProject } from '../project/project.interfcace';
import { User } from '../user/user';
import { IUser } from '../user/user.interface';

export interface ITask {
  name: string;
  description: string;
  taskID: string; // changed to string for robustness
  Deadline: Date;
  isDone: boolean;
  labelsList: string[];
  project?: Project;
  ownerUser: User; //set it to the project's owner user
}