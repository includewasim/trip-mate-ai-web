import React, { useState, useEffect } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Your Unsplash API key

function Hotel({ trip }) {
    const [hotelImages, setHotelImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (trip?.tripData?.hotelOptions) {
            fetchHotelImages(trip.tripData.hotelOptions);
        }
    }, [trip]);

    const fetchHotelImages = async (hotels) => {
        setLoading(true); // Set loading to true before fetching images
        const promises = hotels.map(async (hotel) => {
            try {
                const response = await axios.get(`https://api.unsplash.com/search/photos`, {
                    params: {
                        query: hotel.name + " hotel",
                        client_id: UNSPLASH_ACCESS_KEY,
                        per_page: 1
                    }
                });
                return response.data.results[0]?.urls?.regular || "/heroImg.webp"; // Default to heroImg if no image is found
            } catch (error) {
                console.error("Error fetching hotel image:", error);
                return "/heroImg.webp"; // Use default image in case of error
            }
        });

        const images = await Promise.all(promises);
        setHotelImages(images);
        setLoading(false); // Set loading to false after fetching images
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div>
            <h2 className='font-bold text-xl mt-5'>Hotel Recommendations</h2>

            <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
                {trip?.tripData?.hotelOptions?.map((item, index) => (
                    <div className='hover:scale-110 transition-all cursor-pointer ' key={item?.name + item?.address}>
                        <Link to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item?.name + ' ' + item?.address)} target={'_blank'}>
                            <img src={hotelImages[index] || "/heroImg.webp"} alt={item.name} className='rounded-lg' />
                            <div className='my-2 flex flex-col gap-2'>
                                <h2 className='font-medium'>{item.name}</h2>
                                <h2 className='text-xs text-gray-500 flex flex-row'><FaLocationDot /> {item.address}</h2>
                                <h2 className='text-sm font-bold'>💰 {item.price}</h2>
                                <h2>{item.rating}⭐</h2>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Hotel;
