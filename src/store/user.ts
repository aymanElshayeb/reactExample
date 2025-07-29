import { createEvent, createStore } from "effector";
import { User } from "../models/model";
const initialUser: User = {
    id: "",
    userName: "Ayman",
    password: "Ayman",
    email: null
}
export const login = createEvent<User>();
export const logout = createEvent<User>();
export const register = createEvent<User>();
export const $user = createStore<User>({ id: "", userName: null, password: null, email: null })
    .on(login, (_, payload: User) => {
        const newUser = { ...payload };
        if (newUser.userName === initialUser.userName && newUser.password === initialUser.password) {
            newUser.isAuthenticated = true; // Set isAuthenticated to true on successful login
        } else {
            newUser.isAuthenticated = false; // Set isAuthenticated to false if login fails
        }
        return { ...newUser };
    })
    .on(logout, (_, payload: User) => ({ id: "", userName: null, password: null, email: null }))
    .on(register, (_, payload: User) => ({ ...payload })); // Assuming you want to keep the same structure for logout

