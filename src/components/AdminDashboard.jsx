import React from 'react';
import { Calendar, Clock, Users, Building, TrendingUp, BarChart3, Package } from 'lucide-react';
import { getStatistics } from '../utils/bookingUtils';

const AdminDashboard = ({ 
  bookings, 
  rooms, 
  departments,
  equipment,
  setCurrentPage 
}) => {
  const stats = getStatistics(bookings, rooms, departments);
  
  // คำนวณจำนวนอุปกรณ์ทั้งหมด
  const totalEquipment = equipment ? equipment.reduce((sum, eq) => sum + eq.quantity, 0) : 0;

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
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4 overflow-y-auto scrollbar-thin">
          <div className="space-y-4 pb-4">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
              <p className="text-sm sm:text-base text-purple-100">จัดการระบบจองห้องประชุม</p>
            </div>

            {/* Stats Cards - 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">จำนวนการจองทั้งหมด</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 opacity-40" />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">จองวันนี้</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{stats.todayBookings}</p>
                  </div>
                  <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 opacity-40" />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">ห้องประชุม</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{rooms.length}</p>
                  </div>
                  <Building className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 opacity-40" />
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm font-medium">หน่วยงาน</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{departments.length}</p>
                  </div>
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 opacity-40" />
                </div>
              </div>
            </div>

            {/* Equipment Card - Full width */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">อุปกรณ์ทั้งหมด</p>
                  <p className="text-2xl sm:text-3xl font-bold text-teal-600 mt-1">{totalEquipment} ชิ้น</p>
                  <p className="text-xs text-gray-400 mt-1">{equipment ? equipment.length : 0} ประเภท</p>
                </div>
                <Package className="w-10 h-10 sm:w-12 sm:h-12 text-teal-500 opacity-40" />
              </div>
            </div>

            {/* Charts - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-800">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                  <span className="text-sm sm:text-base">การจองรายวัน (7 วันล่าสุด)</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.dailyStats).map(([date, count]) => {
                    const maxCount = Math.max(...Object.values(stats.dailyStats));
                    const width = maxCount > 0 ? Math.max((count / maxCount) * 100, 5) : 5;
                    return (
                      <div key={date} className="flex items-center">
                        <span className="text-xs sm:text-sm text-gray-600 w-20 sm:w-28 font-medium">
                          {new Date(date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 ml-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-end px-2 transition-all"
                            style={{ width: width + '%' }}
                          >
                            <span className="text-white text-xs font-bold">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center text-gray-800">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                  <span className="text-sm sm:text-base">การจองรายเดือน (6 เดือนล่าสุด)</span>
                </h3>
                <div className="space-y-2">
                  {Object.entries(stats.monthlyStats).map(([month, count]) => {
                    const maxCount = Math.max(...Object.values(stats.monthlyStats));
                    const width = maxCount > 0 ? Math.max((count / maxCount) * 100, 5) : 5;
                    return (
                      <div key={month} className="flex items-center">
                        <span className="text-xs sm:text-sm text-gray-600 w-20 sm:w-28 font-medium">{month}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 ml-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full flex items-center justify-end px-2 transition-all"
                            style={{ width: width + '%' }}
                          >
                            <span className="text-white text-xs font-bold">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons - 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => setCurrentPage('manage-bookings')}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left group transform hover:-translate-y-1"
              >
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800">จัดการการจอง</h3>
                <p className="text-xs sm:text-sm text-gray-600">ดู แก้ไข ยกเลิกการจอง</p>
              </button>

              <button
                onClick={() => setCurrentPage('manage-rooms')}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left group transform hover:-translate-y-1"
              >
                <Building className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800">จัดการห้องประชุม</h3>
                <p className="text-xs sm:text-sm text-gray-600">เพิ่ม ลบ แก้ไขห้องประชุม</p>
              </button>

              <button
                onClick={() => setCurrentPage('manage-departments')}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left group transform hover:-translate-y-1"
              >
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800">จัดการแผนก</h3>
                <p className="text-xs sm:text-sm text-gray-600">เพิ่ม ลบ แก้ไขแผนก</p>
              </button>

              <button
                onClick={() => setCurrentPage('manage-equipment')}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all text-left group transform hover:-translate-y-1"
              >
                <Package className="w-10 h-10 sm:w-12 sm:h-12 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-base sm:text-lg mb-1 text-gray-800">จัดการอุปกรณ์</h3>
                <p className="text-xs sm:text-sm text-gray-600">เพิ่ม ลบ แก้ไขอุปกรณ์</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;