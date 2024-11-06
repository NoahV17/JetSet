import React from 'react';
import './TripSelector.css';

function TripSelector({ trips, activeTripIndex, switchTrip }) {
  return (
    <div className="trip-selector">
      <div className="scrollable-container">
        {trips.map((trip, index) => (
          <div
            key={index}
            className={`trip-thumb ${index === activeTripIndex ? 'active' : ''}`}
            onClick={() => switchTrip(index)}
          >
            {trip.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripSelector;