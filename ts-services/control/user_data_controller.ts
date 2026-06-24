import { IUser } from "../model/iuser";
import { User } from "../model/user";
import { DataAccessController } from "./data_access_controller";

export class UserDataController extends DataAccessController{
    
    static async insertUser(user: IUser, password_hash: string) : Promise<void> {
        DataAccessController.createDataSchema();
        let results = await DataAccessController.pool.query(
            "INSERT INTO users (firstName, lastName, userName, emailAdress, password_hash, usedDevices, loggedIn, fullToDolist, projectsList, teams) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [user.firstName, user.lastName, user.userName, user.emailAdress, password_hash, user.usedDevices, user.loggedIn, user.fullToDolist, user.projectsList, user.teams]
        ); //took away user id from this
        if (typeof results.rowCount !== 'undefined' && results.rowCount > 0) { //if the insertion worked
            return;
        }
        throw new Error("Empty result"); //insertion did not work
    }

    static async selectUsers() : Promise<IUser[]> {
        let users: User[] = [];
        let results = await DataAccessController.pool.query(
            "SELECT userID, userName, FROM users",
            // depending on data volume, only user_id or email column should be selected
            // we simply select id and username
            []
        );
        // return result, ID is unique
        if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
            for (let row of results.rows) {
                let user = new User();
                user.firstName = row.firstName;
                user.lastName = row.lastName;
                user.userName = row.userName;
                user.userID = row.userID;
                user.emailAdress = row.emailAdress;
                user.usedDevices = row.usedDevices;
                user.loggedIn = row.loggedIn;
                user.fullToDolist = row.fullToDolist;
                user.projectsList = row.projectsList;
                user.teams = row.teams;
                users.push(user);
            }
            return users;
        }
        throw new Error("User not found");
    }

    static async selectUserById(id: number) : Promise<IUser> {
        let results = await DataAccessController.pool.query(
            "SELECT userID, userName FROM users WHERE userID = $1",
            [id]
        );
        // return result, ID is unique
        if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
            let user = new User();
            user.firstName = results.rows[0].firstName;
            user.lastName = results.rows[0].lastName;
            user.userName = results.rows[0].userName;
            user.userID = results.rows[0].userID;
            user.emailAdress = results.rows[0].emailAdress;
            user.usedDevices = results.rows[0].usedDevices;
            user.loggedIn = results.rows[0].loggedIn;
            user.fullToDolist = results.rows[0].fullToDolist;
            user.projectsList = results.rows[0].projectsList;
            user.teams = results.rows[0].teams;
            
            return user;
        }
        throw new Error("User not found");
    }

    static async selectUserByEmail(emailAdress: string) : Promise<IUser> {
        let results = await DataAccessController.pool.query(
            "SELECT userID, emailAdress, name FROM users WHERE emailAdress = $1",
            [emailAdress]
        );
        // return result, ID is unique
        if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
            let user = new User();
            user.firstName = results.rows[0].firstName;
            user.lastName = results.rows[0].lastName;
            user.userName = results.rows[0].userName;
            user.userID = results.rows[0].userID;
            user.emailAdress = results.rows[0].emailAdress;
            user.usedDevices = results.rows[0].usedDevices;
            user.loggedIn = results.rows[0].loggedIn;
            user.fullToDolist = results.rows[0].fullToDolist;
            user.projectsList = results.rows[0].projectsList;
            user.teams = results.rows[0].teams;
            
            return user;
        }
        throw new Error("User not found");
    }

    static async selectUserByUserName(userName: string) : Promise<IUser> {
        let results = await DataAccessController.pool.query(
            "SELECT userID, userName, name FROM users WHERE userName = $1",
            [userName]
        );
        // return result, ID is unique
        if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
            let user = new User();
            user.firstName = results.rows[0].firstName;
            user.lastName = results.rows[0].lastName;
            user.userName = results.rows[0].userName;
            user.userID = results.rows[0].userID;
            user.emailAdress = results.rows[0].emailAdress;
            user.usedDevices = results.rows[0].usedDevices;
            user.loggedIn = results.rows[0].loggedIn;
            user.fullToDolist = results.rows[0].fullToDolist;
            user.projectsList = results.rows[0].projectsList;
            user.teams = results.rows[0].teams;
            
            return user;
        }
        throw new Error("User not found");
    }


    static async selectUserPasswordHash(userName: string) : Promise<any> {
        let results = await DataAccessController.pool.query(
            "SELECT userID, userName, name FROM users WHERE userName = $1",
            [userName]
        );
        // return result, ID is unique
        if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
            if (typeof results.rows[0].password_hash !== 'undefined') {
                return { 
                    userID: results.rows[0].userID, 
                    password_hash: results.rows[0].password_hash
                };
            }
        }
        throw new Error("User not found");
    }

    static async updateUserById(user: User) : Promise<void> {
        let results = await DataAccessController.pool.query(
            "UPDATE users SET firstName = $1, lastName = $2, userName = $3, emailAdress = $4, usedDevices = $5, loggedIn = $6, fullToDolist = $7, projectsList = 8$, teams = $9 WHERE user_id = $10",
            [user.firstName, user.lastName, user.userName, user.emailAdress, user.usedDevices, user.loggedIn, user.fullToDolist, user.projectsList, user.teams]
        );
        if (typeof results.rowCount !== 'undefined' && results.rowCount > 0) {
            return;
        }
        throw new Error("Empty result");
    }

    static async deleteUser(id: number) : Promise<void> {
        let results = await DataAccessController.pool.query(
            "DELETE FROM users WHERE userID = $1",
            [id]
        );
        if (typeof results.rowCount !== 'undefined' && results.rowCount > 0) {
            return;
        }
        throw new Error("Empty result");
    }

}