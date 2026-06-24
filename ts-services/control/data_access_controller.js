"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccessController = void 0;
const pg_1 = require("pg");
const environment_prod_1 = require("../environments/environment.prod");
class DataAccessController {
    constructor() {
        DataAccessController.createDataSchema();
    }
    static createDataSchema() {
        return __awaiter(this, void 0, void 0, function* () {
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
                let results = yield DataAccessController.pool.query(s);
                if (typeof results.rows !== 'undefined') {
                    return;
                }
                throw new Error("Empty result");
            }
        });
    }
}
DataAccessController.pool = new pg_1.Pool({
    user: environment_prod_1.environment.db_user,
    host: environment_prod_1.environment.db_host,
    database: environment_prod_1.environment.db_name,
    password: environment_prod_1.environment.db_pass,
    port: environment_prod_1.environment.db_port,
    statement_timeout: 2000
});
exports.DataAccessController = DataAccessController;
