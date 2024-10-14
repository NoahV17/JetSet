import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CurrencyExchange.css';

const countries = [
  { name: 'United States', currency: 'USD' },
  { name: 'France', currency: 'EUR' },
  { name: 'Spain', currency: 'EUR' },
  { name: 'China', currency: 'CNY' },
  { name: 'Italy', currency: 'EUR' },
  { name: 'Turkey', currency: 'TRY' },
  { name: 'Mexico', currency: 'MXN' },
  { name: 'Germany', currency: 'EUR' },
  { name: 'Thailand', currency: 'THB' },
  { name: 'United Kingdom', currency: 'GBP' },
  { name: 'Japan', currency: 'JPY' },
  { name: 'Austria', currency: 'EUR' },
  { name: 'Greece', currency: 'EUR' },
  { name: 'Russia', currency: 'RUB' },
  { name: 'Canada', currency: 'CAD' },
];

function CurrencyExchange() {
  const [budget, setBudget] = useState('');
  const [convertedBudget, setConvertedBudget] = useState('');
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [destinationCurrency, setDestinationCurrency] = useState('USD');
  const [items, setItems] = useState([{ name: '', homeCost: '', destinationCost: '' }]);
    const [totalExpenses, setTotalExpenses] = useState(0);
  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(Cookies.get('trips')) || [{ name: 'Trip 1', items: [{ name: '', homeCost: '', destinationCost: '' }], budget: '' }];
    } catch (e) {
      return [{ name: 'Trip 1', items: [{ name: '', homeCost: '', destinationCost: '' }], budget: '' }];
    }
  });
  const [activeTripIndex, setActiveTripIndex] = useState(0);
  
  useEffect(() => {
    if (budget) {
      convertCurrency(budget, homeCurrency, destinationCurrency).then(setConvertedBudget);
    }
  }, [budget, homeCurrency, destinationCurrency]);
  
  useEffect(() => {
    Cookies.set('trips', JSON.stringify(trips), { expires: 3650, path: '' });
  }, [trips]);
  
  const handleBudgetChange = (e) => {
    const newBudget = e.target.value;
    setBudget(newBudget);
    updateTrip(activeTripIndex, { budget: newBudget });
  };
  
  const handleHomeCurrencyChange = (e) => {
    setHomeCurrency(e.target.value);
  };

  const handleDestinationCurrencyChange = (e) => {
    setDestinationCurrency(e.target.value);
  };

  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/' + fromCurrency);
      const rate = response.data.rates[toCurrency];
      return (amount * rate).toFixed(2);
    } catch (error) {
      console.error('Error converting currency:', error);
      return '';
    }
  };

  const handleItemChange = async (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'homeCost' && value) {
      newItems[index].destinationCost = await convertCurrency(value, homeCurrency, destinationCurrency);
    } else if (field === 'destinationCost' && value) {
      newItems[index].homeCost = await convertCurrency(value, destinationCurrency, homeCurrency);
    }

    setItems(newItems);
    updateTrip(activeTripIndex, { items: newItems });
    calculateTotalExpenses(newItems);
  };

  const addItem = () => {
    const newItems = [...items, { name: '', homeCost: '', destinationCost: '' }];
    setItems(newItems);
    updateTrip(activeTripIndex, { items: newItems });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    updateTrip(activeTripIndex, { items: newItems });
    calculateTotalExpenses(newItems);
  };

  const calculateTotalExpenses = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.homeCost || 0), 0);
    setTotalExpenses(total);
  };

  const addTrip = () => {
    const newTrips = [...trips, { name: `Trip ${trips.length + 1}`, items: [{ name: '', homeCost: '', destinationCost: '' }], budget: '' }];
    setTrips(newTrips);
    setActiveTripIndex(newTrips.length - 1);
  };

  const removeTrip = (index) => {
    const newTrips = trips.filter((_, i) => i !== index); // Remove the selected trip
  
    // Update active trip after deletion
    if (index === activeTripIndex && newTrips.length > 0) {
      setActiveTripIndex(Math.min(index, newTrips.length - 1)); // Set active to next available trip
    } else if (newTrips.length === 0) {
      setActiveTripIndex(0); // If no trips left, reset
    }
  
    // Update the displayed items and budget
    if (newTrips.length > 0) {
      setItems(newTrips[Math.min(index, newTrips.length - 1)].items);
      setBudget(newTrips[Math.min(index, newTrips.length - 1)].budget);
    } else {
      setItems([{ name: '', homeCost: '', destinationCost: '' }]); // Reset items
      setBudget(''); // Reset budget
    }
  
    setTrips(newTrips); // Update state
  };  

  const updateTrip = (index, updatedData) => {
    const newTrips = [...trips];
    newTrips[index] = { ...newTrips[index], ...updatedData };
    setTrips(newTrips);
  };

  const handleTripNameChange = (index, name) => {
    updateTrip(index, { name });
  };

  const switchTrip = (index) => {
    setActiveTripIndex(index);
    const activeTrip = trips[index];
    setItems(activeTrip.items);
    setBudget(activeTrip.budget);
  };

  return (
    <div className="currency-exchange">
      <div className="budget-section">
        <label>
          Budget in starting currecncy:
          <input type="number" value={budget} onChange={handleBudgetChange} />
        </label>
        <label>
          Converting from
          <select value={homeCurrency} onChange={handleHomeCurrencyChange}>
            {countries.map((country) => (
              <option key={country.currency} value={country.currency}>
                {country.name} ({country.currency}) </option>
            ))}
          </select>to
          <select value={destinationCurrency} onChange={handleDestinationCurrencyChange}>
            {countries.map((country) => (
              <option key={country.currency} value={country.currency}>
                {country.name} ({country.currency})
              </option>
            ))}
          </select>
        </label>
        <p>Converted Budget: {convertedBudget} {destinationCurrency}</p>
      </div>
      <div className="trip-tabs">
        {trips.map((trip, index) => (
        <div key={index}
          className={`trip-tab ${index === activeTripIndex ? 'active' : ''}`}
          onClick={() => switchTrip(index)}
        >
        <input type="text"
          value={trip.name}
          onChange={(e) => handleTripNameChange(index, e.target.value)}
        />
        <button
          className="trip-remove-button"
          onClick={(e) => { e.stopPropagation(); removeTrip(index); }}
        >
        X
        </button>
      </div>
))}
    <button className="add-trip-button" onClick={addTrip}>+</button>

      </div>
      <div>
        <div className="expenses-container">
        <input class="trip-title" type="text" placeholder='Your trip title'></input>
        {/* <div className="expenses-list"> */}
          {items.map((item, index) => (
            <div key={index} className="expense-bar">
              <div className="expense-input">
                <input type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  placeholder="Item Name"
                />
                <input type="number"
                  value={item.homeCost}
                  onChange={(e) => handleItemChange(index, 'homeCost', e.target.value)}
                  placeholder="Home Currency Cost"
                />
                <input type="number"
                  value={item.destinationCost}
                  onChange={(e) => handleItemChange(index, 'destinationCost', e.target.value)}
                  placeholder="Destination Currency Cost"
                />
              </div>
              <button className="item-remove-button" onClick={() => removeItem(index)}>x</button>
            </div>
          ))}
          {/* </div> */}
        <button onClick={addItem}>Add Item</button>
        </div>
              

      </div>
      
      <h3>Total Expenses: {totalExpenses} {homeCurrency}</h3>
      <h3>Remaining Budget: {budget - totalExpenses} {homeCurrency}</h3>
    </div>
  );
}

export default CurrencyExchange;