// src/components/pages/Login.js
import React, { useState } from 'react';
import api from '../../services/api';

const Login = ({ setToken, addAlert }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const endpoint = isRegistering ? '/register' : '/login';
        const payload = isRegistering ? { username, password, email } : { username, password };
        try {
            const res = await api.post(endpoint, payload);
            if (!res.data || typeof res.data !== 'object' || !res.data.token) {
                throw new Error('Invalid response from server: ' + JSON.stringify(res.data));
            }
            const token = res.data.token;
            setToken(token);
            localStorage.setItem('token', token);
            setUsername('');
            setPassword('');
            setEmail('');
            setIsRegistering(false);
            addAlert(`${isRegistering ? 'Registered' : 'Logged in'} successfully!`, 'success');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Authentication failed—check credentials or try again';
            console.error('Auth failed:', errorMsg);
            setError(errorMsg);
            addAlert(errorMsg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="x-login-container">
            <div className="x-login-header">
                <h1>Fairway Boss</h1>
            </div>
            <div className="x-login-form-container">
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="x-login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    {isRegistering && (
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                    )}
                    <button type="submit" className="x-login-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : (isRegistering ? 'Sign up' : 'Log in')}
                    </button>
                </form>
                <div className="x-login-toggle">
                    <p>
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={() => setIsRegistering(!isRegistering)} className="x-toggle-btn" disabled={isSubmitting}>
                            {isRegistering ? 'Log in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
