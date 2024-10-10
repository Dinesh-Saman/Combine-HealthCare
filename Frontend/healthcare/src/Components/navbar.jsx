import React from 'react';
import { Box, Typography, IconButton } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import userAvatar from '../Images/profile.png';
import './header.css';

const Header = () => {
  return (
    <Box className="header" justifyContent="center" alignItems="center">
      <Box className="title">
        <Typography variant="h6" align="center">
          Appointment & Doctor Management Dashboard
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
