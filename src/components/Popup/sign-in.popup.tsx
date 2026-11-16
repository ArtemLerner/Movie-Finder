import type {User} from "../../share/types/User.ts";
import {useState} from "react";


type SignInPopup = {
    user: User | null | undefined;
    verify: (value: string) => void
}


export default function SignInPopup({user, verify}: SignInPopup) {
    const [token, setToken] = useState<string>('');


    function handleVerifyEmail(e: React.FormEvent){
        e.preventDefault();
        const text = token.trim().toLowerCase();
        verify(text);
    }

    return (
        <div className="verify-popup" role="dialog" aria-modal="true" aria-labelledby="verify-title">
            <div className="verify-popup__card">
                <h2 id="verify-title" className="verify-popup__title">
                    Enter the code we sent to
                    <span className="verify-popup__email">{user?.email}</span>
                </h2>

                <form className="verify-popup__form" onSubmit={handleVerifyEmail}>
                    <input
                        className="verify-popup__input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        autoFocus
                    />
                    <button className="verify-popup__button" type="submit">
                        Verify
                    </button>
                </form>
            </div>
        </div>
    )
}