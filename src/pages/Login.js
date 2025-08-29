import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, APP_LOGO, APP_PREFIX_PATH } from '../config/AppConfig'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';



const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({}); // Use an object to store multiple error messages
    const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password

    // Load saved email and password from localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
    }, []);

    const handleChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);

        if (value.length > 50) {
            setErrors(prev => ({ ...prev, email: 'Email cannot be more than 50 characters' }));
        } else if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setErrors(prev => ({ ...prev, email: 'Email address is not correct' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handleChangePassword = (e) => {
        const { value } = e.target;
        setPassword(value);

        if (value.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password cannot be less than 6 characters' }));
        } else if (value.length > 16) {
            setErrors(prev => ({ ...prev, password: 'Password cannot be more than 16 characters' }));
        } else {
            setErrors(prev => ({ ...prev, password: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'Please enter an email' }));
        }
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'Please enter a password' }));
        }
        if (!email || !password) return;

        try {
            const response = await axios.post(`${API_URL}/admin_login`, {
                email: email,
                password: password
            });

            if (response.data.key === "emailNotCorrect") {
                setErrors(prev => ({ ...prev, email: response.data.msg }));
            } else if (response.data.key === "passwordNotCorrect") {
                setErrors(prev => ({ ...prev, password: response.data.msg }));
            } else if (response.data.success) {
                const user = response.data.info[0];

                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('id', user.user_id);
                sessionStorage.setItem('name', user.username);
                sessionStorage.setItem('email', user.email);
                sessionStorage.setItem('user_type', user.user_type);
                // sessionStorage.setItem('expirationTime', expirationTime);

                const sessionDuration = 30 * 60 * 1000; 
                const expirationTime = new Date().getTime() + sessionDuration;
                sessionStorage.setItem('expirationTime', expirationTime);

                if (rememberMe) {
                    sessionStorage.setItem('rememberMeemail', email);
                    sessionStorage.setItem('rememberMepassword', password);
                } else {
                    sessionStorage.removeItem('rememberMeemail');
                    sessionStorage.removeItem('rememberMepassword');
                }
                navigate(`/${APP_PREFIX_PATH}/dashboard`);
            } else {
                console.error("Unexpected response structure:", response.data);
            }
        } catch (error) {
            console.error("Login request failed:", error);
            setErrors(prev => ({ ...prev, email: "An error occurred while logging in. Please try again later." }));
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="card" style={{ width: '450px', borderRadius: '16px' }}>

                <div className="card-body">
                    <h5 className="card-title text-center">
                        <img src={APP_LOGO} alt="Login" style={{ width: '150px' }} className='mb-1 mt-2' /><br />
                        Login
                    </h5>
                    <form onSubmit={handleSubmit} className='login-form'>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                value={email} 
                                placeholder='Enter Email'
                                onChange={handleChangeEmail}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-3 ">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                value={password}
                                placeholder='Enter Password'
                                onChange={handleChangePassword}
                            />
                            <div style={{ position: "relative" }}>
                                {showPassword ? (
                                    <FaEyeSlash onClick={() => setShowPassword(false)} style={{ cursor: 'pointer', position: 'absolute', right: '26px', top: '-27px' }} />
                                ) : (
                                    <FaEye onClick={() => setShowPassword(true)} style={{ cursor: 'pointer', position: 'absolute', right: '26px', top: '-27px' }} />
                                )}
                            </div>
                            {errors.password &&
                                <div className="invalid-feedback">{errors.password}</div>
                            }


                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />

                            <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                        </div>
                        <button type="submit" className=" btn-primary w-100">Login</button>
                    </form>
                    <div className="mt-3 text-center">
                        <Link to={`/${APP_PREFIX_PATH}/forgot-password`}>Forgot Password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
