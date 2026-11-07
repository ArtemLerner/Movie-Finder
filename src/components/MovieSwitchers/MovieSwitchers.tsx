import type {timeWindow} from "../../api/movie.ts";

type propsSwithers = {
    buttons: string[]
    time: (value: timeWindow) => void
}


export default function MovieSwitchers({buttons, time}: propsSwithers){
    return(
        <div className="buttons">
            {buttons.map(
                button =>
                    <button key={button}
                        onClick={()=>{
                            time(button as timeWindow) ;
                        }}>
                        {button}
                    </button>
            )}

        </div>
    )


}