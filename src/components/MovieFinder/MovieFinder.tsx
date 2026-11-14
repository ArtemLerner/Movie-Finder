import {useState} from "react";
import {useNavigate} from "react-router-dom";


export default function MovieFinder() {
    const [value, setValues] = useState('');
    const navigate = useNavigate();

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues(e.target.value);
        const text = e.target.value.trim();
        navigate("/search?q=" + encodeURIComponent(text));
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        const text = value.trim();
        if(!text) return;
        navigate("/search?q=" + encodeURIComponent(text));
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "10px"
        }}>
            <form className='search' onSubmit={handleFormSubmit}>
                <input
                    className='search__input'
                    type="text"
                    style={{
                        width:"80%",
                        margin:"auto",
                    }}

                    placeholder="Найти фильм или сериал..."
                    value={value}
                    onChange={handleOnChange}
                />
                <button type={"submit"} className='search__button'>submit</button>
            </form>
        </div>
    )

}