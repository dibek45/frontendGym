import { MemberModel } from "./member.interface";
import { userModel } from "./user.interface";

export interface UserState{
    loading:boolean;
    user: Readonly<userModel>
}