import React, { useState } from 'react';
import { Download, Search, Edit, Trash2, Calendar, Clock, User, Phone, FileText, Filter } from 'lucide-react';

const ManageBookings = () => {
  const [rooms] = useState([
    { id: 1, name: 'ห้องประชุม A', building: 'อาคาร 1', floor: '3' },
    { id: 2, name: 'ห้องประชุม B', building: 'อาคาร 1', floor: '5' },
    { id: 3, name: 'ห้องสัมมนา', building: 'อาคาร 2', floor: '2' }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      roomId: 1,
      date: '2024-11-10',
      startTime: '09:00',
      endTime: '12:00',
      title: 'ประชุมคณะกรรมการบริหาร',
      bookedBy: 'สมชาย ใจดี',
      department: 'ฝ่ายบริหาร',
      phone: '081-234-5678',
      email: 'somchai@company.com',
      participants: 15,
      status: 'confirmed'
    },
    {
      id: 2,
      roomId: 2,
      date: '2024-11-10',
      startTime: '14:00',
      endTime: '16:00',
      title: 'อบรมพนักงานใหม่',
      bookedBy: 'สมหญิง รักงาน',
      department: 'ฝ่ายทรัพยากรบุคคล',
      phone: '082-345-6789',
      email: 'somying@company.com',
      participants: 25,
      status: 'confirmed'
    },
    {
      id: 3,
      roomId: 3,
      date: '2024-11-11',
      startTime: '10:00',
      endTime: '15:00',
      title: 'สัมมนาเชิงปฏิบัติการ',
      bookedBy: 'วิชัย มานะ',
      department: 'ฝ่ายการตลาด',
      phone: '083-456-7890',
      email: 'wichai@company.com',
      participants: 40,
      status: 'pending'
    },
    {
      id: 4,
      roomId: 1,
      date: '2024-11-12',
      startTime: '13:00',
      endTime: '17:00',
      title: 'ประชุมทีมขาย',
      bookedBy: 'ประภา สุขสันต์',
      department: 'ฝ่ายขาย',
      phone: '084-567-8901',
      email: 'prapha@company.com',
      participants: 12,
      status: 'confirmed'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchRoom, setSearchRoom] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const handleEditBooking = (booking) => {
    setEditingBooking({...booking});
    setShowModal(true);
  };

  const handleSaveBooking = () => {
    if (!editingBooking.title || !editingBooking.bookedBy || !editingBooking.phone) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
    alert('✓ แก้ไขข้อมูลเรียบร้อย!');
    setShowModal(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('ต้องการยกเลิกการจองนี้หรือไม่?')) {
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('✓ ยกเลิกการจองเรียบร้อย');
    }
  };

  const handleExportPDF = () => {
    alert('📄 กำลังสร้างรายงาน PDF...');
  };

  const handleExportExcel = () => {
    alert('📊 กำลังสร้างรายงาน Excel...');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchDate = !searchDate || booking.date === searchDate;
    const matchRoom = !searchRoom || booking.roomId === parseInt(searchRoom);
    const matchStatus = !searchStatus || booking.status === searchStatus;
    return matchDate && matchRoom && matchStatus;
  });

  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (status) => {
    if (status === 'confirmed') {
      return '✓ ยืนยัน';
    }
    return '⏳ รอดำเนินการ';
  };

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-8 h-8 text-orange-500" />
                  จัดการการจอง
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>ทั้งหมด: {bookings.length} รายการ</span>
                  <span>•</span>
                  <span className="text-green-600">ยืนยันแล้ว: {confirmedCount}</span>
                  <span>•</span>
                  <span className="text-yellow-600">รอดำเนินการ: {pendingCount}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button 
                  onClick={handleExportPDF}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center shadow-lg text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-lg text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>

            {/* Search/Filter Bar */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl shadow-md border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-700">ค้นหา/กรองข้อมูล</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="เลือกวันที่"
                />
                <select 
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">ทุกห้อง</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
                <select 
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">ทุกสถานะ</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="pending">รอดำเนินการ</option>
                </select>
                <button 
                  onClick={() => {
                    setSearchDate('');
                    setSearchRoom('');
                    setSearchStatus('');
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center shadow-md"
                >
                  <Search className="w-4 h-4 mr-2" />
                  ล้างค่า
                </button>
              </div>
            </div>

            {/* Table */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">ไม่พบข้อมูลการจอง</p>
                <p className="text-gray-400 text-sm mt-2">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">วันที่</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">เวลา</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">ห้อง</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">หัวข้อ</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">ผู้จอง</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">แผนก</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">เบอร์โทร</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">จำนวน</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">สถานะ</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.map(booking => {
                        const room = rooms.find(r => r.id === booking.roomId);
                        return (
                          <tr key={booking.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(booking.date).toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {booking.startTime}-{booking.endTime}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {room ? room.name : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                              {booking.title}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{booking.bookedBy}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{booking.department}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {booking.phone}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-400" />
                                {booking.participants} คน
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleEditBooking(booking)}
                                  className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all"
                                  title="แก้ไข"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteBooking(booking.id)}
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                                  title="ยกเลิก"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-orange-500" />
                  แก้ไขการจอง
                </h3>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    setEditingBooking(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      วันที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={editingBooking.date}
                      onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      สถานะ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingBooking.status}
                      onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="confirmed">ยืนยัน</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      เวลาเริ่ม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={editingBooking.startTime}
                      onChange={(e) => setEditingBooking({...editingBooking, startTime: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      เวลาสิ้นสุด <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={editingBooking.endTime}
                      onChange={(e) => setEditingBooking({...editingBooking, endTime: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    หัวข้อการประชุม <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingBooking.title}
                    onChange={(e) => setEditingBooking({...editingBooking, title: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      ผู้จอง <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingBooking.bookedBy}
                      onChange={(e) => setEditingBooking({...editingBooking, bookedBy: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      เบอร์โทร <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editingBooking.phone}
                      onChange={(e) => setEditingBooking({...editingBooking, phone: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      แผนก
                    </label>
                    <input
                      type="text"
                      value={editingBooking.department}
                      onChange={(e) => setEditingBooking({...editingBooking, department: e.target.value})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      จำนวนผู้เข้าร่วม
                    </label>
                    <input
                      type="number"
                      value={editingBooking.participants}
                      onChange={(e) => setEditingBooking({...editingBooking, participants: parseInt(e.target.value) || 0})}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveBooking}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold transition-all shadow-lg"
                  >
                    ✓ บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingBooking(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                  >
                    ✗ ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;