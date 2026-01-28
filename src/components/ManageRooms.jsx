import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building, Users, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { insertData, updateData, deleteData } from '../utils/database';
import { uploadImage, deleteImage } from '../utils/storage';

const ManageRooms = ({ rooms = [], setRooms = () => { } }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [alertModal, setAlertModal] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, roomId: null, roomName: '' });

  const showAlert = (type, message) => {
    setAlertModal({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, type: '', message: '' });
  };

  const handleAddRoom = () => {
    setEditingRoom({
      id: Date.now(),
      name: '',
      building: '',
      floor: '',
      capacity: 0,
      equipment: [],
      image: ''
    });
    setIsEditing(false);
    setImagePreview('');
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom({ ...room });
    setIsEditing(true);
    setImagePreview(room.image || '');
    setShowModal(true);
  };

  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        showAlert('error', 'ไฟล์ใหญ่เกิน 5MB');
        return;
      }

      // เก็บไฟล์สำหรับอัพโหลดภายหลัง
      setImageFile(file);

      // สร้าง preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRoom = async () => {
    if (!editingRoom.name || !editingRoom.building || !editingRoom.capacity) {
      showAlert('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      let imageUrl = editingRoom.image || null;

      // ถ้ามีไฟล์รูปใหม่ ให้อัพโหลดไปที่ Supabase Storage
      if (imageFile) {
        showAlert('info', 'กำลังอัพโหลดรูปภาพ...');
        const { url, error: uploadError } = await uploadImage(imageFile);

        if (uploadError) {
          showAlert('error', 'อัพโหลดรูปภาพล้มเหลว: ' + uploadError.message);
          return;
        }

        imageUrl = url;

        // ถ้าเป็นการแก้ไข และมีรูปเก่า ให้ลบรูปเก่าออก
        if (isEditing && editingRoom.image && editingRoom.image !== url) {
          await deleteImage(editingRoom.image);
        }
      }

      // Prepare data for Supabase (convert equipment array to TEXT[] format)
      const roomData = {
        name: editingRoom.name,
        capacity: parseInt(editingRoom.capacity),
        building: editingRoom.building,
        floor: parseInt(editingRoom.floor) || null,
        equipment: editingRoom.equipment || [],
        image_url: imageUrl
      };

      let updatedRooms;
      if (isEditing) {
        // Update existing room in Supabase
        const { data, error } = await updateData('rooms', roomData, { id: editingRoom.id });

        if (error) throw error;

        // Update local state
        updatedRooms = rooms.map(r => r.id === editingRoom.id ? { ...editingRoom, ...roomData, image: imageUrl } : r);
        showAlert('success', 'แก้ไขข้อมูลเรียบร้อย!');
      } else {
        // Insert new room to Supabase
        const { data, error } = await insertData('rooms', roomData);

        if (error) throw error;

        // Add to local state with the ID from database
        const newRoom = {
          ...editingRoom,
          id: data && data.length > 0 ? data[0].id : editingRoom.id,
          ...roomData,
          image: imageUrl
        };
        updatedRooms = [...rooms, newRoom];
        showAlert('success', 'เพิ่มห้องประชุมเรียบร้อย!');
      }

      setRooms(updatedRooms);
      setShowModal(false);
      setEditingRoom(null);
      setImagePreview('');
      setImageFile(null);
    } catch (error) {
      console.error('Save room error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleDeleteClick = (room) => {
    setDeleteConfirm({
      show: true,
      roomId: room.id,
      roomName: room.name
    });
  };

  const confirmDelete = async () => {
    try {
      const roomToDelete = rooms.find(r => r.id === deleteConfirm.roomId);

      // ลบรูปภาพจาก Storage (ถ้ามี)
      if (roomToDelete?.image) {
        await deleteImage(roomToDelete.image);
      }

      // Delete from Supabase
      const { error } = await deleteData('rooms', { id: deleteConfirm.roomId });

      if (error) throw error;

      // Update local state
      const updatedRooms = rooms.filter(r => r.id !== deleteConfirm.roomId);
      setRooms(updatedRooms);

      setDeleteConfirm({ show: false, roomId: null, roomName: '' });
      showAlert('success', 'ลบห้องประชุมเรียบร้อย');
    } catch (error) {
      console.error('Delete room error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
      setDeleteConfirm({ show: false, roomId: null, roomName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, roomId: null, roomName: '' });
  };

  return (
    <div className="h-screen overflow-hidden relative bg-gray-50">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}img/background.jpg)`,
          filter: "brightness(0.95)",
          zIndex: 0
        }}
      />
      <div className="fixed inset-0  backdrop-blur-md" style={{ zIndex: 1 }} />

      <div className="relative h-full overflow-y-auto space-y-6 md:space-y-8 p-6 md:p-8 pt-8 md:pt-12 max-w-7xl mx-auto" style={{ zIndex: 10 }}>
        {alertModal.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" style={{ zIndex: 100 }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
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
                    : 'bg-gradient-to-br from-red-100 to-red-200'
                    }`}>
                    {alertModal.type === 'success' ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {alertModal.type === 'success' ? 'สำเร็จ!' : 'แจ้งเตือน'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">{alertModal.message}</p>
                  <button
                    onClick={closeAlert}
                    className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all shadow-lg text-sm ${alertModal.type === 'success'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      }`}
                  >
                    ตรวจสอบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{ zIndex: 100 }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
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
                    ยืนยันการลบ
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    ต้องการลบห้องประชุม
                  </p>
                  <p className="text-gray-800 font-semibold text-base">
                    "{deleteConfirm.roomName}"
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
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 font-semibold transition-all shadow-lg text-sm"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2.5 rounded-xl hover:bg-white transition-all shadow-md"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">กลับหน้าแรก</span>
            </button>

          </div>
          <button
            onClick={handleAddRoom}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="font-medium">เพิ่มห้องประชุม</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rooms.map(room => (
            <div key={room.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 md:h-48 bg-gray-200">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b'%3EMeeting Room%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <Building className="w-12 md:w-16 h-12 md:h-16 text-blue-500 opacity-50" />
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-800 truncate">{room.name}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  <Building className="w-3 md:w-4 h-3 md:h-4 inline mr-1" />
                  {room.building} ชั้น {room.floor}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mb-3">
                  <Users className="w-3 md:w-4 h-3 md:h-4 inline mr-1" />
                  ความจุ: {room.capacity} คน
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm"
                  >
                    <Edit className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteClick(room)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                  >
                    <Trash2 className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && editingRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 100 }}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {isEditing ? 'แก้ไขห้องประชุม' : 'เพิ่มห้องประชุม'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingRoom(null);
                      setImagePreview('');
                    }}
                    className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">ชื่อห้อง *</label>
                    <input
                      type="text"
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="เช่น ห้องประชุม A"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">อาคาร *</label>
                      <input
                        type="text"
                        value={editingRoom.building}
                        onChange={(e) => setEditingRoom({ ...editingRoom, building: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="อาคาร 1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">ชั้น *</label>
                      <input
                        type="text"
                        value={editingRoom.floor}
                        onChange={(e) => setEditingRoom({ ...editingRoom, floor: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">ความจุ (คน) *</label>
                    <input
                      type="number"
                      value={editingRoom.capacity}
                      onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">รูปภาพห้องประชุม</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-1">คลิกเพื่ออัปโหลดรูปภาพ</p>
                        <p className="text-xs text-gray-500">รองรับ JPG, PNG (ไม่เกิน 5MB)</p>
                      </label>
                    </div>
                  </div>

                  {imagePreview && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">ตัวอย่างรูปภาพ</label>
                      <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setImagePreview('');
                            setEditingRoom({ ...editingRoom, image: '' });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSaveRoom}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                    >
                      ✓ บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingRoom(null);
                        setImagePreview('');
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
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
    </div>
  );
};

export default ManageRooms;