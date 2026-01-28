import React, { useState } from 'react';
import { Building, Users } from 'lucide-react';
import MyBookingsModal from './MyBookingsModal';

const HomePage = ({ 
  rooms, 
  setSelectedRoom, 
  setCurrentPage,
  bookings,
  setBookings
}) => {
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false);

  return (
    <>
      {/* Background Image - Full Screen */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}img/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Blur Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backdropFilter: 'blur(6px)'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4 flex flex-col">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-5 rounded-xl shadow-lg flex-shrink-0 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">ระบบจองห้องประชุม</h1>
                <p className="text-xs sm:text-sm text-blue-100">จองห้องประชุมได้ง่ายๆ รวดเร็ว ไม่ต้องสมัครสมาชิก</p>
              </div>
              <button
                onClick={() => setShowMyBookingsModal(true)}
                className="bg-white text-blue-600 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-50 transition-all font-semibold shadow-md text-xs sm:text-sm whitespace-nowrap hover:shadow-lg transform hover:scale-105"
              >
                📋 ดูการจองของฉัน
              </button>
            </div>
          </div>

          {/* Rooms Grid - Auto-fit with proper spacing */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-4">
              {rooms.map(room => (
                <div 
                  key={room.id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  {/* Room Image */}
                  <div className="relative h-40 sm:h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {room.image ? (
                      <img 
                        src={room.image} 
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Meeting+Room';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
                        <Building className="w-16 h-16 text-blue-500 opacity-40" />
                      </div>
                    )}
                    
                    {/* Capacity Badge */}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{room.capacity} ที่นั่ง</span>
                    </div>
                  </div>
                  
                  {/* Room Info */}
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg mb-2 text-gray-800 truncate">
                      {room.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Building className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                      <span className="truncate">{room.building} · ชั้น {room.floor}</span>
                    </div>
                    
                    {/* Book Button */}
                    <button
                      onClick={() => {
                        setSelectedRoom(room);
                        setCurrentPage('room-detail');
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      ดูรายละเอียดและจอง
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My Bookings Modal */}
      <MyBookingsModal
        showModal={showMyBookingsModal}
        setShowModal={setShowMyBookingsModal}
        bookings={bookings}
        setBookings={setBookings}
        rooms={rooms}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.8);
        }
      `}</style>
    </>
  );
};

export default HomePage;