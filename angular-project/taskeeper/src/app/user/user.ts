import { IUser } from "./user.interface";
import { Task } from "../task/task";
import { Project } from "../project/project";
import { Team } from "../teams/team";

export class User implements IUser {
     
  firstName: string;
  lastName: string;
  userName: string;
  userID: number;
  emailAdress: string;
  password: string;
  usedDevices: string[];
  loggedIn: boolean;
  fullToDolist: Task[];
  projectsList: Project[];
  teams: Team[];

  constructor(firstName: string, lastName: string, userName: string, emailAdress: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.userID = 0; // defined through the newUser method of the User service
    this.emailAdress = emailAdress;
    this.password = password;
    this.usedDevices = []; // TODO: test

    this.loggedIn = true; // true as default because the user is logged in when creating an account --> changes through logOut method of userService

    this.fullToDolist = []; // starts as empty -> tasks get pushed onto it
    this.projectsList = []; // same here for projects
    this.teams = []; //same
    }

  
// GETTER METHODS

getName() : string {return this.firstName+" "+this.lastName;}
getuserName() : string {return this.userName;}
getuserID() : number {return this.userID;}
getemailAdress() : string {return this.emailAdress;}
getpassword() : string {return this.password;} // WILL BE CHANGED LATER TO SOMETHING MORE ENCRYPTED FOR SECURITY
getusedDevices() : string {
  let usedDevices = "";
  for (let i = 0; i < this.usedDevices.length; i++) {
    usedDevices += this.usedDevices[i];
    if (i !== this.usedDevices.length - 1) {
      usedDevices += ", ";
    } } return usedDevices;}
getfullToDolist() : string {
  let tasks = "";
  for (let i = 0; i < this.fullToDolist.length; i++) {
    tasks += this.fullToDolist[i].name;
    if (i !== this.fullToDolist.length - 1) {
      tasks += ", ";
    } } return tasks;}
getprojectslist() : string {
  let projects = "";
  for (let i = 0; i < this.projectsList.length; i++) {
    projects += this.projectsList[i].name;
    if (i !== this.projectsList.length - 1) {
      projects += ", ";
    }
}
  return projects;}

// SETTER METHODS

setfirstName(firstName: string) : void { this.firstName = firstName; }
setlastName(lastName: string) : void { this.lastName = lastName; }
// setuserID() : void { this.userID = users.length+1; }
setemailAdress(emailAdress: string) : void { this.emailAdress = emailAdress; }
setpassword(password: string) : void { this.password = password; }

}