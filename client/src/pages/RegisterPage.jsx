import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage(){

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    async function registerUser(ev){
        ev.preventDefault();
        try{
            await axios.post("/register",{
                name,
                email,
                password
            });
           alert('Registration Successfull, Now You Can Login');
           navigate("/login");
        }catch(error){
            alert('Registration Failed, Please try Again Later!!!')
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-center text-4xl mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type={"text"} placeholder="John Snow" value={name} onChange={(ev)=>setName(ev.target.value)} />
                    <input type={"email"} placeholder="your@email.com" value={email} onChange={(ev)=>setEmail(ev.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={(ev)=>setPassword(ev.target.value)} />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member ? <Link to={'/login'} className="text-black underline">Login Here !</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}