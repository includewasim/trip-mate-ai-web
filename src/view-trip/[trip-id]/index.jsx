import { db } from '@/service/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Information from '../components/Information'
import Hotel from '../components/Hotel'
import PlacesToVisit from '../components/PlacesToVisit'
import Footer from '../components/Footer'

function ViewTrip() {
    const { tripId } = useParams()
    const [trip, setTrip] = useState([])
    useEffect(() => {
        tripId && getTripData()
    }, [tripId])
    const getTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log(docSnap.data())
            setTrip(docSnap.data())
        }
        else {
            console.log('No such document exists')
        }
    }
    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
            <Information trip={trip} />
            <Hotel trip={trip} />
            <PlacesToVisit trip={trip} />
            <Footer trip={trip} />
        </div>
    )

}

export default ViewTrip