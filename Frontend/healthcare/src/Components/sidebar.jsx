import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaUserMd, FaCalendarAlt, FaPlusSquare, FaChartBar, FaSignOutAlt, FaHome, FaBook } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 220px;
  height: 180vh;
  background: 
    url('https://t4.ftcdn.net/jpg/03/01/46/11/360_F_301461106_EXXsPkG6yiOPO4Lb2mGyzNjkcWIg39w7.jpg'); /* Replace with your image URL */
  background-size: cover; /* Cover the entire sidebar */
  background-position: center; /* Center the image */
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: #ecf0f1; /* Light text color */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const LogoImage = styled.img`
  width: 120px; 
  height: auto;
  margin-bottom: 10px;
`;

const LogoTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ecf0f1; 
`;

const Menu = styled.div`
  flex-grow: 1;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin: 20px 0 10px;
  color: #ecf0f1; /* Light text color */
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
  
  &:hover {
    background-color: #34495e; 
    color: #fff;
  }
`;

const Icon = styled.div`
  margin-right: 15px;
  font-size: 20px;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tenet_Health_logo.png" style={{ width: '180px' }} />
      </LogoContainer>
      <Menu>
        {/* Appointment Links */}
        <SectionTitle>Appointments</SectionTitle>
        <Link to="/view-appointments" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaCalendarAlt /></Icon>
            View Appointments
          </MenuItem>
        </Link>
        <Link to="/appointment-report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaChartBar /></Icon>
            Appointment Report
          </MenuItem>
        </Link>

        {/* Doctor Links */}
        <SectionTitle>Doctors</SectionTitle>
        <Link to="/add-doctor" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaUserMd /></Icon>
            Add Doctor
          </MenuItem>
        </Link>
        <Link to="/view-doctors" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaUserMd /></Icon>
            View Doctors
          </MenuItem>
        </Link>

        {/* Resource Links */}
        <SectionTitle>Resources</SectionTitle>
        <Link to="/add-resource" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaPlusSquare /></Icon>
            Add Resource
          </MenuItem>
        </Link>
        <Link to="/view-resources" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaBook /></Icon>
            View Resources
          </MenuItem>
        </Link>
        <Link to="/resource-report" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaChartBar /></Icon>
            Resource Report
          </MenuItem>
        </Link>

        {/* Inventory Links */}
        <SectionTitle>Inventory</SectionTitle>
        <Link to="/add-inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaUserMd /></Icon>
            Add Inventory
          </MenuItem>
        </Link>
        <Link to="/view-inventory" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaBook /></Icon>
            View Inventories
          </MenuItem>
        </Link>

        <SectionTitle>Tickets</SectionTitle>
        <Link to="/view-ticket" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaBook /></Icon>
            View Tickets
          </MenuItem>
        </Link>
        
        {/* Home Link */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem>
            <Icon><FaHome /></Icon>
            Home
          </MenuItem>
        </Link>
      </Menu>
      
      {/* Sign Out Link */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem>
          <Icon><FaSignOutAlt /></Icon>
          Sign Out
        </MenuItem>
      </Link>
    </SidebarContainer>
  );
};

export default Sidebar;
