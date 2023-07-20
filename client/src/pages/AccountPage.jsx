import axios from "axios";
import { useContext, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { UserContext } from "../UserContext"
import PlacesPage from "./PlacesPage";

export default function AccountPage(){
    const {ready,user,setUser} = useContext(UserContext);
    const [redirect,setRedirect] = useState(false);
    let {subpage} = useParams();

    if(subpage === undefined){
        subpage = 'profile'
    }

    async function logout(){
        await axios.post('/logout');
        setUser(null);
        setRedirect(true);
    }

    if(redirect){
        return <Navigate to={'/'} />
    }

    if(!ready){
        return "Loading...";
    }

    if(ready && !user){
        return <Navigate to={"/login"} />
    }


    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br/>
                    <button onClick={logout} className="primary max-w-sm mt-2" >Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage/>
            )}
        </div>
    )
};