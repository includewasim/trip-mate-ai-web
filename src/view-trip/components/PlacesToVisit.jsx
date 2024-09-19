import React from 'react'
import PlaceCardItem from './PlaceCardItem'

const PlacesToVisit = ({ trip }) => {
    return (
        <div>
            <h2 className='font-bold text-lg '>PlacesToVisit</h2>

            <div >
                {trip?.tripData?.itinerary.map((item, index) => (
                    <div key={index} className='mt-5'>
                        <h2 className='text-lg font-bold'>{item.day}</h2>
                        <div className='grid  sm:grid-cols-1 md:grid-cols-2  gap-5'>
                            {item?.plan?.map((planItem, planIndex) => (
                                <div key={planIndex}>
                                    <h2 className='font-medium text-sm text-orange-600'>{planItem.time}</h2>
                                    <div className='my-3'>
                                        <PlaceCardItem planItem={planItem} />
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default PlacesToVisit