import { Pool } from "pg";
import { environment } from "../environments/environment.prod";

export class DataAccessController {

    protected static pool = new Pool({
        user: environment.db_user,
        host: environment.db_host,
        database: environment.db_name,
        password: environment.db_pass,
        port: environment.db_port,
        statement_timeout: 2000
    });

    constructor() {
        DataAccessController.createDataSchema();
    }

    static async createDataSchema() : Promise<void> {
        let statements = [ 
            "CREATE TABLE IF NOT EXISTS users (firstName text, lastName text, userName text UNIQUE, userID serial, emailAdress text UNIQUE, password_hash text, usedDevices text[], loggedIn boolean, fullToDolist text[], projectsList text[], teams int[], PRIMARY KEY (userID))",
            //to do: potentially redefine the type of used devices
            //to do: change the serial back to int UNIQUE when the ID system is fully implemented
            "CREATE TABLE IF NOT EXISTS teams (name text, description text, teamID int UNIQUE, labels text[], ownerUser int, teamMembers int[], projects text[], PRIMARY KEY (teamID))",
            //to do: eventually define separate tables for the users (team members) and the projects in the team, so they can be an array of unique values
            "CREATE TABLE IF NOT EXISTS tasks (name text, description text, taskID text UNIQUE, Deadline DATE, isDone boolean, labels text[], ownerUser int, assignedMembers int[], project text, PRIMARY KEY (taskID))",
            "CREATE TABLE IF NOT EXISTS projects (name text, description text, projectID text UNIQUE, labels text[], tasksList text[], ownerUser int, team int, PRIMARY KEY (projectID))",
            //to do for projects and tasks: eventually add the subIDs if necessary
        ];
        for (let s of statements) {
            let results = await DataAccessController.pool.query(s);
            if (typeof results.rows !== 'undefined') {
                return;
            }
            throw new Error("Empty result");
        }
    }

}
