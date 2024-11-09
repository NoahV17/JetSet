import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
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
      <h2>Login to JetSet</h2>
      <form onSubmit={handleLogin}>
        <input type="email" ref={emailRef} required placeholder="Email" />
        <input type="password" ref={passwordRef} required placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;