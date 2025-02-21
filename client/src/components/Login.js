import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setUserId, addAlert }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const endpoint = isRegistering ? '/register' : '/login'; // Relative path
        const payload = isRegistering ? { username, password, email } : { username, password };
        try {
            const res = await axios.post(endpoint, payload);
            setToken(res.data.token);
            setUserId(res.data.userId);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            // Clear form
            setUsername('');
            setPassword('');
            setEmail('');
            setIsRegistering(false);
            addAlert(`${isRegistering ? 'Registered' : 'Logged in'} successfully!`, 'success');
        } catch (err) {
            console.error('Auth failed:', err.response?.data || err.message);
            const errorMsg = err.response?.data?.error || 'Auth failed—check credentials or username might be taken';
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
                    <button
                        type="submit"
                        className="x-login-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : (isRegistering ? 'Sign up' : 'Log in')}
                    </button>
                </form>
                <div className="x-login-toggle">
                    <p>
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="x-toggle-btn"
                            disabled={isSubmitting}
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