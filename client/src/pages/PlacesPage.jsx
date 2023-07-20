import axios from "axios";
import { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import AccountNav from "../AccountNav";
import PlaceImg from "../PlaceImg";

export default function PlacesPage(){

    const [places,setPlaces] = useState([]);

    useEffect(()=>{
        axios.get("/user-places").then(({data})=>{
            setPlaces(data);
        })
    },[])


    return (
        <div>
            <AccountNav/>
            <div className="text-center">
            <Link to={"/account/places/new"} className="inline-flex gap-1 bg-primary py-2 px-6 text-white rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
                Add New Place
            </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map(place => (
                    <Link to={'/account/places/'+place._id} className="flex cursor-pointer bg-gray-100 gap-4 p-4 rounded-2xl mb-4">
                        <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                            <PlaceImg place={place} />
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl">{place.title}</h2>
                            <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>     
    )
}