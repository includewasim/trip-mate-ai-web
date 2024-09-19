import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const UserTripCardItem = ({ trip }) => {
    const [placeImage, setPlaceImage] = useState('');

    useEffect(() => {
        if (trip) {
            getPlacePhoto();
        }
    }, [trip]);

    const getPlacePhoto = async () => {
        const placeName = trip?.userSelection?.place;
        if (!placeName) return;

        try {
            const response = await axios.get(`https://api.unsplash.com/search/photos`, {
                params: {
                    query: placeName,
                    client_id: UNSPLASH_ACCESS_KEY, // Your Unsplash Access Key
                    per_page: 1 // Get one image
                }
            });
            const imageUrl = response.data.results[0]?.urls?.regular; // Get the image URL
            setPlaceImage(imageUrl);
        } catch (error) {
            console.error("Error fetching place image:", error);
        }
    };
    return (
        <Link to={'/view-trip/' + trip?.id}>
            <div className='hover:scale-105 transition-all hover:shadow'>
                <img src={placeImage || "/heroImg.webp"} alt="" className='object-cover rounded-xl h-[250px]' />
                <div>
                    <h2 className='font-bold text-lg'>
                        {
                            trip?.userSelection?.place
                        }
                    </h2>
                    <h2 className='text-sm text-gray-500'>{trip?.userSelection?.days} Days {trip?.userSelection?.travelers} trip with {trip?.userSelection?.budget} Budget</h2>
                </div>
            </div>
        </Link>
    )
}

export default UserTripCardItem