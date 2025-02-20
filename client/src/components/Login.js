import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setUserId }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState(''); // For register

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? '/register' : '/login';
        const payload = isRegistering ? { username, password, email } : { username, password };
        try {
            const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
            setToken(res.data.token);
            setUserId(res.data.userId);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
        } catch (err) {
            console.error('Auth failed:', err.response?.data || err.message);
            alert('Auth failed—check credentials or username might be taken');
        }
    };

    return (
        <div className="x-login-container">
            <div className="x-login-header">
                <h1>Fairway Boss</h1>
            </div>
            <div className="x-login-form-container">
                <form onSubmit={handleSubmit} className="x-login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isRegistering && (
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}
                    <button type="submit" className="x-login-btn">
                        {isRegistering ? 'Sign up' : 'Log in'}
                    </button>
                </form>
                <div className="x-login-toggle">
                    <p>
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="x-toggle-btn"
                        >
                            {isRegistering ? 'Log in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;