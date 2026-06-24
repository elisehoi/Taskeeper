"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
class Task {
    constructor() {
        this.name = "";
        this.description = "";
        this.taskID = "";
        this.Deadline = new Date;
        this.isDone = false;
        this.labelsList = [];
        this.ownerUser = -1;
    }
}
exports.Task = Task;
