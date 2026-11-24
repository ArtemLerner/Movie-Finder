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

export async function logIn(loginEmail: string, loginPassword: string){
    try {
        const res = await fetch(`${BASE_URL}login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });

        const data = await res.json();

        if (res.ok) {

            return data
        } else {
            return (data.error || data.message || 'Email already exists');
        }

    } catch (err) {
        return ("Не удалось связаться с сервером."+ err);
    }
}

export async function verify(regEmail:string, token:string){
    try{
        const res = await fetch(`${BASE_URL}verify-e`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email: regEmail, token})
        })

        const data = await res.json();

        if (res.ok) {

            return data
        }else{
            return false;
        }
    }catch(err) {
        console.log(err);
        return false;
    }
}