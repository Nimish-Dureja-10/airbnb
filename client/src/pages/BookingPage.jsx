import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import AddressLink from "../AddressLink";
import BookingDates from "../BookingDates";
import PlaceGallery from "../PlaceGallery";

export default function BookingPage(){
    const {id} = useParams();
    const [booking,setBooking] = useState(null);

    useEffect(()=>{
        axios.get('/bookings').then(response => {
            const foundBooking = response.data.find(({_id}) => _id === id);
            if(foundBooking) {
                setBooking(foundBooking);
            }
        });
    },[id]);

    if(!booking) {
        return '';
    }

    return (
        <div className="my-8">
            <h1 className="lg:text-3xl font-semibold sm:text-2xl lg:mx-48">Your Booking:</h1>
            <h2 className="lg:text-3xl sm:text-2xl lg:mx-48">{booking.place.title}</h2>
            <AddressLink className={'my-2 block'}>{booking.place.address}</AddressLink>
            <div className="my-4 bg-gray-200 p-4 mb-4 rounded-2xl mx-auto w-3/4">
                <h2 className="text-xxl">Your Booking Information:</h2>
                <div className="flex gap-2 py-3">
                    <BookingDates booking={booking} className="flex gap-1 items-center" />
                </div>
                <div className="text-xl">
                    <div className="flex gap-1 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                        {differenceInCalendarDays(new Date(booking.checkOut),new Date(booking.checkIn))} Nights
                    </div>
                </div>
                <div className="flex items-center">
                    <h2 className="text-xl">Total Amount: <span className="text-lg text-gray-500">₹{booking.price}</span></h2>
                </div>
            </div>  
            <PlaceGallery place={booking.place} />
        </div>
    )
}