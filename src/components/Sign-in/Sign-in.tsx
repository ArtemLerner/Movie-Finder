import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import Loading from "../Loading/Loading.tsx";
import SignInPopup from "../Popup/sign-in.popup.tsx";
import type {User} from "../../share/types/User.ts";

export default function SignIn() {

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // Состояния для формы регистрации
    const {user,setUser} = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        if(user){
            nav('/profile', {replace: true});
        }
    });

    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [regError, setRegError] = useState("");

    // Состояния для формы входа
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [popup, setPopup] = useState(false);

    const [loadingReg, setLoadingReg] = useState(false);
    const [loadingLog, setLoadingLog] = useState(false);


    // Обработка и проверка формы РЕГИСТРАЦИИ
    async function handleRegisterSubmit(e: React.FormEvent) {
        e.preventDefault();
        setRegError(""); // Очищаем старую ошибку перед проверкой

        if (!regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
            setRegError("Заполните все поля.");
            return;
        }

        if (!regEmail.includes("@")) {
            setRegError("Введите корректный email.");
            return;
        }

        if (regPassword.length < 6) {
            setRegError("Пароль должен быть не короче 6 символов.");
            return;
        }

        if (regPassword !== regConfirmPassword) {
            setRegError("Пароли не совпадают.");
            return;
        }

        // Если все проверки пройдены — отправляем данные на сервер



        try {
            setLoadingReg(true);
            const res = await fetch(`${SERVER_URL}/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: regEmail, password: regPassword})
            }).finally(()=>setLoadingReg(false))


            if (res.ok) {
                setPopup(true);
            }else {
                setRegError("Email already exists!");
            }
        }catch(err) {
            console.log(err);
        }
    }

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();


        setLoginError("");

        try {
            setLoadingLog(true);
            const res = await fetch(`${SERVER_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            }).finally(()=>setLoadingLog(false));

            const data = await res.json();


            if (res.ok) {
                setUser(data);
                nav("/profile");
            } else {
                setPopup(false);
                console.log(data.message);
                setLoginError(data.message);
            }

        } catch (err) {
            setPopup(false);
            setLoginError("Не удалось связаться с сервером.");
        }
    }

    async function handleToken (token: string): Promise<boolean> {
        try{
            const res = await fetch(`${SERVER_URL}/auth/verify-e`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: regEmail, token})
            })

            const data = await res.json();

            if (res.ok) {
                    setUser(data);
                    nav('/profile');
                setPopup(false);
                return true

            }else{
                console.log(data.message);
                setPopup(false);

                return false;
            }


        }catch(err) {
            console.log(err);
            return false;
        }

    }




    return (
        <div className={'register-page'}>
            {/* Блок регистрации */}
            <div className={'register-block'}>
                <h1>Register</h1>
                {loadingReg ? <Loading/> :
                    <form title={"SignIn"} className={'register-form'}
                          onSubmit={handleRegisterSubmit} noValidate>

                        <label>email:</label>
                        <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                        />

                        <label>password:</label>
                        <input
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                        />

                        <label>password confirm:</label>
                        <input
                            type="password"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                        />

                        {/* Вывод ошибки, если она есть */}
                        {regError && <p style={{ color: "red", fontSize: "14px" }}>{regError}</p>}

                        <button type={"submit"}>submit</button>
                    </form>
                }
                {

                    popup &&
                    <SignInPopup user={{ email: regEmail } as User} verify={handleToken}/>}
            </div>

            {/* Блок входа */}
            <div className={'log-in-block'}>
                <h1>log-in</h1>
                {loadingLog ? <Loading/> :
                    <form title={"log-in"} className={'register-form'} onSubmit={handleLoginSubmit} noValidate>

                        <label>email:</label>
                        <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />

                        <label>password:</label>
                        <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />

                        {/* Вывод ошибки, если она есть */}
                        {loginError && <p style={{ color: "red", fontSize: "14px" }}>{loginError}</p>}

                        <button type={"submit"}>submit</button>
                    </form>
                }
            </div>

        </div>
    );
}
