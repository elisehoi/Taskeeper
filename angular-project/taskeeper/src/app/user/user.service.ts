import { Injectable, PLATFORM_ID, Inject} from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { AppComponent } from '../app.component';

//import { DeviceDetectorService } from 'ngx-device-detector';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  static AllUsers: User[] = []; 


  constructor() {
  }

  // Observable

  getObservableAllUsers(): Observable <User[]>{

    var AllUsersObservable = of(UserService.AllUsers);
    return AllUsersObservable;
  }

  // USER CREATION

  public static newUser(firstName: string, lastName: string, userName: string, emailAdress: string, password: string){

    // Checks if the username is already taken
    UserService.AllUsers.forEach(function(user){
      if (user.userName==userName){
        throw new Error('Username is already taken! Please choose another one and try again'); 
      }
    })
    
    var user = new User(firstName, lastName, userName, emailAdress, password);

    //User ID
    if (UserService.AllUsers.length===0){
    user.userID = 1;
    } else {
    user.userID = UserService.AllUsers[UserService.AllUsers.length-1].userID+1; // ID of the previous item +1
    // not the length because it might cause duplicate IDs since the list is dynamic and items might be removed
    }

    UserService.AllUsers.push(user); //PUSHES THE USER INTO THE ALL USERS ARRAY

    // For used devices (I don't know if it works, TODO: test + redefine)
    /*const deviceDetectorService = new DeviceDetectorService(PLATFORM_ID); //I don't know if using platform_ID directly here works
    const deviceInfo = deviceDetectorService.getDeviceInfo();
    const deviceModel = deviceInfo.device.toString();
    user.usedDevices.push(deviceModel);*/

    // IF THIS DOES NOT WORK WE CAN TRY:
    const userAgentString = navigator.userAgent;
    const deviceModel = userAgentString.match(/\((.*?)\)/)?.[1].split(';')[0];
    if (deviceModel!==undefined){
    deviceModel.toString();
    user.usedDevices.push(deviceModel); 
    }
    

    return user; 
  }

  // LOG IN

  public static logIn(userName: string, password: string): void {

    let currentUser: User = new User("", "", "", "", "");
    
    UserService.AllUsers.forEach(function(user){
      if (user.userName===userName){
        currentUser = user;
      }
    })

    if (currentUser.userName==""){ //WRONG CREDENTIALS PROVIDED
      throw new Error('Username provided not registered. Please check for typography errors or create an account if you do not already have one.');

    } else if (currentUser.loggedIn === true){
        console.log(`You already logged in!`); //not possible to log in if the user is already connected

    } else {
        if (currentUser.userName === userName && currentUser.password === password) { //LOGS IN
          
          /* TO-DO : FIX and use userAgentString instead
          
          const deviceDetectorService = new DeviceDetectorService(PLATFORM_ID); //USED DEVICE CHECK
          const deviceInfo = deviceDetectorService.getDeviceInfo();
          const deviceModel = deviceInfo.device.toString();
          var sameDevice : Boolean = false;
          for (let i = 0; i < currentUser.usedDevices.length; i++) { //checks if the device has already been used
            if (currentUser.usedDevices[i] === deviceModel) {
              sameDevice = true;
            }
          }
          if (sameDevice === false){                      // if not add it to the list
            currentUser.usedDevices.push(deviceModel);
          }
          */
          
          currentUser.loggedIn = true;
          console.log(`Login successful!`);

        } else {                                //INCORRECT PASSWORD OR USERNAME
          currentUser.loggedIn = false;
            throw new Error(`Username or password incorrect`);      
        }
    }
    UserService.AllUsers = UserService.AllUsers.map(user => user.userID === currentUser.userID ? currentUser : user); //updates the list in the storage
}

// LOG OUT

public static logOut(user: User): void {
    user.loggedIn = false;
    console.log(`Logged out`);
    UserService.AllUsers = UserService.AllUsers.map(u => u.userID === user.userID ? user : u); //updates the list in the storage
}

// DELETE USER

public static deleteUser(userToDelete: User): void {
  const userIndex = UserService.AllUsers.findIndex(user => user.userID === userToDelete.userID);

  if (userIndex > -1) {
    UserService.AllUsers.splice(userIndex, 1);
  }
}


// GETTER FOR THE LIST OF USERS

getAllUsers(): User[]{
  return UserService.AllUsers;
}

//TO-DO: MODIFY USER INFO

//TO-DO: email verification?

//TO-DO: 2FA using used devices?

}
