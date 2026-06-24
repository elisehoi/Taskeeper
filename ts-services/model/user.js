"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const environment_prod_1 = require("../environments/environment.prod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class User {
    constructor() {
        this.firstName = "";
        this.lastName = "";
        this.userName = "";
        this.userID = -1;
        this.emailAdress = "";
        this.usedDevices = [];
        this.loggedIn = false;
        this.fullToDolist = [];
        this.projectsList = [];
        this.teams = [];
    }
    static hashPassword(password) {
        const ROUNDS = 10;
        const SALT = bcrypt_1.default.genSaltSync(ROUNDS);
        console.log("Salt", SALT);
        let password_hash = bcrypt_1.default.hashSync(password, SALT);
        console.log("Hash", password_hash);
        return password_hash;
    }
    static passwordMatchesHash(password, password_hash) {
        let login = bcrypt_1.default.compareSync(password, password_hash);
        return login;
    }
    static createJwtToken(userID, userName) {
        const token_data = {
            userID: userID,
            userName: userName,
            login_permission: true
        };
        const options = { expiresIn: 3600 };
        const token = jsonwebtoken_1.default.sign(token_data, environment_prod_1.environment.jwt_key, options);
        return token;
    }
    static verifyJwtToken(token) {
        try {
            const token_data = jsonwebtoken_1.default.verify(token, environment_prod_1.environment.jwt_key);
            console.log(token_data);
            if (token_data.login_permission) {
                console.log(`Authenticated user ${token_data.userName}`);
                return token_data;
            }
            else {
                throw Error("No authorization");
            }
        }
        catch (error) {
            throw Error("JWT token verification failed");
        }
    }
}
exports.User = User;
