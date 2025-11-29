import { useState } from "react"
import Manager from "./Logins/Manager.jsx"
import Worker from "./Logins/Worker.jsx"

export default function(){

    const [isManager, setIsManager] = useState(false)

    function displayForm(){
        if (isManager) {
            return <Manager />
        } else

        return <Worker />  
    }

    return(
        <div>
            <div>
                <button onClick={() => setIsManager(!isManager)}>LOGIN AS {isManager ? 'WORKER' : 'MANAGER'}</button>
            </div>

            <div>
                {displayForm()}
            </div>
        </div>
    )
}