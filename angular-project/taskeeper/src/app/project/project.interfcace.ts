import { Component, OnInit, Injectable } from '@angular/core';
import { Task } from '../task/task';
import { User } from '../user/user';
import { Team } from '../teams/team';

export interface IProject {
    name: string;
    description: string;
    projectID: string; //changed to string to be concatenated with the owneruser's ID
    labelsList: string[];
    tasksList: Task[];
    ownerUser: User;
    team?: Team; // from teams
  
  }