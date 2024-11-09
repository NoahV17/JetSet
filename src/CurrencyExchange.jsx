import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './CurrencyExchange.css';
import { FaTrash } from 'react-icons/fa';

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
  const [items, setItems] = useState([{ name: '', homeCost: '', destinationCost: '', quantity: 1, currencyOption: 'from' }]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [trips, setTrips] = useState(() => {
    try {
      return JSON.parse(Cookies.get('trips')) || [];
    } catch (e) {
      return [];
    }
  });
  const [activeTripIndex, setActiveTripIndex] = useState(-1); // -1 indicates no selected trip
  const [newTripName, setNewTripName] = useState('');
  const [newTripBudget, setNewTripBudget] = useState('');
  const [newTripHomeCurrency, setNewTripHomeCurrency] = useState('USD');
  const [newTripDestinationCurrency, setNewTripDestinationCurrency] = useState('USD');

  useEffect(() => {
    if (activeTripIndex >= 0) {
      const activeTrip = trips[activeTripIndex];
      if (activeTrip.budget) {
        convertCurrency(activeTrip.budget, activeTrip.homeCurrency, activeTrip.destinationCurrency).then(convertedBudget => {
          const newTrips = [...trips];
          newTrips[activeTripIndex].convertedBudget = convertedBudget;
          setTrips(newTrips);
        });
      }
    }
  }, [trips, activeTripIndex]);

  useEffect(() => {
    Cookies.set('trips', JSON.stringify(trips), { expires: 3650, path: '' });
  }, [trips]);

  const handleBudgetChange = (e) => {
    const newBudget = e.target.value;
    updateTrip(activeTripIndex, { budget: newBudget });
  };

  const handleHomeCurrencyChange = (e) => {
    updateTrip(activeTripIndex, { homeCurrency: e.target.value });
  };

  const handleDestinationCurrencyChange = (e) => {
    updateTrip(activeTripIndex, { destinationCurrency: e.target.value });
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

    if ((field === 'homeCost' || field === 'currency') && newItems[index].homeCost) {
      const cost = newItems[index].homeCost;
      const itemCurrency = newItems[index].currency || trips[activeTripIndex]?.homeCurrency || 'USD';
      newItems[index].destinationCost = await convertCurrency(
        cost,
        itemCurrency,
        trips[activeTripIndex]?.destinationCurrency || 'USD'
      );
    }

    setItems(newItems);
    if (activeTripIndex >= 0) {
      updateTrip(activeTripIndex, { items: newItems });
    }
    calculateTotalExpenses(newItems);
  };

  const handleQuantityChange = (index, delta) => {
    const newItems = [...items];
    const newQuantity = Math.max(1, (newItems[index].quantity || 1) + delta);
    newItems[index].quantity = newQuantity;
    setItems(newItems);
    if (activeTripIndex >= 0) {
      updateTrip(activeTripIndex, { items: newItems });
    }
    calculateTotalExpenses(newItems);
  };

  const addItem = () => {
    const newItems = [...items, { name: '', homeCost: '', destinationCost: '', quantity: 1, currencyOption: 'from' }];
    setItems(newItems);
    if (activeTripIndex >= 0) {
      updateTrip(activeTripIndex, { items: newItems });
    }
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      if (activeTripIndex >= 0) {
        updateTrip(activeTripIndex, { items: newItems });
      }
      calculateTotalExpenses(newItems);
    }
  };

  const calculateTotalExpenses = (items) => {
    const total = items.reduce((sum, item) => {
      const cost = parseFloat(item.homeCost || 0);
      const quantity = parseInt(item.quantity || 1, 10);
      return sum + cost * quantity;
    }, 0);
    setTotalExpenses(total);
  };

  const addTrip = () => {
    const newTrip = {
      name: newTripName,
      items: [{ name: '', homeCost: '', destinationCost: '', quantity: 1, currencyOption: 'from' }],
      budget: newTripBudget,
      homeCurrency: newTripHomeCurrency,
      destinationCurrency: newTripDestinationCurrency
    };
    const newTrips = [...trips, newTrip];
    setTrips(newTrips);
    setActiveTripIndex(newTrips.length - 1);
    setNewTripName('');
    setNewTripBudget('');
    setNewTripHomeCurrency('USD');
    setNewTripDestinationCurrency('USD');
  };

  const removeTrip = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this trip?');
    if (confirmDelete) {
      const newTrips = trips.filter((_, i) => i !== index);
      setTrips(newTrips);
      if (newTrips.length === 0) {
        setActiveTripIndex(-1);
      } else if (index <= activeTripIndex && activeTripIndex > 0) {
        setActiveTripIndex(activeTripIndex - 1);
      }
    }
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
    if (index >= 0) {
      const activeTrip = trips[index];
      setItems(activeTrip.items);
    } else {
      setItems([{ name: '', homeCost: '', destinationCost: '', quantity: 1, currencyOption: 'from' }]);
    }
  };

  const handleCurrencyOptionChange = (index, option) => {
    const newItems = [...items];
    newItems[index].currencyOption = option;
    if (option === 'from') {
      newItems[index].currency = trips[activeTripIndex].homeCurrency;
    } else if (option === 'to') {
      newItems[index].currency = trips[activeTripIndex].destinationCurrency;
    }
    setItems(newItems);
    updateTrip(activeTripIndex, { items: newItems });
    calculateTotalExpenses(newItems);
  };

  return (
    <div className="currency-exchange">
      <h2>Budget Planner</h2>
      <div className="trip-selector">
        <label>
          Select Trip:
          <select value={activeTripIndex} onChange={(e) => switchTrip(parseInt(e.target.value))}>
            <option value={-1}>No Selected Trip</option>
            {trips.map((trip, index) => (
              <option key={index} value={index}>
                {trip.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {activeTripIndex === -1 ? (
        <div className="add-trip-form">
          <h3>Add New Trip</h3>
          <label>
            Trip Name:
            <input type="text" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} />
          </label>
          <label>
            Budget:
            <input type="number" value={newTripBudget} onChange={(e) => setNewTripBudget(e.target.value)} />
          </label>
          <label>
            Home Currency:
            <select value={newTripHomeCurrency} onChange={(e) => setNewTripHomeCurrency(e.target.value)}>
              {countries.map((country) => (
                <option key={country.currency} value={country.currency}>
                  {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </label>
          <label>
            Destination Currency:
            <select value={newTripDestinationCurrency} onChange={(e) => setNewTripDestinationCurrency(e.target.value)}>
              {countries.map((country) => (
                <option key={country.currency} value={country.currency}>
                  {country.name} ({country.currency})
                </option>
              ))}
            </select>
          </label>
          <button onClick={addTrip}>Add Trip</button>
        </div>
      ) : (
        <div className="expenses-container">
          <div className="budget-section">
            <label>
              Budget:
              <input type="number" value={trips[activeTripIndex].budget} onChange={handleBudgetChange} />
            </label>
            <label>
              Home Currency:
              <select value={trips[activeTripIndex].homeCurrency} onChange={handleHomeCurrencyChange}>
                {countries.map((country) => (
                  <option key={country.currency} value={country.currency}>
                    {country.name} ({country.currency})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Destination Currency:
              <select value={trips[activeTripIndex].destinationCurrency} onChange={handleDestinationCurrencyChange}>
                {countries.map((country) => (
                  <option key={country.currency} value={country.currency}>
                    {country.name} ({country.currency})
                  </option>
                ))}
              </select>
            </label>
            <p>Converted Budget: {trips[activeTripIndex].convertedBudget} {trips[activeTripIndex].destinationCurrency}</p>
          </div>
          <h3>Expenses</h3>
          <div className="expenses-header">
            <span>Item</span>
            <span>Home Currency Cost</span>
            <span>Destination Currency Cost</span>
            <span>Quantity</span>
            <span>Action</span>
          </div>
          <div className="expenses-list">
            {items.map((item, index) => (
              <div key={index} className="expense-item">
                <div className="item-details">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="Item Name"
                    className="item-name-input"
                  />
                  <div className="item-cost">
                    <input
                      type="number"
                      value={item.homeCost}
                      onChange={(e) => handleItemChange(index, 'homeCost', e.target.value)}
                      placeholder="Unit Cost"
                      className="item-cost-input"
                    />
                    <div className="currency-toggle">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={item.currencyOption === 'to'}
                          onChange={() => handleCurrencyOptionChange(index, item.currencyOption === 'from' ? 'to' : 'from')}
                        />
                        <span className="slider round">
                          {item.currencyOption === 'from' ? `${trips[activeTripIndex]?.homeCurrency || 'USD'}` : `${trips[activeTripIndex]?.destinationCurrency || 'USD'}`}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="item-controls">
                  <button className="remove-item-button" onClick={() => removeItem(index)}>
                    <FaTrash />
                  </button>
                  <div className="item-quantity">
                    <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                  </div>
                </div>
                <div className="item-total">
                  {(
                    parseFloat(item.homeCost || 0) * parseInt(item.quantity || 1, 10)
                  ).toFixed(2)}{' '}
                  {item.currency || trips[activeTripIndex]?.homeCurrency || 'USD'}
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem}>Add Item</button>
        </div>
      )}
      {activeTripIndex !== -1 && (
        <>
          <h3>Total Expenses: {totalExpenses.toFixed(2)} {trips[activeTripIndex].homeCurrency}</h3>
          <h3>Remaining Budget: {(trips[activeTripIndex].budget - totalExpenses).toFixed(2)}{' '}
            {trips[activeTripIndex].homeCurrency}
          </h3>
        </>
      )}
    </div>
  );
}

export default CurrencyExchange;