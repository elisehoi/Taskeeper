export interface ITeam {
    name: string
    description: string
    labels: string[] 
    ownerUser: number //ID
    teamMembers: number[] // NOTE: THE TEAM MEMBERS SHOULD INCLUDE THE OWNERUSER, AT LEAST FOR NOW
}
