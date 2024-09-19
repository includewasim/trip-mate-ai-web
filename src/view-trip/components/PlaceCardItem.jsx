import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Your Unsplash API key

const PlaceCardItem = ({ planItem }) => {
    const [imageUrl, setImageUrl] = useState(); // Default image
    const [loading, setLoading] = useState(true); // To show loading state while fetching

    useEffect(() => {

        planItem && fetchPlaceImage(planItem?.place);
    }, [planItem]);

    const fetchPlaceImage = async (place) => {
        try {
            const response = await axios.get('https://api.unsplash.com/search/photos', {
                params: {
                    query: place,
                    client_id: UNSPLASH_ACCESS_KEY,
                    per_page: 1
                }
            });
            console.log("Unsplash API Response:", response.data);
            const fetchedImageUrl = response.data.results[0]?.urls?.regular || '/heroImg.webp';
            setImageUrl(fetchedImageUrl);
        } catch (error) {
            console.error("Error fetching place image:", error);
            setImageUrl('/heroImg.webp'); // Default image in case of error
        } finally {
            setLoading(false);
        }
    };



    return (
        <Link to={'https://www.google.com/maps/search/?api=1&query=' + planItem?.place} target={'_blank'}>
            <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all cursor-pointer hover:shadow'>
                {loading ? (
                    <div className="h-[130px] w-[130px] flex justify-center items-center">Loading...</div>
                ) : (
                    <img src={imageUrl} alt={planItem?.place} className='h-[130px] w-[130px] rounded-xl' />
                )}
                <div>
                    <h2 className='font-bold text-lg'>{planItem?.place}</h2>
                    <p className='text-sm text-gray-500'>{planItem?.details}</p>
                    <h2>🕒 {planItem?.timeSpent}</h2>
                </div>
            </div>
        </Link>
    );
};

export default PlaceCardItem;
