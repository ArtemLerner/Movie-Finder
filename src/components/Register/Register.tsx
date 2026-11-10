export default function Register() {

    return (
        <div className={'register-page'}>

            <div className={'register-block'}>
                <h1>Register</h1>
                <form title={"Register"} className={'register-form'}>

                    <label>email:</label>
                    <input type="email"/>

                    <label>password:</label>
                    <input type="password"/>

                    <label>password confirm:</label>
                    <input type="password"/>
                    <button type={"submit"}>submit</button>

                </form>
            </div>

            <div className={'log-in-block'}>

                <h1>log-in</h1>

                <form action="" title={"log-in"} className={'register-form'}>
                    <label>email:</label>
                    <input type="email"/>
                    <label>password:</label>
                    <input type="password"/>

                    <button type={"submit"}>submit</button>
                </form>
            </div>
        </div>
    )
}