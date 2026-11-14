import type {Dispatch} from "react";
import type {SetStateAction} from "react";

export interface User {
    email: string;
    password: string;
}

export interface AuthContextTypes {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}