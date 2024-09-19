import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { IoIosSend } from "react-icons/io";
import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Make sure to set this in your .env

const Information = ({ trip }) => {
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
        <div>
            <img src={placeImage || "/heroImg.webp"} alt="" className='h-[400px] w-full object-cover rounded-xl' />

            <div className='flex justify-between p-5 items-center'>
                <div className='my-5 flex flex-col gap-2'>
                    <h2 className='font-bold text-2xl'>{trip?.userSelection?.place}</h2>
                    <div className='flex gap-5'>
                        <h2 className='p-1  px-3 bg-gray-200 rounded-full text-gray-500 cursor-pointer text-xs md:text-md'>📅{trip?.userSelection?.days} Days</h2>
                        <h2 className='p-1  px-3 bg-gray-200 rounded-full text-gray-500 cursor-pointer text-xs md:text-md'>💰{trip?.userSelection?.budget}</h2>
                        <h2 className='p-1  px-3 bg-gray-200 rounded-full text-gray-500 cursor-pointer text-xs md:text-md'>🥂{trip?.userSelection?.travelers}</h2>
                    </div>
                </div>
                <Button><IoIosSend /></Button>
            </div>
        </div>
    );
};

export default Information;
