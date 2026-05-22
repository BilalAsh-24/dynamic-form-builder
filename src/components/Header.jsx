import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <header className="app-header">
            <div className="container">
                <div className="header-content">
                    <div className="header-left">
                        <Link to="/dashboard" className="logo">
                            📋 FormBuilder
                        </Link>
                        <nav className="nav-links">
                            <Link
                                to="/dashboard"
                                className={location.pathname === '/dashboard' ? 'active' : ''}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/create"
                                className={location.pathname === '/create' ? 'active' : ''}
                            >
                                Create Form
                            </Link>
                        </nav>
                    </div>

                    <div className="header-right">
                        <div className="user-info">
                            <span className="user-icon">👤</span>
                            <span className="user-name">{user?.name}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
