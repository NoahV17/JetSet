import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroSection.css';

function IntroSection() {
  const navigate = useNavigate();
  const introRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (introRef.current) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        introRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, #ffafbd, #ffc3a0)`;
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 0 && arrowRef.current) {
        arrowRef.current.style.display = 'none';
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="intro-section" className="intro-section" ref={introRef}>
      <h1>Welcome to JetSet</h1>
      <p>Plan your trips and manage your budget efficiently.</p>
      <div className="intro-buttons">
        <button onClick={() => navigate('/currency-converter')}>Currency Converter</button>
        <button onClick={() => navigate('/budget-planner')}>Budget Planner</button>
      </div>
      <div className="scroll-arrow" ref={arrowRef}>
        <span>&#x2193;</span>
      </div>
      <div className="registration-prompt">
        <h2>New to JetSet?</h2>
        <p>
          <button onClick={() => navigate('/signup')}>Register to save your trip!</button>
        </p>
      </div>
      <div className='features'>
        <h2>Features:</h2>
        <ul>
          <li>Plan your budget for your next trip</li>
          <li>Convert currency of different countries</li>
        </ul>
      </div>
    </div>
  );
}

export default IntroSection;