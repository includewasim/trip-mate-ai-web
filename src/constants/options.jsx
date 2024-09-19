export const SelectTravelesList = [
    {
        id: 1,
        title: ' Just Me',
        desc: 'A sole traveler in exploration',
        icon: '✈︎',
        people: '1'
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two traveles in tandem',
        icon: '🥂',
        people: '2 People'
    },
    {
        id: 3,
        title: 'Family',
        desc: 'Travel with your family and friends',
        icon: '🏡',
        people: '3 to 5 People'
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'Travel with your friends',
        icon: '🛳️',
        people: '5 to 10 People'
    }
]

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
    {
        id: 2,
        title: 'Moderate',
        desc: 'Stay on budget',
        icon: '💰',
    },
    {
        id: 3,
        title: 'Expensive',
        desc: '',
        icon: '💸',
    }
]

export const AI_PROMPT = 'Generate Travel Plan for Location: {location} for {days} Days for {travelers} travelers with a budget of {budget}. Give me a hotel options list with Hotel name, Hotel address, price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with place name, place details, place image url, geo coordinates, ticket pricing, rating, time travel each of the location for 3 days with each day plan with best time to visit in JSON format'