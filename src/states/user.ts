import {UserType} from "../models/user";

let currentUser: UserType;

const setCurrentUserState = (User: UserType) => {
    currentUser = User;
}
const getCurrentUserState = () => {
    return currentUser;
}
export {
    setCurrentUserState,
    getCurrentUserState,
}