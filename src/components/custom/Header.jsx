import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { googleLogout } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Header() {
    const [users, setUsers] = useState(null); // useState instead of directly using localStorage
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUsers(JSON.parse(storedUser)); // Set the users state with data from localStorage
        }
    }, []);

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

    const getUserProfile = async (tokenResponse) => {
        try {
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                        Accept: 'application/json',
                    },
                }
            );
            console.log("User profile response:", response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setUsers(response.data); // Set users state without reloading the page
            setOpenDialog(false);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    return (
        <div className='p-3 shadow-sm flex justify-between items-center px-5'>
            <img src="/logo.svg" alt="App Logo" />
            <div>
                {users ? (
                    <div className={'flex items-center gap-5'}>
                        <a href='/create-trip'>
                            <Button variant='outline' className={'rounded-full'} >+ Create Trip</Button>
                        </a>
                        <a href='/my-trips'>
                            <Button variant='outline' className={'rounded-full'} >My Trips</Button>
                        </a>
                        <Popover>
                            <PopoverTrigger>
                                <img src={users?.picture || '/default-profile.png'} alt="User Profile" className='h-[35px] w-[35px] rounded-full' />
                            </PopoverTrigger>
                            <PopoverContent>
                                <Button variant='outline'
                                    className='mt-2'
                                    onClick={() => {
                                        googleLogout();
                                        localStorage.clear();
                                        setUsers(null); // Clear users state without reloading the page
                                    }}
                                >
                                    Logout
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
                )}
            </div>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src="./logo.svg" alt="App Logo" />
                            <h2 className='font-bold text-lg mt-7'>Sign in with Google</h2>
                            <p>Sign in to the App with Google Authentication Security</p>
                            <Button disabled={loading} className='w-full mt-5 flex gap-4 items-center' onClick={login}>
                                <FcGoogle className='h-7 w-7 p-1' /> Sign In With Google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Header;
