import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='my-7'>
            <Link to={'/create-trip'}>
                <Button>Back</Button>
            </Link>
            <h2 className='text-lg font-bold text-gray-700 text-center'>
                Copyrights © Wasim Khan 2024
            </h2>
        </div>
    )
}

export default Footer