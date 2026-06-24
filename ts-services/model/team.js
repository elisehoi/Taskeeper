"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
class Team {
    constructor() {
        this.name = "";
        this.description = "";
        this.labels = [];
        this.ownerUser = -1;
        this.teamMembers = [];
    }
}
exports.Team = Team;
