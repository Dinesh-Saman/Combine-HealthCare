import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import for Router
import HomePage from './Pages/Guest/homepage';
import Footer from './Components/customer_footer'
import Header from './Components/customer_header'

// Appointment Pages
import AddAppointment from './Pages/Appointment/MakeAppointment';
import ViewAppointments from './Pages/Appointment/ViewAppointments';
import AppointmentReport from './Pages/Appointment/AppointmentReport';

// Doctor Pages
import AddDoctor from './Pages/Doctor/AddDoctor';
import ViewDoctors from './Pages/Doctor/ViewDoctor';
import UpdateDoctor from './Pages/Doctor/UpdateDoctor';
import UpdateAppointment from './Pages/Appointment/UpdateAppointment';
import AddArticle from './Pages/Resource/AddResource';
import ViewResources from './Pages/Resource/ViewResource';
import UpdateResource from './Pages/Resource/UpdateResource';
import ResourceReportPage from './Pages/Resource/ResourceReport';
import ViewArticles from './Pages/Resource/ViewArticles';
import SingleArticlePage from './Pages/Resource/ViewSingleArticle';
import LoginForm from './Pages/User/login';
import RegisterForm from './Pages/User/register';
import AddTicket from './Pages/Tickets/AddTicket';
import ViewTickets from './Pages/Tickets/ViewTickets';
import UpdateTicket from './Pages/Tickets/UpdateTicket';
import AddInventory from './Pages/Inventory/AddInventory';
import ViewInventory from './Pages/Inventory/ViewInventory';
import UpdateInventory from './Pages/Inventory/UpdateInventory';
import ManageProfileForm from './Pages/User/ManageProfile';
     
function App() {
  return (

      <div>
        <Header></Header>
        <Routes>
          {/* Dashboard and Home Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Appointment Routes */}
          <Route path="/make-appointment" element={<AddAppointment />} /> 
          <Route path="/view-appointments" element={<ViewAppointments />} />
          <Route path="/appointment-report" element={<AppointmentReport />} />
          <Route path="/update-appointment/:id" element={<UpdateAppointment />} />

          {/* Doctor Routes */}
          <Route path="/add-doctor" element={<AddDoctor />} /> 
          <Route path="/view-doctors" element={<ViewDoctors />} /> 
          <Route path="/update-doctor/:id" element={<UpdateDoctor />} /> 

          {/* Resource Routes */}
          <Route path="/add-resource" element={<AddArticle />} /> 
          <Route path="/view-resources" element={<ViewResources />} /> 
          <Route path="/update-resource/:id" element={<UpdateResource />} /> 
          <Route path="/resource-report" element={<ResourceReportPage />} /> 
          <Route path="/view-articles" element={<ViewArticles/>} /> 
          <Route path="/view-articles/:id" element={<SingleArticlePage/>} /> 

          {/* User Routes */}
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/manage-profile/:id" element={<ManageProfileForm/>} /> 

          <Route path="/add-ticket" element={<AddTicket />} />
          <Route path="/view-ticket" element={<ViewTickets />} />
          <Route path="/update-ticket/:id" element={<UpdateTicket />} />

          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/view-inventory" element={<ViewInventory />} />
          <Route path="/update-inventory/:id" element={<UpdateInventory />} />
          
        </Routes>
        <Footer></Footer>
      </div>

  );
}

export default App;
