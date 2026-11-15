import type {User} from "../../share/types/User.ts";
import {useState} from "react";


type SignIn = {
    user: User | null;
    verify: (value: string) => void
}


export default function SignIn({user, verify}: SignIn) {
    const [token, setToken] = useState<string>('');


    function handleVerifyEmail(e: React.FormEvent){
        e.preventDefault();
        const text = token.trim().toLowerCase();
        verify(text);
    }

    return (
        <div className={'popup-signIn'}>
            <p>write u pass in {user.email}</p>

            <form onSubmit={handleVerifyEmail}>
                <input type="text"
                onChange={(e)=>{
                    setToken(e.target.value);
                }}
                />
                <button type={"submit"}></button>
            </form>
        </div>
    )
}