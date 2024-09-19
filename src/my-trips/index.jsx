import { db } from '@/service/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigation } from 'react-router-dom'
import UserTripCardItem from './UserTripCardItem'
import { Button } from '@/components/ui/button'
const MyTrips = () => {
    const navigation = useNavigation()
    const [userTrips, setUserTrips] = useState([])

    useEffect(() => {
        getUserTrips()
    }, [])

    /*
    All Trips
    */
    const getUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user) {
            navigation('/')
            return
        }

        setUserTrips([]) // Clear previous state

        // Collect data in a local array first
        const trips = []
        const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email))
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data())
            trips.push(doc.data()) // Push data to local array
        })

        // Update state once with the final array
        setUserTrips(trips)
    }

    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h2 className='font-bold text-3xl'>My Trips</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-2 '>
                {userTrips?.length > 0 ? userTrips.map((trip, index) => (
                    <UserTripCardItem key={index} trip={trip} />
                )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
                    <div key={index} className='h-[250px] w-full bg-slate-200 animate-pulse rounded-xl'>
                    </div>
                ))}
            </div>
            <div className={'mt-10'}>
                <Link to={'/'}>
                    <Button  >Back</Button>
                </Link>
            </div>
        </div>
    )
}

export default MyTrips
