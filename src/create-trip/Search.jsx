import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const Search = ({ onPlaceSelect }) => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (value.length > 2) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
                .then((response) => response.json())
                .then((data) => {
                    setSuggestions(data.slice(0, 3).map((item) => ({
                        value: item.place_id,
                        label: item.display_name,
                    })));
                });
        } else {
            setSuggestions([]);
        }
    }, [value]);

    const handleSelectPlace = (place) => {
        setValue(place.label);
        setSuggestions([]);
        onPlaceSelect(place); // Notify parent about the selected place
    };

    return (
        <div className="w-full">
            <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search for a place..."
                className="w-full"
            />
            {suggestions.length > 0 && (
                <ul className="border border-gray-300 mt-2 max-h-40 overflow-auto">
                    {suggestions.map((place) => (
                        <li
                            key={place.value}
                            onClick={() => handleSelectPlace(place)}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                        >
                            {place.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
