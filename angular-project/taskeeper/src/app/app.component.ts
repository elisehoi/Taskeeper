import { Component,  OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Project } from './project/project';
import { UserComponent } from './user/user.component';
import { Task } from './task/task';
import { Team } from './teams/team';
import { TeamsService } from './teams/team.service';
import { TaskService } from './task/task.service';
import { ProjectService } from './project/project.service';
import { User } from './user/user';
import { UserService } from './user/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css']
})
export class AppComponent implements OnInit{
  @Input() task?: Task;
  title: string = "Taskeeper";
  static allTeams: Team[] = [];
  static allTasks: Task[] = [];
  static allGlobalProjects: Project[] = [];
  static allUsers: User[] = [];
  public static cdr: ChangeDetectorRef

constructor(private TeamsService: TeamsService, private UserService: UserService, private TaskService: TaskService, private ProjectService: ProjectService) {}

  /*SUBSCRIBE --------------------------------------------------- */

  //GET ALL TEAMS - subscribe
  getAllTeams(): void {
    this.TeamsService.getAllObservableTeams()
    .subscribe(teams  => AppComponent.allTeams = teams); //retreives the users stored in all users of the service
    }
   //GET ALL USERS
   getAllUsers(): void {
    this.UserService.getObservableAllUsers()
    .subscribe(users  => AppComponent.allUsers = users); //retreives the users stored in all users of the service
    }
     //GET ALL TASKS - subscribe
     getAllGloabalTasks(): void {
      this.TaskService.getAllGlobalTasks()
      .subscribe(tasks => AppComponent.allTasks = tasks); //retreives the tasks stored in all tasks of the service
  }
    //GET ALL PROJECTS - subscribe
    getAllGlobalProjects(): void {
      this.ProjectService.getAllGlobalProjects()
      .subscribe(projects  => AppComponent.allGlobalProjects = projects); //retreives the teams stored in all teams of the service
      }
    

  ngOnInit(): void {

// TEST DATA:

    AppComponent.allUsers = [UserService.newUser('Elise', 'Hoi', 'elise', 'elise@test.com', 'test'), UserService.newUser('Aurélien', 'test', 'test', 'test', 'test')]
    // here it's important not to create several users with the same username because it's forbidden in the new user method
    // however nothing will be displayed on the console 
    AppComponent.allGlobalProjects = [ProjectService.newProject('Test Project 1', 'test', ['test'], AppComponent.allUsers[1]), new Project('Test Project 2', 'test', ['test'], AppComponent.allUsers[0])];
    AppComponent.allTeams = [TeamsService.newTeam("SD team", 'test', ['test'], AppComponent.allUsers[1], [AppComponent.allUsers[0], AppComponent.allUsers[1]] )]
    //AppComponent.allTasks = [TaskService.newTask('test task 1', 'test', new Date(), ['test'], AppComponent.allUsers[1], AppComponent.allGlobalProjects[0], [AppComponent.allUsers[0], AppComponent.allUsers[1]]), TaskService.newTask('test task 2', 'test', new Date(), ['test'], AppComponent.allUsers[1], AppComponent.allGlobalProjects[0])]

  }

}


