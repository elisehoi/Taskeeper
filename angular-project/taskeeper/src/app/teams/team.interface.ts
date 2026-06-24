import { ITask } from "../task/task.interface";
import { IProject } from "../project/project.interfcace";
import { IUser } from "../user/user.interface";
import { User } from "../user/user";

export interface ITeam {
    name: string
    description: string
    labels: string[] //tags to put as details
    ownerUser: User
    teamMembers: User[] // NOTE: THE TEAM MEMBERS SHOULD INCLUDE THE OWNERUSER, AT LEAST FOR NOW
  }
  