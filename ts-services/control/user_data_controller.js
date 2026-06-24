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
exports.UserDataController = void 0;
const user_1 = require("../model/user");
const data_access_controller_1 = require("./data_access_controller");
class UserDataController extends data_access_controller_1.DataAccessController {
    static insertUser(user, password_hash) {
        return __awaiter(this, void 0, void 0, function* () {
            data_access_controller_1.DataAccessController.createDataSchema();
            let results = yield data_access_controller_1.DataAccessController.pool.query("INSERT INTO users (firstName, lastName, userName, emailAdress, password_hash, usedDevices, loggedIn, fullToDolist, projectsList, teams) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [user.firstName, user.lastName, user.userName, user.emailAdress, password_hash, user.usedDevices, user.loggedIn, user.fullToDolist, user.projectsList, user.teams]); //took away user id from this
            if (typeof results.rowCount !== 'undefined' && results.rowCount > 0) { //if the insertion worked
                return;
            }
            throw new Error("Empty result"); //insertion did not work
        });
    }
    static selectUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let users = [];
            let results = yield data_access_controller_1.DataAccessController.pool.query("SELECT userID, userName, FROM users", 
            // depending on data volume, only user_id or email column should be selected
            // we simply select id and username
            []);
            // return result, ID is unique
            if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
                for (let row of results.rows) {
                    let user = new user_1.User();
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
        });
    }
    static selectUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield data_access_controller_1.DataAccessController.pool.query("SELECT userID, userName FROM users WHERE userID = $1", [id]);
            // return result, ID is unique
            if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
                let user = new user_1.User();
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
        });
    }
    static selectUserByEmail(emailAdress) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield data_access_controller_1.DataAccessController.pool.query("SELECT userID, emailAdress, name FROM users WHERE emailAdress = $1", [emailAdress]);
            // return result, ID is unique
            if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
                let user = new user_1.User();
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
        });
    }
    static selectUserByUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield data_access_controller_1.DataAccessController.pool.query("SELECT userID, userName, name FROM users WHERE userName = $1", [userName]);
            // return result, ID is unique
            if (typeof results.rows !== 'undefined' && results.rows.length > 0) {
                let user = new user_1.User();
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
        });
    }
    static selectUserPasswordHash(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield data_access_controller_1.DataAccessController.pool.query("SELECT userID, userName, name FROM users WHERE userName = $1", [userName]);
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
        });
    }
    static updateUserById(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield data_access_controller_1.DataAccessController.pool.query("UPDATE users SET firstName = $1, lastName = $2, userName = $3, emailAdress = $4, usedDevices = $5, loggedIn = $6, fullToDolist = $7, projectsList = 8$, teams = $9 WHERE user_id = $10", [user.firstName, user.lastName, user.userName, user.emailAdress, user.usedDevices, user.loggedIn, user.fullToDolist, user.projectsList, user.teams]);
            if (typeof results.rowCount !== 'undefined' && results.rowCount > 0) {
                return;
            }
            throw new Error("Empty result");
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield data_access_controller_1.DataAccessController.pool.query("DELETE FROM users WHERE userID = $1", [id]);
            if (typeof results.rowCount !== 'undefined' && results.rowCount > 0) {
                return;
            }
            throw new Error("Empty result");
        });
    }
}
exports.UserDataController = UserDataController;
