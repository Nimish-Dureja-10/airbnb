import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import Perks from "../Perks";
// import PhotosUploader from "../photosUploader";

export default function PlacesFormPage(){

    const {id} = useParams();

    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState("");
    const [checkIn,setCheckIn] = useState("");
    const [checkOut,setCheckOut] = useState("");
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(999);
    const [redirect,setRedirect] = useState(false);

    useEffect(()=>{
        if(!id){
            return ;
        }
        axios.get("/places/"+id).then(response=>{
            const {data} = response;
            setTitle(data?.title);
            setAddress(data?.address);
            setAddedPhotos(data?.photos);
            setDescription(data?.description);
            setPerks(data?.perks);
            setExtraInfo(data?.extraInfo);
            setCheckIn(data?.checkIn);
            setCheckOut(data?.checkOut);
            setMaxGuests(data?.maxGuests);
            setPrice(data?.price);
        });
    },[id]);

    function inputHeader(text){
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text){
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    function preInput(header,desc){
        return (
            <>
                {inputHeader(header)}
                {inputDescription(desc)}
            </>
        )
    }

    async function savePlace(ev){
        ev.preventDefault();
        const placeData = {
            title,address,addedPhotos,
            description,perks,extraInfo,
            checkIn,checkOut,maxGuests,price
        }
        if(id){
            //update
            await axios.put("/places",{
                id,...placeData
            });
            setRedirect(true);
        }else{
            //new place
            await axios.post("/places",placeData);
            setRedirect(true);
        }
    }
    
    if(redirect){
        return <Navigate to={'/account/places'} />
    }

    return (
        <div>
        <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title','Title for your place, It should be short and catchy')}
                <input type={'text'} placeholder="title, for example: My Lovely Appartment" value={title} onChange={(ev)=>setTitle(ev.target.value)}/>
                {preInput('Address','Address to this place')}
                <input type={'text'} placeholder="address" value={address} onChange={(ev)=>setAddress(ev.target.value)} />
                {preInput('Photo','more = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput('Description','Description of the place')}
                <textarea value={description} onChange={(ev)=>setDescription(ev.target.value)} />
                {preInput('Perks','Select perks that suits your place')}
                <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    <Perks selected={perks} onChange={setPerks}/>
                </div>
                {preInput('Extra Info','House rules, etc like: carry your id proof.')}
                <textarea value={extraInfo} onChange={(ev)=>setExtraInfo(ev.target.value)} />
                {preInput('Check in&out Time','add check in and out times, remember to have some time window for cleaning the room between the guests.')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in time</h3>
                        <input value={checkIn} onChange={(ev)=>setCheckIn(ev.target.value)}  type={'text'} placeholder="14:00 pm" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time</h3>
                        <input value={checkOut} onChange={(ev)=>setCheckOut(ev.target.value)}  type={'text'} placeholder="18:00 pm" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max No. of Guests</h3>
                        <input value={maxGuests} onChange={(ev)=>setMaxGuests(ev.target.value)}  type={'number'} placeholder='2' />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input value={price} onChange={(ev)=>setPrice(ev.target.value)}  type={'number'} placeholder='₹999' />
                    </div>
                </div>
                <button className="primary my-4">
                    Save Details
                </button>
            </form>
        </div>
    )
}
