import React, { useState } from 'react';
import { Calendar, Clock, Building, Users, Trash2 } from 'lucide-react';

const MyBookingsModal = ({ 
  showModal, 
  setShowModal, 
  bookings, 
  setBookings, 
  rooms 
}) => {
  const [userPhone, setUserPhone] = useState('');

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
    setUserPhone('');
  };

  const filteredBookings = bookings.filter(b => {
    const bookingPhone = b.phone.replace(/-/g, '');
    const searchPhone = userPhone.replace(/-/g, '');
    return bookingPhone === searchPhone;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">การจองของฉัน</h3>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              กรอกเบอร์โทรศัพท์เพื่อค้นหาการจอง
            </label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              onBlur={(e) => {
                let value = e.target.value.replace(/[^0-9-]/g, '');
                if (value.length === 10 && !value.includes('-')) {
                  value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
                }
                setUserPhone(value);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="081-234-5678 หรือ 0812345678"
              maxLength="12"
            />
            <p className="text-xs text-gray-500 mt-1">
              พิมพ์เบอร์โทร 10 หลัก หรือพิมพ์แบบมีขีด เช่น 081-234-5678
            </p>
          </div>

          {userPhone && userPhone.replace(/-/g, '').length >= 10 && (
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-lg font-semibold">ไม่พบการจองด้วยเบอร์นี้</p>
                  <p className="text-sm mt-2">กรุณาตรวจสอบเบอร์โทรศัพท์อีกครั้ง</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800">
                      พบการจอง {filteredBookings.length} รายการ
                    </p>
                  </div>
                  {filteredBookings
                    .sort((a, b) => new Date(b.date + ' ' + b.startTime) - new Date(a.date + ' ' + a.startTime))
                    .map(booking => {
                      const room = rooms.find(r => r.id === booking.roomId);
                      const bookingDateTime = new Date(booking.date + 'T' + booking.startTime);
                      const now = new Date();
                      const isPast = bookingDateTime < now;
                      const canCancel = !isPast;

                      return (
                        <div 
                          key={booking.id} 
                          className={'p-4 rounded-lg border-l-4 transition-all ' + (isPast ? 'bg-gray-50 border-gray-400' : 'bg-green-50 border-green-500')}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h5 className="font-semibold text-lg mb-2 text-gray-800">{booking.title}</h5>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Calendar className="w-4 h-4 inline mr-2" />
                                  {new Date(booking.date).toLocaleDateString('th-TH', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    weekday: 'long'
                                  })}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Clock className="w-4 h-4 inline mr-2" />
                                  {booking.startTime} - {booking.endTime} น.
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Building className="w-4 h-4 inline mr-2" />
                                  {room ? room.name : 'N/A'} ({room ? room.building : ''})
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Users className="w-4 h-4 inline mr-2" />
                                  ผู้จอง: {booking.bookedBy}
                                </p>
                              </div>
                              {isPast ? (
                                <span className="inline-block mt-2 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                  ⏰ การจองที่ผ่านมาแล้ว
                                </span>
                              ) : (
                                <span className="inline-block mt-2 px-3 py-1 bg-green-200 text-green-700 text-xs rounded-full">
                                  ✓ การจองที่กำลังจะมาถึง
                                </span>
                              )}
                            </div>
                            {canCancel && (
                              <button
                                onClick={() => {
                                  if (window.confirm('ต้องการยกเลิกการจองนี้หรือไม่?\n\n' + booking.title + '\n' + new Date(booking.date).toLocaleDateString('th-TH') + ' ' + booking.startTime + ' - ' + booking.endTime)) {
                                    setBookings(bookings.filter(b => b.id !== booking.id));
                                    alert('✓ ยกเลิกการจองเรียบร้อยแล้ว');
                                  }
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                              >
                                <Trash2 className="w-4 h-4" />
                                ยกเลิก
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsModal;