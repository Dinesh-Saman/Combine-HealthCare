import React from 'react';
import { Box, Typography, IconButton } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications'; 
import logo from '../Images/logo.png'; 
import userAvatar from '../Images/profile.png'; 
import './header.css'; 

const Header = () => {
  return (
    <Box className="guest_header">
      <Box className="logo-section">
        <img src={logo} alt="Logo" className="logo" />
      </Box>
      <Box className="title">
        <Typography variant="h5">
          Welcome to Hotel Breet's Garden
        </Typography>
      </Box>
      <Box className="user-section">
        <Typography variant="body1" className="user-name">
          Lucia Tayler
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <img src={userAvatar} alt="User Avatar" className="user-avatar" />
      </Box>
    </Box>
  );
};

export default Header;
