import React, { useState } from 'react';
import { Calendar, Clock, Building, Users, Trash2, Lock, MessageSquare } from 'lucide-react';
import { deleteData } from '../utils/database';

const MyBookingsModal = ({
  showModal,
  setShowModal,
  bookings,
  setBookings,
  rooms
}) => {
  const [userPhone, setUserPhone] = useState('');
  const [verificationState, setVerificationState] = useState({
    isOpen: false,
    booking: null,
    otp: '',
    inputOtp: '',
    error: ''
  });

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
    setUserPhone('');
    setVerificationState({ isOpen: false, booking: null, otp: '', inputOtp: '', error: '' });
  };

  const handleRequestCancel = (booking) => {
    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // จำลองการส่ง SMS (ในระบบจริงจะยิง API SMS ที่นี่)
    alert(`[จำลอง SMS] รหัส OTP เพื่อยืนยันการยกเลิกคือ: ${generatedOtp}`);

    setVerificationState({
      isOpen: true,
      booking: booking,
      otp: generatedOtp,
      inputOtp: '',
      error: ''
    });
  };

  const handleConfirmCancel = async () => {
    if (verificationState.inputOtp !== verificationState.otp) {
      setVerificationState(prev => ({ ...prev, error: 'รหัส OTP ไม่ถูกต้อง' }));
      return;
    }

    try {
      // Delete from Database
      const { error } = await deleteData('bookings', { id: verificationState.booking.id });
      if (error) throw error;

      // Update Local State
      setBookings(bookings.filter(b => b.id !== verificationState.booking.id));

      alert('✓ ยกเลิกการจองเรียบร้อยแล้ว');

      // Reset State
      setVerificationState({ isOpen: false, booking: null, otp: '', inputOtp: '', error: '' });

    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('เกิดข้อผิดพลาดในการยกเลิก: ' + error.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const bookingPhone = (b.phone || '').replace(/-/g, '');
    const searchPhone = userPhone.replace(/-/g, '');
    return bookingPhone === searchPhone;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
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
                      // คำนวณเวลาเริ่มและจบ
                      const startDateTime = new Date(booking.date + 'T' + booking.startTime);
                      const endDateTime = new Date(booking.date + 'T' + booking.endTime);
                      const now = new Date();

                      // สถานะต่างๆ
                      const isPast = now > endDateTime; // ผ่านไปแล้ว (เกินเวลาจบ)
                      const isOngoing = now >= startDateTime && now <= endDateTime; // กำลังใช้งานอยู่

                      // ยกเลิกได้ถ้ายังไม่จบ (รวม Ongoing ด้วย)
                      const canCancel = !isPast;

                      return (
                        <div
                          key={booking.id}
                          className={'p-4 rounded-lg border-l-4 transition-all ' + (
                            isPast ? 'bg-gray-50 border-gray-400' :
                              isOngoing ? 'bg-blue-50 border-blue-500' :
                                'bg-green-50 border-green-500'
                          )}
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
                              ) : isOngoing ? (
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold animate-pulse">
                                  ▶ กำลังใช้งาน
                                </span>
                              ) : (
                                <span className="inline-block mt-2 px-3 py-1 bg-green-200 text-green-700 text-xs rounded-full">
                                  ✓ การจองที่กำลังจะมาถึง
                                </span>
                              )}
                            </div>
                            {canCancel && (
                              <button
                                onClick={() => handleRequestCancel(booking)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md transform hover:scale-105"
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

        {/* OTP Verification Modal Overlay */}
        {verificationState.isOpen && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-6 z-[60] backdrop-blur-sm rounded-lg animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 transform transition-all scale-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันตัวตน</h3>
                <p className="text-gray-600 text-sm">
                  รหัสยืนยัน (OTP) ถูกส่งไปยังเบอร์
                  <br />
                  <span className="font-semibold text-gray-800 text-lg">{verificationState.booking?.phone}</span>
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 inline-block">
                  <p className="text-xs text-blue-600 font-semibold">
                    (ระบบจำลอง) รหัส OTP ของคุณคือ: <span className="text-lg text-blue-700 mx-1">{verificationState.otp}</span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">กรอกรหัส OTP 6 หลัก</label>
                <div className="relative max-w-[200px] mx-auto">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={verificationState.inputOtp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setVerificationState(prev => ({ ...prev, inputOtp: val, error: '' }));
                    }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest font-bold bg-gray-50"
                    placeholder="000000"
                    autoFocus
                    maxLength={6}
                  />
                </div>
                {verificationState.error && (
                  <p className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded-lg border border-red-100 animate-pulse">
                    ⚠️ {verificationState.error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setVerificationState({ isOpen: false, booking: null, otp: '', inputOtp: '', error: '' })}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold transition-colors border border-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className={`flex-1 text-white py-3 rounded-xl font-semibold transition-all shadow-md transform active:scale-95 ${verificationState.inputOtp.length === 6
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200'
                      : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  disabled={verificationState.inputOtp.length !== 6}
                >
                  ยืนยันการยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsModal;