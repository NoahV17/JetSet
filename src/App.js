import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Header from './Header';
import IntroSection from './IntroSection';
import CurrencyExchange from './CurrencyExchange';
import CurrencyConverter from './CurrencyConverter';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroSection />} />
        {/* <Route path="/budget-planner" element={<CurrencyExchange />} /> */}
        <Route path="/budget-planner" element={<PrivateRoute element={<CurrencyExchange />} />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;