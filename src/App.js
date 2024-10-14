import './App.css';
import SearchBox from './SearchBox';
import CurrencyExchange from './CurrencyExchange';
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  return (
    <div className="App">
      <h1>JetSet: Travel Planner</h1>
      <CurrencyExchange />
      {/* <SearchBox /> */}
    </div>
  );
}

export default App;