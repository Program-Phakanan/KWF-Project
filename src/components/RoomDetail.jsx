import React, { useState } from 'react';
import { Building, Users, Calendar, Clock, CheckCircle, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { isRoomAvailable } from '../utils/bookingUtils';
import { validatePhoneNumber } from '../utils/roomUtils';
import AlertModal from './AlertModal';
import { insertData } from '../utils/database';

const RoomDetail = ({
  selectedRoom,
  selectedDate,
  setSelectedDate,
  bookings,
  setBookings,
  departments,
  setCurrentPage,
  currentUser
}) => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    title: '',
    department: '',
    attendees: '',
    bookedBy: '',
    phone: ''
  });
  const [alertModal, setAlertModal] = useState({ show: false, type: '', message: '' });
  const [showCalendar, setShowCalendar] = useState(false);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const handleDateSelect = (day) => {
    const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    newDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate >= today) {
      setSelectedDate(newDate);
      setSelectedTimeSlots([]);
      setShowCalendar(false);
    }
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCalendarMonth(newMonth);
  };

  const showAlert = (type, message) => {
    setAlertModal({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, type: '', message: '' });
  };

  const dateStr = selectedDate.toISOString().split('T')[0];
  const dayBookings = bookings.filter(b => b.roomId === selectedRoom.id && b.date === dateStr);

  const isSlotAvailable = (time) => {
    const endTime = parseInt(time.split(':')[0]) + 1 + ':00';
    return isRoomAvailable(bookings, selectedRoom.id, dateStr, time, endTime);
  };

  const toggleTimeSlot = (time) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay.getTime() === today.getTime()) {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      if (slotTime < now || !isSlotAvailable(time)) return;
    } else if (!isSlotAvailable(time)) {
      return;
    }

    if (selectedTimeSlots.includes(time)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(t => t !== time));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, time].sort());
    }
  };

  const getBookingTimeRange = () => {
    if (selectedTimeSlots.length === 0) return null;

    const sortedSlots = [...selectedTimeSlots].sort();
    const startTime = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];
    const endTime = parseInt(lastSlot.split(':')[0]) + 1 + ':00';

    return { startTime, endTime };
  };

  /* import insertData at the top first, but I will do it in handleQuickBook logic here assuming import is added */

  const handleQuickBook = async () => {
    if (selectedTimeSlots.length === 0) {
      showAlert('error', 'กรุณาเลือกช่วงเวลาอย่างน้อย 1 ช่อง');
      return;
    }
    if (!bookingForm.title || !bookingForm.bookedBy || !bookingForm.phone) {
      showAlert('error', 'กรุณากรอกหัวข้อการประชุม ชื่อผู้จอง และเบอร์โทรศัพท์');
      return;
    }

    if (!validatePhoneNumber(bookingForm.phone)) {
      showAlert('error', 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เช่น 081-234-5678)');
      return;
    }

    const timeRange = getBookingTimeRange();
    const sortedSlots = [...selectedTimeSlots].sort();

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentHour = parseInt(sortedSlots[i].split(':')[0]);
      const nextHour = parseInt(sortedSlots[i + 1].split(':')[0]);
      if (nextHour - currentHour > 1) {
        showAlert('error', 'กรุณาเลือกช่วงเวลาที่ติดกัน');
        return;
      }
    }

    // Check availability locally first (optimistic check)
    for (let slot of sortedSlots) {
      const endTime = parseInt(slot.split(':')[0]) + 1 + ':00';
      if (!isRoomAvailable(bookings, selectedRoom.id, dateStr, slot, endTime)) {
        showAlert('error', 'บางช่วงเวลาที่เลือกมีการจองแล้ว');
        return;
      }
    }

    try {
      // Prepare data for Supabase
      const newBookingDB = {
        room_id: selectedRoom.id,
        date: dateStr,
        start_time: timeRange.startTime,
        end_time: timeRange.endTime,
        purpose: bookingForm.title, // Maps 'title' to 'purpose'
        department: bookingForm.department,
        booked_by: bookingForm.bookedBy,
        contact: bookingForm.phone,
        attendees: parseInt(bookingForm.attendees) || 0
      };

      // Call Supabase insert
      const { data, error } = await insertData('bookings', newBookingDB);

      if (error) throw error;

      // Update local state to reflect changes immediately
      const newBookingLocal = {
        id: data && data.length > 0 ? data[0].id : Date.now(), // Use DB id or temp
        roomId: selectedRoom.id,
        date: dateStr,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
        title: bookingForm.title,
        department: bookingForm.department,
        bookedBy: bookingForm.bookedBy,
        phone: bookingForm.phone,
        attendees: bookingForm.attendees,
        status: 'confirmed'
      };

      setBookings([...bookings, newBookingLocal]);
      showAlert('success', 'จองห้องประชุมสำเร็จ!');
      setBookingForm({ title: '', department: '', attendees: '', bookedBy: '', phone: '' });
      setSelectedTimeSlots([]);

    } catch (error) {
      console.error('Booking error:', error);
      showAlert('error', 'เกิดข้อผิดพลาดในการจอง: ' + error.message);
    }
  };

  return (
    <>
      {/* Background Image - Full Screen */}
      <div
        className="fixed inset-0 top-0 z-0"
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
        className="fixed inset-0 top-16 pointer-events-none z-0"
        style={{
          backdropFilter: 'blur(6px)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-20 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-4">
          {/* Modern Alert Modal */}
          <AlertModal
            isOpen={alertModal.show}
            onClose={closeAlert}
            type={alertModal.type}
            message={alertModal.message}
          />

          {/* Back Button */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            กลับหน้าแรก
          </button>

          {/* Room Info Card - Modern Design */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 rounded-2xl shadow-xl border border-blue-100">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {selectedRoom.name}
            </h2>

            {selectedRoom.image && (
              <div className="mb-4 sm:mb-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={selectedRoom.image}
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x450?text=Meeting+Room';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">สถานที่</p>
                    <p className="text-gray-800 font-medium text-sm">{selectedRoom.building} ชั้น {selectedRoom.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ความจุ</p>
                    <p className="text-gray-800 font-medium text-sm">{selectedRoom.capacity} คน</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  อุปกรณ์ในห้อง
                </p>
                <ul className="space-y-1.5 sm:space-y-2">
                  {selectedRoom.equipment.map((eq, idx) => (
                    <li key={idx} className="text-gray-600 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      {eq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Date Selection Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">เลือกวันที่</h3>
            </div>

            {/* Selected Date Display - Compact */}
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="cursor-pointer border-2 border-gray-200 hover:border-blue-500 rounded-xl px-4 py-3 w-full md:w-auto inline-flex items-center justify-between gap-4 transition-all bg-gray-50 hover:bg-white group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-1.5 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">วันที่เลือก</p>
                  <span className="font-bold text-gray-800 text-base">
                    {selectedDate.toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </span>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''} bg-gray-200 p-1 rounded-full group-hover:bg-blue-100`}>
                <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Modern Calendar */}
            {showCalendar && (
              <div className="mt-4 bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-2xl animate-in fade-in zoom-in duration-300 ring-1 ring-black/5">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {calendarMonth.toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
                  </h4>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, idx) => (
                    <div key={day} className={`text-center text-sm font-bold py-2 ${idx === 0 || idx === 6 ? 'text-red-400' : 'text-gray-500'}`}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 place-items-center">
                  {(() => {
                    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(calendarMonth);
                    const days = [];
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="w-9 h-9 sm:w-11 sm:h-11"></div>);
                    }

                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      date.setHours(0, 0, 0, 0);
                      const isSelected = selectedDate.getDate() === day &&
                        selectedDate.getMonth() === month &&
                        selectedDate.getFullYear() === year;
                      const isPast = date < today;
                      const isToday = date.getTime() === today.getTime();

                      days.push(
                        <button
                          key={day}
                          onClick={() => !isPast && handleDateSelect(day)}
                          disabled={isPast}
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-200 ${isSelected
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                            : isToday
                              ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 font-bold'
                              : isPast
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                            }`}
                        >
                          {day}
                        </button>
                      );
                    }

                    return days;
                  })()}
                </div>

                {/* Today Button */}
                <div className="mt-6 flex justify-center border-t border-gray-100 pt-4">
                  <button
                    onClick={() => {
                      const today = new Date();
                      setCalendarMonth(today);
                      setSelectedDate(today);
                      setSelectedTimeSlots([]);
                      setShowCalendar(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    กลับมาที่วันนี้
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-blue-800">
                สามารถจองได้ตั้งแต่วันนี้เป็นต้นไป (กรุณาเลือกวันที่ต้องการจองล่วงหน้า)
              </p>
            </div>
          </div>

          {/* Time Slots Card */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                ตารางการจอง
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              {new Date(selectedDate).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {timeSlots.map(time => {
                const available = isSlotAvailable(time);
                const booking = dayBookings.find(b => time >= b.startTime && time < b.endTime);
                const isSelected = selectedTimeSlots.includes(time);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDay = new Date(selectedDate);
                selectedDay.setHours(0, 0, 0, 0);

                let isPastTime = false;
                if (selectedDay.getTime() === today.getTime()) {
                  const now = new Date();
                  const [hours, minutes] = time.split(':').map(Number);
                  const slotTime = new Date();
                  slotTime.setHours(hours, minutes, 0, 0);
                  isPastTime = slotTime < now;
                }

                const isAvailableAndFuture = available && !isPastTime;

                return (
                  <button
                    key={time}
                    onClick={() => isAvailableAndFuture && toggleTimeSlot(time)}
                    disabled={!isAvailableAndFuture}
                    className={'p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium transition-all transform hover:scale-105 ' + (
                      isAvailableAndFuture
                        ? isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300 shadow-lg'
                          : 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 border-2 border-green-200'
                        : isPastTime
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                          : 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 cursor-not-allowed border-2 border-red-200'
                    )}
                    title={booking ? 'จองโดย: ' + booking.title : isPastTime ? 'เวลานี้ผ่านไปแล้ว' : ''}
                  >
                    <div className="font-bold text-sm sm:text-base">{time}</div>
                    <div className="text-xs mt-1 font-medium">
                      {isPastTime
                        ? 'ผ่านเวลานี้ไปแล้ว'
                        : available
                          ? (isSelected ? '✓ เลือกแล้ว' : '◯ ว่าง')
                          : '✗ ไม่ว่าง'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Time Slots Display */}
            {selectedTimeSlots.length > 0 && (
              <div className="mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border-2 border-blue-200 shadow-sm">
                <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ช่วงเวลาที่เลือก: {selectedTimeSlots.length} ช่อง
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTimeSlots.map(time => (
                    <span key={time} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center shadow-md hover:shadow-lg transition-shadow">
                      <Clock className="w-3 h-3 mr-1" />
                      {time}
                      <button
                        onClick={() => toggleTimeSlot(time)}
                        className="ml-2 hover:bg-blue-700 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {getBookingTimeRange() && (
                  <div className="flex items-center gap-2 bg-white p-2 sm:p-3 rounded-lg">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    <p className="text-xs sm:text-sm text-blue-800 font-medium">
                      รวมเวลา: {getBookingTimeRange().startTime} - {getBookingTimeRange().endTime} น.
                      <span className="ml-2 text-blue-600">({selectedTimeSlots.length} ชั่วโมง)</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Existing Bookings Display */}
            {dayBookings.length > 0 && (
              <div className="mt-4 sm:mt-6 border-t-2 border-gray-200 pt-4 sm:pt-6">
                <h4 className="font-semibold mb-4 text-sm sm:text-base text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  การจองในวันนี้
                </h4>
                <div className="space-y-3">
                  {dayBookings.map(booking => (
                    <div key={booking.id} className="bg-gradient-to-r from-red-50 to-pink-50 p-3 sm:p-4 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
                      <p className="font-semibold text-gray-800 text-sm sm:text-lg mb-2">{booking.title}</p>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                          <span className="font-medium">เวลา:</span> {booking.startTime} - {booking.endTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                          <span className="font-medium">ผู้จอง:</span> {booking.bookedBy} | โทร: {booking.phone}
                        </p>
                        {booking.department && (
                          <p className="flex items-center gap-2">
                            <Building className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                            <span className="font-medium">แผนก:</span> {booking.department}
                          </p>
                        )}
                        {booking.attendees && (
                          <p className="flex items-center gap-2">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                            <span className="font-medium">ผู้เข้าร่วม:</span> {booking.attendees} คน
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          {selectedTimeSlots.length > 0 && (
            <div className="bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6 rounded-2xl shadow-xl border border-purple-100">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                ฟอร์มจองห้อง
              </h3>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-white shadow-lg">
                <p className="text-xs sm:text-sm font-semibold mb-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  ช่วงเวลาที่เลือก
                </p>
                <p className="text-base sm:text-lg font-bold">
                  {getBookingTimeRange().startTime} - {getBookingTimeRange().endTime} น.
                  <span className="text-xs sm:text-sm ml-2 opacity-90">({selectedTimeSlots.length} ชั่วโมง)</span>
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    หัวข้อการประชุม
                  </label>
                  <input
                    type="text"
                    value={bookingForm.title}
                    onChange={(e) => setBookingForm({ ...bookingForm, title: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="ระบุหัวข้อการประชุม"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    ชื่อผู้จอง
                  </label>
                  <input
                    type="text"
                    value={bookingForm.bookedBy}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookedBy: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="ระบุชื่อผู้จอง"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBookingForm({ ...bookingForm, phone: value });
                    }}
                    onBlur={(e) => {
                      let value = e.target.value.replace(/[^0-9-]/g, '');
                      if (value.length === 10 && !value.includes('-')) {
                        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
                      }
                      setBookingForm({ ...bookingForm, phone: value });
                    }}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="081-234-5678 หรือ 0812345678"
                    maxLength="12"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    พิมพ์เบอร์โทร 10 หลัก หรือพิมพ์แบบมีขีด
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                    แผนก/หน่วยงาน
                  </label>
                  <select
                    value={bookingForm.department}
                    onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                  >
                    <option value="">เลือกแผนก</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                    จำนวนผู้เข้าร่วม
                  </label>
                  <input
                    type="number"
                    value={bookingForm.attendees}
                    onChange={(e) => setBookingForm({ ...bookingForm, attendees: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="จำนวนคน"
                    max={selectedRoom.capacity}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ความจุห้อง: {selectedRoom.capacity} คน
                  </p>
                </div>

                <button
                  onClick={handleQuickBook}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ยืนยันการจอง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomDetail;