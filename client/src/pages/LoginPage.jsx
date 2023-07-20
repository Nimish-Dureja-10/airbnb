import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [redirect,setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function loginUser(ev){
        ev.preventDefault();
        try {
            const {data} = await axios.post("/login",{
                email,password
            });
            alert("Login Successfully");
            setUser(data);
            setRedirect(true);
        } catch (error) {
            alert('Failed To Login, Please Try Again Later!!!');
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-center text-4xl mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type={"email"} placeholder="your@email.com" value={email} onChange={(ev)=>setEmail(ev.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(ev)=>setPassword(ev.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet ? <Link to={'/register'} className="text-black underline">Register Now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}