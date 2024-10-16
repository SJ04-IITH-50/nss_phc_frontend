import React, { useState } from 'react';
import '../Styles/LoginPage.css';
import logo from '../nss_logo.png';

const LoginPage=()=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit=(e)=>{
    const errors = {};

    if(!email){
      errors.email = 'Email is required';
    }
    if(!password){
      errors.password = 'Password is required';
    }

    if(Object.keys(errors).length > 0){
      setErrors(errors);
      e.preventDefault();
      return;
    }

    setEmail('');
    setPassword('');
    setErrors({});
  };

  return(
    <div className='login-container'>
      <div className='title-flex'>
        <h1>Telangana PHC Login</h1>
      </div>

      <div className='form-flex'>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} placeholder='Email' onChange={(e)=>setEmail(e.target.value)} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="login-button">
            Sign In
          </button>
          <div className="forgot-password">
            <a href="">Forgot password?</a>
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>Copyright© 2024</p>
      </footer>
    </div>
  )
}

export default LoginPage;