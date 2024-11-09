import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Register to Save Your Trip</h2>
      <form onSubmit={handleSignup}>
        <input type="email" ref={emailRef} required placeholder="Email" />
        <input type="password" ref={passwordRef} required placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signup;