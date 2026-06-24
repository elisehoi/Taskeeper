import { Task } from "../task/task";
import { Project } from "../project/project";
import { Team } from "../teams/team";

export interface IUser {
  firstName: string;
  lastName: string;
  userName: string;
  userID: number; 
  emailAdress: string;
  password: string;
  usedDevices: string[];
  loggedIn: boolean; // field to track the connection status of the user
  fullToDolist: Task[];
  projectsList: Project[];
  teams: Team[];
  }