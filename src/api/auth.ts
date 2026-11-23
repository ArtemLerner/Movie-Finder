import type {User} from "../share/types/User.ts";

const BASE_URL: string =  import.meta.env.VITE_URL + '/auth/';


export async function checkMe(setUser: (u: User | null) => void ){
    try{
        const res = await fetch(`${BASE_URL}me`
            , { credentials: "include" })
            .catch(() => setUser(null))

        if(!res)
            return console.log('error :' + res)

        const data = await res.json()

        return setUser(data);
    }catch (err){
        console.error(err)
    }

}