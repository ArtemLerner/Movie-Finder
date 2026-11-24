import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import Loading from "../Loading/Loading.tsx";
import SignInPopup from "../Popup/sign-in.popup.tsx";
import type {User} from "../../share/types/User.ts";
import {logIn, signIn, verify} from "../../api/auth.ts";
import {useQueryClient} from "@tanstack/react-query";


export default function SignIn() {
    const {user,setUser} = useAuth();
    const nav = useNavigate();

    const queryClient = useQueryClient();

    useEffect(() => {
        if(user){
            nav('/profile', {replace: true});
        }
    }, [user, nav]);

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

    const [toast, setToast] = useState(false);

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

        setLoadingReg(true);

        const data = await signIn(regEmail, regPassword)
            .finally(()=>setLoadingReg(false))

        if(data){
            setPopup(true);
        }else {
            setRegError(data.error || data.message || 'Email already exists');
        }

    }

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoginError("");
        queryClient.clear();
        await logIn(loginEmail, loginPassword)
            .then((data) => {
                if(data){
                    setUser(data)
                    nav("/profile");
                }else{
                    setPopup(false);
                    setLoginError("Failed to login");
                }
            })
            .catch(() => setLoginError("Incorrect login or password"))
            .finally(() => setLoadingLog(false))
    }

    async function handleToken (token: string): Promise<boolean> {

        const isVerify = await verify(regEmail,token)

        if(isVerify){
            setPopup(false);
            setToast(true);
            setRegEmail('')
            setRegPassword('')
            setRegConfirmPassword('')
            return true
        }else{
            console.log(isVerify.message);
            setPopup(false);
            return false
        }
    }


    return (
        <>

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
                    <SignInPopup user={{ email: regEmail } as User} verify={handleToken}/>

                }
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
            {toast ?
                <div className={'register-cart'}>
                    <div className="success-card">
                        <div className="success-icon">✓</div>
                        <h1>Registration successful!</h1>
                        <p>Your account has been created. You can now log in.</p>
                        <button onClick={() => setToast(false)}>Log in</button>
                    </div>
                </div>
                : ''}
        </>
    );

}
