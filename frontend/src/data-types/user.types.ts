export interface ILoginRequest {
    username: string;
    password: string;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserData {
    user: IUser;
    token: string;
}