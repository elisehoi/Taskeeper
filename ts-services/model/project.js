"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
class Project {
    constructor() {
        this.name = "";
        this.description = "";
        this.projectID = "";
        this.labelsList = [];
        this.tasksList = [];
        this.ownerUser = -1;
    }
}
exports.Project = Project;
