import React, { useState } from 'react';
import { Download, Search, Edit, Trash2, Calendar, Clock, User, Phone, FileText, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { updateData, deleteData } from '../utils/database';

const ManageBookings = ({ bookings, setBookings, rooms }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchRoom, setSearchRoom] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [alertModal, setAlertModal] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, bookingId: null, bookingTitle: '' });

  const showAlert = (type, message) => {
    setAlertModal({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, type: '', message: '' });
  };

  const handleEditBooking = (booking) => {
    setEditingBooking({ ...booking });
    setShowModal(true);
  };

  const handleSaveBooking = async () => {
    if (!editingBooking.title || !editingBooking.bookedBy || !editingBooking.phone) {
      showAlert('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      // Prepare data for Supabase
      const bookingData = {
        room_id: editingBooking.roomId,
        date: editingBooking.date,
        start_time: editingBooking.startTime,
        end_time: editingBooking.endTime,
        purpose: editingBooking.title,
        department: editingBooking.department,
        booked_by: editingBooking.bookedBy,
        contact: editingBooking.phone,
        attendees: parseInt(editingBooking.participants) || 0,
        status: editingBooking.status
      };

      // Update in Supabase
      const { error } = await updateData('bookings', bookingData, { id: editingBooking.id });

      if (error) throw error;

      // Update local state
      setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
      showAlert('success', 'แก้ไขข้อมูลการจองเรียบร้อยแล้ว');
      setShowModal(false);
      setEditingBooking(null);
    } catch (error) {
      console.error('Update booking error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleDeleteClick = (booking) => {
    setDeleteConfirm({
      show: true,
      bookingId: booking.id,
      bookingTitle: booking.title
    });
  };

  const confirmDelete = async () => {
    try {
      // Delete from Supabase
      const { error } = await deleteData('bookings', { id: deleteConfirm.bookingId });

      if (error) throw error;

      // Update local state
      setBookings(bookings.filter(b => b.id !== deleteConfirm.bookingId));
      setDeleteConfirm({ show: false, bookingId: null, bookingTitle: '' });
      showAlert('success', 'ยกเลิกการจองเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Delete booking error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
      setDeleteConfirm({ show: false, bookingId: null, bookingTitle: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, bookingId: null, bookingTitle: '' });
  };

  const handleExportPDF = () => {
    showAlert('success', 'กำลังสร้างรายงาน PDF...');
  };

  const handleExportExcel = () => {
    showAlert('success', 'กำลังสร้างรายงาน Excel...');
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
        {/* Modern Alert Modal */}
        {alertModal.show && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-in zoom-in duration-300">
              <div className="p-6">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={closeAlert}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>

                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${alertModal.type === 'success'
                      ? 'bg-gradient-to-br from-green-100 to-green-200'
                      : 'bg-gradient-to-br from-yellow-100 to-yellow-200'
                    }`}>
                    {alertModal.type === 'success' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {alertModal.type === 'success' ? 'สำเร็จ!' : 'แจ้งเตือน'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{alertModal.message}</p>
                  <button
                    onClick={closeAlert}
                    className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm ${alertModal.type === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                      }`}
                  >
                    ตรวจสอบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in duration-300">
              <div className="p-6">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={cancelDelete}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    ยืนยันการยกเลิก
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    ต้องการยกเลิกการจอง
                  </p>
                  <p className="text-gray-800 font-semibold text-base">
                    "{deleteConfirm.bookingTitle}"
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-300 font-semibold transition-all text-sm"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                  จัดการการจอง
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                  <span>ทั้งหมด: {bookings.length} รายการ</span>
                  <span>•</span>
                  <span className="text-green-600">ยืนยันแล้ว: {confirmedCount}</span>
                  <span>•</span>
                  <span className="text-yellow-600">รอดำเนินการ: {pendingCount}</span>
                </div>
              </div>
              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleExportPDF}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center shadow-lg text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-lg text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Excel
                </button>
              </div>
            </div>

            {/* Search/Filter Bar */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 sm:p-4 rounded-lg shadow-md border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-700 text-sm sm:text-base">ค้นหา/กรองข้อมูล</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="เลือกวันที่"
                />
                <select
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">ทุกห้อง</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
                <select
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center shadow-md text-sm"
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  ล้างค่า
                </button>
              </div>
            </div>

            {/* Table */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">ไม่พบข้อมูลการจอง</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase">วันที่</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase">เวลา</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase">ห้อง</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase">หัวข้อ</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase">ผู้จอง</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase hidden lg:table-cell">แผนก</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase hidden md:table-cell">เบอร์โทร</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase hidden sm:table-cell">จำนวน</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-gray-600 uppercase">สถานะ</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-gray-600 uppercase">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.map(booking => {
                        const room = rooms.find(r => r.id === booking.roomId);
                        return (
                          <tr key={booking.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                              {new Date(booking.date).toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="hidden sm:inline">{booking.startTime}-{booking.endTime}</span>
                                <span className="sm:hidden">{booking.startTime}</span>
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                              {room ? room.name : 'N/A'}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 max-w-xs truncate">
                              {booking.title}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{booking.bookedBy}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">{booking.department}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {booking.phone}
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-400" />
                                {booking.participants} คน
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-1 sm:gap-2">
                                <button
                                  onClick={() => handleEditBooking(booking)}
                                  className="p-1.5 sm:p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all"
                                  title="แก้ไข"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(booking)}
                                  className="p-1.5 sm:p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                                  title="ยกเลิก"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

        {/* Edit Modal */}
        {showModal && editingBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
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

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        วันที่ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={editingBooking.date}
                        onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        สถานะ <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={editingBooking.status}
                        onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="confirmed">ยืนยัน</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        เวลาสิ้นสุด <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={editingBooking.endTime}
                        onChange={(e) => setEditingBooking({ ...editingBooking, endTime: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      หัวข้อการประชุม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingBooking.title}
                      onChange={(e) => setEditingBooking({ ...editingBooking, title: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        ผู้จอง <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingBooking.bookedBy}
                        onChange={(e) => setEditingBooking({ ...editingBooking, bookedBy: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        เบอร์โทร <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={editingBooking.phone}
                        onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        แผนก
                      </label>
                      <input
                        type="text"
                        value={editingBooking.department}
                        onChange={(e) => setEditingBooking({ ...editingBooking, department: e.target.value })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                        จำนวนผู้เข้าร่วม
                      </label>
                      <input
                        type="number"
                        value={editingBooking.participants}
                        onChange={(e) => setEditingBooking({ ...editingBooking, participants: parseInt(e.target.value) || 0 })}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <button
                      onClick={handleSaveBooking}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 font-semibold transition-all shadow-lg text-sm sm:text-base"
                    >
                      ✓ บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingBooking(null);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg hover:bg-gray-300 font-semibold transition-all text-sm sm:text-base"
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
    </>
  );
};

export default ManageBookings;