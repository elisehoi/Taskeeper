export interface IUser {
     
     firstName: string;
     lastName: string;
     userName: string;
     userID: number; 
     emailAdress: string;
     // password taken away for hashing
     usedDevices: string[];
     loggedIn: boolean; 
     fullToDolist: string[]; //set as an array of strings (IDs of the tasks) for now, may change later 
     projectsList: string[];
     teams: number[];
}
