// ฟังก์ชันตรวจสอบว่าห้องว่างหรือไม่
export const isRoomAvailable = (bookings, roomId, date, startTime, endTime, excludeBookingId = null) => {
  const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
  const conflictBooking = bookings.find(b => 
    b.roomId === roomId && 
    b.date === dateStr && 
    b.id !== excludeBookingId &&
    b.status === 'confirmed' &&
    ((startTime >= b.startTime && startTime < b.endTime) ||
     (endTime > b.startTime && endTime <= b.endTime) ||
     (startTime <= b.startTime && endTime >= b.endTime))
  );
  return !conflictBooking;
};

// ฟังก์ชันคำนวณสถิติ
export const getStatistics = (bookings, rooms, departments) => {
  const today = new Date().toISOString().split('T')[0];
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(b => b.date === today).length;
  
  // สถิติรายวัน (7 วันล่าสุด)
  const dailyStats = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyStats[dateStr] = bookings.filter(b => b.date === dateStr).length;
  }

  // สถิติรายเดือน (6 เดือนล่าสุด)
  const monthlyStats = {};
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    monthlyStats[monthKey] = bookings.filter(b => b.date.startsWith(monthKey)).length;
  }

  // การใช้งานแต่ละห้อง
  const roomUsage = {};
  bookings.forEach(b => {
    roomUsage[b.roomId] = (roomUsage[b.roomId] || 0) + 1;
  });

  return { totalBookings, todayBookings, dailyStats, monthlyStats, roomUsage };
};