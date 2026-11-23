import type {User} from "../share/types/User.ts";

const BASE_URL: string =  import.meta.env.VITE_URL + '/auth/';


export async function checkMe(): Promise<User | null> {
    const res = await fetch(`${BASE_URL}me`, { credentials: "include" })
    if (!res.ok) throw new Error(`Auth check failed: ${res.status}`);
    return res.json()
}

export async function signIn(regEmail: string, regPassword: string){
    try {
        const res = await fetch(`${BASE_URL}register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email: regEmail, password: regPassword})
        })
        const data = await res.json();
        if (res.ok) {
            return data
        }
    }catch(err) {
        console.log(err);
    }
}