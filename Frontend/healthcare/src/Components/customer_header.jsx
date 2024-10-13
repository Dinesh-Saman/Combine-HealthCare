import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const CusHeader = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [id, setUserId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log(token);

                const { email, exp } = decodedToken;
                const id = decodedToken.id;

                if (exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                } else {
                    setUsername('Dear User');
                    setEmail(email);
                    setUserId(id);
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleProtectedNavigation = (path) => {
        if (username && email) {
            navigate(path);
        } else {
            localStorage.setItem('redirectAfterLogin', path);
            navigate('/login');
        }
    };

    const handleLoginNavigation = () => {
        if (username && email) {
            navigate('/make-appointment'); 
        } else {
            navigate('/login');
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleManageProfile = () => {
        navigate(`/manage-profile/${id}`, {
            state: { username, email } 
        });
        setIsDropdownOpen(false);
    };
    

    return (
        <nav style={styles.headerNav}>
            <div style={styles.headerContainer}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png" alt="Logo" style={styles.headerLogo} />

                <div style={styles.headerLinks}>
                    <a href="/" style={styles.link}>Home</a>
                    <span style={styles.link} onClick={() => handleProtectedNavigation('/make-appointment')}>Appointments</span>
                    <span style={styles.link} onClick={() => handleProtectedNavigation('/view-articles')}>Education Resources</span>
                    <a href="/view-services" style={styles.link}>Services</a>
                    <a href="/about-us" style={styles.link}>About Us</a>
                    <a href="/add-ticket" style={styles.link}>Contact Us</a>
                </div>

                <div style={styles.headerAuth}>
                    {username && email ? (
                        <>
                            <span style={styles.headerProfile} onClick={toggleDropdown}>
                                <FontAwesomeIcon icon={faUserCircle} size="lg" />
                            </span>
                            <span style={styles.headerUsername}>Hello, {username}</span>
                            {isDropdownOpen && (
                                <div style={styles.dropdownMenu}>
                                    <span onClick={handleManageProfile} style={styles.dropdownItem}>Manage Profile</span>
                                    <span onClick={handleLogout} style={styles.dropdownItem}>Logout</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <span onClick={handleLoginNavigation} style={styles.headerLogin}>Login</span>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    headerNav: {
        backgroundColor: '#002244',
        padding: '10px',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLogo: {
        height: '70px',
    },
    headerLinks: {
        display: 'flex',
        gap: '40px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '17px',
        cursor: 'pointer',
    },
    headerAuth: {
        display: 'flex',
        alignItems: 'center',
    },
    headerUsername: {
        color: 'yellow',
        marginRight: '10px',
    },
    headerProfile: {
        cursor: 'pointer',
        color: 'white',
        marginRight:'10px'
    },
    dropdownMenu: {
        position: 'absolute',
        backgroundColor: '#34495e',
        color: 'white',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginTop: '100px',
        zIndex: 1000,  // Add a higher z-index value
    },
    dropdownItem: {
        padding: '8px',
        cursor: 'pointer',
        display: 'block',
        zIndex: 1000,  // Add a higher z-index value
        position: 'relative',  // Ensure the position is relative or absolute
    },
    
    dropdownItemHover: {
        backgroundColor: '#2c3e50',
    },
    headerLogin: {
        color: 'yellow',
        cursor: 'pointer',
        marginRight: '10px'
    },
};

export default CusHeader;
