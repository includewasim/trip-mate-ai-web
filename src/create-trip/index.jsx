import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import Search from './Search';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
const CreateTrip = () => {
    const [formData, setFormData] = useState({
        place: '',
        days: '',
        budget: '',
        travelers: '',
    });

    const [openDialog, setOpenDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    const handleInputChange = (name, value) => {

        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
    }, [formData]);

    const handlePlaceSelect = (selectedPlace) => {
        handleInputChange('place', selectedPlace.label); // Update formData with the selected place
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Login Successful:', tokenResponse);
            try {
                await getUserProfile(tokenResponse);
            } catch (error) {
                console.error('Error getting user profile:', error);
            }
        },
        onError: (error) => console.log('Login Failed:', error),
    });



    const onGenerateTrip = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user')); // Ensure it's parsed correctly
        if (!user) {
            setOpenDialog(true);
            setLoading(false);
            return;
        }

        if (formData?.days > 5 || !formData?.place || !formData.budget || !formData.travelers) {
            toast("Please Fill All Details Properly");
            setLoading(false); // Ensure loading stops
            return;
        }

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.place)
            .replace('{days}', formData?.days)
            .replace('{travelers}', formData?.travelers)
            .replace('{budget}', formData?.budget);

        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const tripText = await result?.response?.text(); // Await text() properly
            setLoading(false);
            SaveAiTrip(tripText);  // Pass the actual text content to SaveAiTrip
        } catch (error) {
            console.error("Error in generating trip:", error);
            setLoading(false);
        }
    };


    const SaveAiTrip = async (TripData) => {
        setLoading(true);
        const docId = Date.now().toString();
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            await setDoc(doc(db, "AITrips", docId), {
                userSelection: formData,
                tripData: JSON.parse(TripData),
                userEmail: user?.email,
                id: docId
            });
            console.log("Trip data saved successfully");
            setLoading(false);
            toast.success("Trip generated and saved successfully!");
            nav('/view-trip/' + docId)
        } catch (error) {
            console.error("Error saving AI Trip:", error);
            setLoading(false);
            toast.error("Failed to save trip data. Please try again.");
        }
    };


    const getUserProfile = async (tokenResponse) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json'
                    }
                }
            );
            console.log("User profile response:", response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setOpenDialog(false);
            onGenerateTrip();
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Handle the error appropriately, e.g., show an error message to the user
        }
    };
    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏡</h2>
            <p className='text-gray-500 mt-3 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className='mt-20 flex flex-col gap-10'>
                <div>
                    <h2 className='text-xl my-3 font-medium'>What is your destination?</h2>
                    <Search onPlaceSelect={handlePlaceSelect} /> {/* Pass handlePlaceSelect */}
                    {formData.place && <p>Selected Destination: {formData.place}</p>}
                </div>

                <div>
                    <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
                    <Input
                        type="number"
                        value={formData.days}
                        onChange={(e) => {
                            const value = e.target.value;

                            // Prevent negative or non-numeric input
                            if (value === '' || (Number(value) >= 1 && Number(value) <= 30)) {
                                handleInputChange('days', value);
                            }
                        }}
                        placeholder="Ex. 3 (between 1-30)"
                        className="w-full border p-2 rounded"
                        min="1"  // Ensure minimum value is 1
                        max="30" // Maximum of 30 days
                    />

                </div>


                <div>
                    <h2 className='text-xl my-3 font-medium'>What is your Budget?</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'>
                        {
                            SelectBudgetOptions.map((item, index) => (
                                <div key={index} className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData.budget === item.title && 'shadow-lg border-black'}`}
                                    onClick={() => handleInputChange('budget', item.title)} >
                                    <h2 className='text-4xl'>{item.icon}</h2>
                                    <h2 className='font-bold text-lg'>{item.title}</h2>
                                    <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div>
                    <h2 className='text-xl my-3 font-medium'>Who do you plan traveling with on your next adventure?</h2>
                    <div className='grid grid-cols-3 gap-5 mt-5'>
                        {
                            SelectTravelesList.map((item, index) => (
                                <div key={index} className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData.travelers === item.title && 'shadow-lg border-black'}`}
                                    onClick={() => handleInputChange('travelers', item.title)} >
                                    <h2 className='text-4xl'>{item.icon}</h2>
                                    <h2 className='font-bold text-lg'>{item.title}</h2>
                                    <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='my-10 flex justify-end'>
                <Button disabled={loading} onClick={onGenerateTrip} >{loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : <>Generate Trip</>}</Button>
            </div>
            <Dialog open={openDialog}>

                <DialogContent>
                    <DialogHeader>

                        <DialogDescription>
                            <img src="./logo.svg" alt="" />
                            <h2 className='font-bold text-lg mt-7 '>Sign with Google</h2>
                            <p>Sign in to the App with Google Authentication Security</p>
                            <Button disabled={loading} className='w-full  mt-5' onClick={login}><FcGoogle className='h-7 w-7 p-1' />
                                Sign In With Google</Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default CreateTrip;
