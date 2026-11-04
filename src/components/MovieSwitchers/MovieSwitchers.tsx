
type propsSwithers = {
    buttons: string[]
    time: (value: string) => void
}



export default function MovieSwitchers({buttons, time}: propsSwithers){
    return(
        <div className="buttons">
            {buttons.map(
                button =>
                    <button key={button}
                        onClick={()=>{
                            time(button) ;
                        }}>
                        {button}
                    </button>
            )}

        </div>
    )


}