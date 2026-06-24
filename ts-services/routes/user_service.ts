import express from "express";

import { IUser } from "../model/iuser"
import { User } from "../model/user";
import { UserDataController } from "../control/user_data_controller";

const PATH_PREFIX = '/api/v1/';

let router = express.Router();

// API v1
// Register, a singleton resource for creating a new user
// POST request
router.post(PATH_PREFIX + "register", (req, res) => {
    const { firstName, lastName, userName, emailAdress, password } = req.body;
    console.log(req.method, req.url, firstName, lastName, userName, emailAdress);
    console.log(req.headers);

    if (!(firstName != null && lastName != null && userName != null && emailAdress != null && password!= null )){
        // response with status code 400 ("bad request")
        res.status(400).send("Missing input values; current values:"+firstName+" "+lastName+" "+userName+" "+emailAdress+" "+password);
        console.log("Missing input values; current values:"+firstName+" "+lastName+" "+userName+" "+emailAdress+" "+password)
        return;
    }

    let user: IUser = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.userName = userName;
     // userID INCREMENTED BY THE SERIAL FOR NOW; TO DO: CALL THE SERVICE FROM THE TYPESCRIPT APP IF POSSIBLE
    user.emailAdress = emailAdress;
    user.usedDevices = []; // EMPTY FOR NOW; TO DO: CALL THE SERVICE FROM THE ANGULAR APP IF POSSIBLE
    user.loggedIn = true;
    user.fullToDolist = [];
    user.projectsList = [];
    user.teams = [];

    let password_hash = User.hashPassword(password);

    // respond with status code 201 ("created")
    let prom = UserDataController.insertUser(user, password_hash);
    prom.then(result => {
        res.status(201).send();
    }).catch(error => {
        console.log(" User data controller error");
        //console.log(error);
        res.status(400).send(error.toString());
    });
});

// Login, a singleton resource for login
// POST request
router.post(PATH_PREFIX + "login", (req, res) => {
    const { userName, password } = req.body;
    console.log(req.method, req.url, userName);

    if (!(userName != null && password!= null )){
        res.status(400).send("Missing input values");
        return;
    }

    let prom = UserDataController.selectUserPasswordHash(userName);
    prom.then(user_pw_hash => {
        let userID = user_pw_hash.userID;
        let password_hash = user_pw_hash.password_hash;
        console.log(userID, password_hash);
        let token = "";
        if (User.passwordMatchesHash(password, password_hash)) {
            token = User.createJwtToken(userID, userName);
            console.log(token);
            // respond with status code 200 ("ok") with the token
            res.status(200).send(token);
        } else {
            res.status(400).send("Invalid credentials");
        }
    }).catch(error => {
        console.log(error);
        res.status(400).send("Invalid credentials");
    });
});

// Get the collection resource "users"
// GET request
router.get(PATH_PREFIX + "users", (req, res) => {
    console.log(req.method, req.url);
    
    // authenticate with token sent along in the header
    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    let prom = UserDataController.selectUsers();
    prom.then(users => {
        console.log(users);
        res.status(200).json(users);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });
});

// Get a user, a singleton resource, from collection resource "users"
// GET request
router.get(PATH_PREFIX + "users/:id", (req, res) => {
    const { id } = req.params;
    console.log(req.method, req.url, id);
    //console.log(req.headers);
    //console.log(req.body);

    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    if (!id) {
        res.status(400).send("Missing input values");
        return;
    }
    let prom = UserDataController.selectUserById(parseInt(id));
    prom.then(user => {
        res.status(200).json(user);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });
});

// Get a collection resource "users" and filter by e-mail
// GET request
router.get(PATH_PREFIX + "users", (req, res) => {
    const { emailAdress } = req.params;
    console.log(req.method, req.url, emailAdress);

    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    if (!emailAdress) {
        res.status(400).send("Missing input values");
        return;
    }
    let user = new User();
    user.emailAdress = emailAdress;

    let prom = UserDataController.selectUserByEmail(emailAdress);
    prom.then(user => {
        res.status(200).json(user);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });

});

// Get sub-resource "userName" of singleton resource from collection resource
// GET request
router.get(PATH_PREFIX + "users/:id/userName", (req, res) => {
    const { id } = req.params;
    console.log(req.method, req.url, id);

    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    if (!id) {
        res.status(400).send("Missing input values");
        return;
    }

    let prom = UserDataController.selectUserById(parseInt(id));
    prom.then(user => {
        res.status(200).json(user.userName);
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });
});

// Update singleton resource
// PUT request
router.put(PATH_PREFIX + "users/:id", (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, userName, emailAdress } = req.body;
    console.log(req.method, req.url, id, userName, emailAdress);

    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    if (!(id != null && firstName != null && lastName != null && userName != null && emailAdress != null)){
        res.status(400).send("Missing input values");
        return;
    }

    let user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.userName = userName;
    user.userID = parseInt(id);
    user.emailAdress = emailAdress;
    user.usedDevices = []; // EMPTY FOR NOW; TO DO: CALL THE SERVICE FROM THE ANGULAR APP IF POSSIBLE
    user.loggedIn = true;
    user.fullToDolist = [];
    user.projectsList = [];
    user.teams = [];

    let prom = UserDataController.updateUserById(user);
    prom.then(result => {
        res.status(200).send()
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });
});

// Delete singleton resource
// DELETE request
router.delete(PATH_PREFIX + "users/:id", (req, res) => {
    const { id } = req.params;
    console.log(req.method, req.url, id);

    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    if (!id) {
        res.status(400).send("Missing input values");
        return;
    }

    let prom = UserDataController.deleteUser(parseInt(id));
    prom.then(result => {
        res.status(200).send();
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });
});

// Functions such as update, delete or others may alternatively be called 
// under a resource name describing an action, e.g.:
// manage/update, manage/delete, [...] with a GET or POST request
router.get(PATH_PREFIX + "users/:id/manage/delete", (req, res) => {
    const { id } = req.params;
    console.log(req.method, req.url, id);

    try {
        const token = req.headers["x-access-token"] as string;
        let token_data = User.verifyJwtToken(token);
    } catch(error) {
        res.status(403).send("Authentication failed");
        return;
    }

    if (!id) {
        res.status(400).send("Missing input values");
        return;
    }

    let prom = UserDataController.deleteUser(parseInt(id));
    prom.then(result => {
        res.status(200).send()
    }).catch(error => {
        console.log(error);
        res.status(400).send(error.toString());
    });
});

export { router };
