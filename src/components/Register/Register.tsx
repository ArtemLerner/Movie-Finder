import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";


export default function Register() {

    // Состояния для формы регистрации
    const {setUser} = useAuth();

    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [regError, setRegError] = useState("");

    // Состояния для формы входа
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const nav = useNavigate();

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
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: regEmail, password: regPassword})
            })
            const json = await res.json();

        }catch(err) {
            console.log(err);
        }
        nav('/profile');


    }

    // Обработка и проверка формы ВХОДА
    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();


        setLoginError("");

        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            const data = await res.json();

            setUser(data);

            if (data.user === true) {
                nav("/profile");
            } else {
                setLoginError("Неверный email или пароль.");
            }

        } catch (err) {
            setLoginError("Не удалось связаться с сервером.");
        }
    }

    return (
        <div className={'register-page'}>

            {/* Блок регистрации */}
            <div className={'register-block'}>
                <h1>Register</h1>
                <form title={"Register"} className={'register-form'} onSubmit={handleRegisterSubmit} noValidate>

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
            </div>

            {/* Блок входа */}
            <div className={'log-in-block'}>
                <h1>log-in</h1>
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
            </div>

        </div>
    );
}
