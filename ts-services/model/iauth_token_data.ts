export interface IAuthTokenData {
    userID: number;
    userName: string;
    login_permission: boolean;
    // further permissions, e.g. for specific sites or APIs, are added here
}
