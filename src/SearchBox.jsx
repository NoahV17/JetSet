import React, { useState } from 'react';

function SearchBox() {
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);

  const searchCities = async () => {
    const response = await fetch(`/api/cities?name=${city}`);
    const data = await response.json();
    setResults(data.data);
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city name"
      />
      <button onClick={searchCities}>Search Cities</button>

      <ul>
        {results.map((city, index) => (
          <li key={index}>
            {city.city}, {city.country}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBox;
