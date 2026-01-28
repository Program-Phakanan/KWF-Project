import React, { useState, useEffect } from 'react';
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
import { fetchData } from './utils/database';
import { getSession, onAuthStateChange } from './utils/auth';
// import { initialRooms, initialBookings, departments as initialDepartments, buildings as initialBuildings, equipment as initialEquipment } from './data/initialData';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // State สำหรับข้อมูลต่างๆ (เริ่มต้นเป็น array ว่าง)
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบ Supabase session เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session } = await getSession();
        if (session?.user) {
          console.log('✅ Found existing session:', session.user.email);
          setIsLoggedIn(true);
          setCurrentUser({
            name: session.user.user_metadata?.name || session.user.email,
            role: 'admin',
            email: session.user.email,
            id: session.user.id
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    // ติดตาม auth state changes
    const subscription = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoggedIn(true);
        setCurrentUser({
          name: session.user.user_metadata?.name || session.user.email,
          role: 'admin',
          email: session.user.email,
          id: session.user.id
        });
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // ดึงข้อมูลจาก Supabase เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลห้องประชุม
        const { data: roomsData, error: roomsError } = await fetchData('rooms');
        if (roomsData) setRooms(roomsData);
        if (roomsError) console.error('Error loading rooms:', roomsError);

        // ดึงข้อมูลการจอง
        const { data: bookingsData, error: bookingsError } = await fetchData('bookings');
        if (bookingsData) {
          // Map snake_case (DB) to camelCase (App)
          const formattedBookings = bookingsData.map(b => ({
            ...b,
            roomId: b.room_id,
            startTime: b.start_time ? b.start_time.slice(0, 5) : '', // ตัดวินาทีออกถ้ามี
            endTime: b.end_time ? b.end_time.slice(0, 5) : '',
            bookedBy: b.booked_by
          }));
          setBookings(formattedBookings);
        }
        if (bookingsError) console.error('Error loading bookings:', bookingsError);

        // ดึงข้อมูลแผนก
        const { data: departmentsData, error: departmentsError } = await fetchData('departments');
        if (departmentsData) setDepartments(departmentsData);
        if (departmentsError) console.error('Error loading departments:', departmentsError);

        // ดึงข้อมูลอาคาร
        const { data: buildingsData, error: buildingsError } = await fetchData('buildings');
        if (buildingsData) setBuildings(buildingsData);
        if (buildingsError) console.error('Error loading buildings:', buildingsError);

        // ดึงข้อมูลอุปกรณ์
        const { data: equipmentData, error: equipmentError } = await fetchData('equipment');
        if (equipmentData) setEquipment(equipmentData);
        if (equipmentError) console.error('Error loading equipment:', equipmentError);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <>
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

            {currentPage === 'manage-departments' && isLoggedIn && (
              <ManageDepartments
                departments={departments}
                setDepartments={setDepartments}
              />
            )}

            {currentPage === 'manage-buildings' && isLoggedIn && (
              <ManageBuildings
                buildings={buildings}
                setBuildings={setBuildings}
              />
            )}

            {currentPage === 'manage-equipment' && isLoggedIn && (
              <ManageEquipment
                equipment={equipment}
                setEquipment={setEquipment}
              />
            )}


          </>
        )}
      </div>
    </div>
  );
};

export default App;