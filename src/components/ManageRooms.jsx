import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building, Users, Upload, X } from 'lucide-react';

const ManageRooms = ({ rooms, setRooms }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleAddRoom = () => {
    setEditingRoom({
      id: rooms.length + 1,
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
    setEditingRoom({...room});
    setIsEditing(true);
    setImagePreview(room.image || '');
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('⚠️ ไฟล์ใหญ่เกิน 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setEditingRoom({...editingRoom, image: base64String});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRoom = () => {
    if (!editingRoom.name || !editingRoom.building || !editingRoom.capacity) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (isEditing) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r));
      alert('✓ แก้ไขข้อมูลเรียบร้อย!');
    } else {
      setRooms([...rooms, editingRoom]);
      alert('✓ เพิ่มห้องประชุมเรียบร้อย!');
    }
    
    setShowModal(false);
    setEditingRoom(null);
    setImagePreview('');
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('ต้องการลบห้องประชุมนี้หรือไม่?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
      alert('✓ ลบห้องประชุมเรียบร้อย');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">จัดการห้องประชุม</h2>
        <button 
          onClick={handleAddRoom}
          className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มห้องประชุม
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-40 md:h-48 bg-gray-200">
              {room.image ? (
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Meeting+Room';
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
                  onClick={() => handleDeleteRoom(room.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})}
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
                      onChange={(e) => setEditingRoom({...editingRoom, building: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="อาคาร 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">ชั้น *</label>
                    <input
                      type="text"
                      value={editingRoom.floor}
                      onChange={(e) => setEditingRoom({...editingRoom, floor: e.target.value})}
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
                    onChange={(e) => setEditingRoom({...editingRoom, capacity: parseInt(e.target.value) || 0})}
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
                          setEditingRoom({...editingRoom, image: ''});
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
  );
};

export default ManageRooms;