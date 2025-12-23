import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AdminDashboard from './components/AdminDashboard';
import RoomDetail from './components/RoomDetail';
import LoginPage from './components/LoginPage';
import ManageRooms from './components/ManageRooms';
import ManageBookings from './components/ManageBookings';
import ManageDepartments from './components/ManageDepartments';
import ManageBuildings from './components/ManageBuildings';
import ManageEquipment from './components/ManageEquipment';
import { initialRooms, initialBookings, departments as initialDepartments, buildings as initialBuildings, equipment as initialEquipment } from './data/initialData';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [rooms, setRooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  
  // ✅ เพิ่ม state สำหรับ departments, buildings, equipment
  const [departments, setDepartments] = useState(initialDepartments);
  const [buildings, setBuildings] = useState(initialBuildings);
  const [equipment, setEquipment] = useState(initialEquipment);

  // หน้า Login แยกออกมาต่างหาก
  if (currentPage === 'login') {
    return (
      <LoginPage 
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // หน้าหลักของแอป
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && (
          <HomePage 
            rooms={rooms}
            setSelectedRoom={setSelectedRoom}
            setCurrentPage={setCurrentPage}
            bookings={bookings}
            setBookings={setBookings}
          />
        )}
        
        {currentPage === 'admin' && isLoggedIn && (
          <AdminDashboard 
            bookings={bookings}
            rooms={rooms}
            departments={departments}
            equipment={equipment}
            setCurrentPage={setCurrentPage}
          />
        )}
        
        {currentPage === 'room-detail' && (
          <RoomDetail
            selectedRoom={selectedRoom}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            bookings={bookings}
            setBookings={setBookings}
            departments={departments}
            setCurrentPage={setCurrentPage}
            currentUser={currentUser}
          />
        )}
        
        {currentPage === 'manage-rooms' && isLoggedIn && (
          <ManageRooms 
            rooms={rooms}
            setRooms={setRooms}
          />
        )}
        
        {currentPage === 'manage-bookings' && isLoggedIn && (
          <ManageBookings 
            bookings={bookings}
            setBookings={setBookings}
            rooms={rooms}
          />
        )}
        
        {/* ✅ เพิ่ม setDepartments */}
        {currentPage === 'manage-departments' && isLoggedIn && (
          <ManageDepartments 
            departments={departments}
            setDepartments={setDepartments}
          />
        )}
        
        {/* ✅ เพิ่ม setBuildings */}
        {currentPage === 'manage-buildings' && isLoggedIn && (
          <ManageBuildings 
            buildings={buildings}
            setBuildings={setBuildings}
          />
        )}
        
        {/* ✅ เพิ่ม setEquipment */}
        {currentPage === 'manage-equipment' && isLoggedIn && (
          <ManageEquipment 
            equipment={equipment}
            setEquipment={setEquipment}
          />
        )}
      </div>
    </div>
  );
};

export default App;