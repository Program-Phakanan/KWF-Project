import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { insertData, updateData, deleteData } from '../utils/database';

const ManageEquipment = ({ equipment, setEquipment }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertModal, setAlertModal] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, equipId: null, equipName: '' });

  const categories = ['เครื่องฉาย', 'เครื่องเสียง', 'เครื่องเขียน', 'อิเล็กทรอนิกส์', 'อื่นๆ'];
  const statuses = ['พร้อมใช้งาน', 'ซ่อมบำรุง', 'ชำรุด'];

  const showAlert = (type, message) => {
    setAlertModal({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, type: '', message: '' });
  };

  const handleAddEquip = () => {
    const newId = equipment.length > 0
      ? Math.max(...equipment.map(e => e.id)) + 1
      : 1;

    setEditingEquip({
      id: newId,
      name: '',
      quantity: 0,
      category: 'เครื่องฉาย',
      status: 'พร้อมใช้งาน'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditEquip = (equip) => {
    setEditingEquip({ ...equip });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveEquip = async () => {
    if (!editingEquip.name || editingEquip.quantity < 1) {
      showAlert('warning', 'กรุณากรอกข้อมูลให้ครบถ้วนและจำนวนต้องมากกว่า 0');
      return;
    }

    try {
      const equipData = {
        name: editingEquip.name,
        quantity: parseInt(editingEquip.quantity),
        category: editingEquip.category,
        status: editingEquip.status
      };

      if (isEditing) {
        // Update in Supabase
        const { error } = await updateData('equipment', equipData, { id: editingEquip.id });
        if (error) throw error;

        setEquipment(equipment.map(e => e.id === editingEquip.id ? editingEquip : e));
        showAlert('success', 'แก้ไขข้อมูลเรียบร้อยแล้ว');
      } else {
        // Insert to Supabase
        const { data, error } = await insertData('equipment', equipData);
        if (error) throw error;

        const newEquip = {
          ...editingEquip,
          id: data && data.length > 0 ? data[0].id : editingEquip.id
        };
        setEquipment([...equipment, newEquip]);
        showAlert('success', 'เพิ่มอุปกรณ์เรียบร้อยแล้ว');
      }

      setShowModal(false);
      setEditingEquip(null);
    } catch (error) {
      console.error('Save equipment error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleDeleteClick = (equip) => {
    setDeleteConfirm({
      show: true,
      equipId: equip.id,
      equipName: equip.name
    });
  };

  const confirmDelete = async () => {
    try {
      // Delete from Supabase
      const { error } = await deleteData('equipment', { id: deleteConfirm.equipId });

      if (error) throw error;

      // Update local state
      setEquipment(equipment.filter(e => e.id !== deleteConfirm.equipId));
      setDeleteConfirm({ show: false, equipId: null, equipName: '' });
      showAlert('success', 'ลบอุปกรณ์เรียบร้อยแล้ว');
    } catch (error) {
      console.error('Delete equipment error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
      setDeleteConfirm({ show: false, equipId: null, equipName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, equipId: null, equipName: '' });
  };

  const filteredEquipment = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'พร้อมใช้งาน': return 'bg-green-100 text-green-800';
      case 'ซ่อมบำรุง': return 'bg-yellow-100 text-yellow-800';
      case 'ชำรุด': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalQuantity = equipment.reduce((sum, eq) => sum + eq.quantity, 0);

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
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">ยืนยันการลบ</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์ <br />
                    <span className="font-semibold text-gray-800">"{deleteConfirm.equipName}"</span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={cancelDelete}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-300 text-sm"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm hover:from-red-600 hover:to-red-700"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">จัดการอุปกรณ์</h1>
                <p className="text-sm sm:text-base text-green-100">เพิ่ม ลบ แก้ไขอุปกรณ์ในระบบ</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-lg">
                <p className="text-xs sm:text-sm text-green-100">จำนวนอุปกรณ์ทั้งหมด</p>
                <p className="text-2xl sm:text-3xl font-bold">{totalQuantity} ชิ้น</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาอุปกรณ์หรือหมวดหมู่..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                />
              </div>
              <button
                onClick={handleAddEquip}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base font-semibold whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                เพิ่มอุปกรณ์
              </button>
            </div>

            {filteredEquipment.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">
                  {searchTerm ? 'ไม่พบอุปกรณ์ที่ค้นหา' : 'ยังไม่มีอุปกรณ์'}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">
                  {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'คลิกปุ่ม "เพิ่มอุปกรณ์" เพื่อเริ่มต้น'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredEquipment.map(eq => (
                  <div key={eq.id} className="bg-white border-2 border-gray-200 p-4 sm:p-5 rounded-xl hover:shadow-xl hover:border-green-300 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{eq.name}</h3>
                        <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {eq.category}
                        </span>
                      </div>
                      <Package className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">จำนวน:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-800">{eq.quantity} ชิ้น</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">สถานะ:</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(eq.status)}`}>
                          {eq.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEquip(eq)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteClick(eq)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit/Add Modal */}
        {showModal && editingEquip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                        <span>แก้ไขอุปกรณ์</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                        <span>เพิ่มอุปกรณ์</span>
                      </>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingEquip(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingEquip.name}
                      onChange={(e) => setEditingEquip({ ...editingEquip, name: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="เช่น โปรเจคเตอร์"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      หมวดหมู่ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingEquip.category}
                      onChange={(e) => setEditingEquip({ ...editingEquip, category: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      จำนวน (ชิ้น) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editingEquip.quantity}
                      onChange={(e) => setEditingEquip({ ...editingEquip, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="10"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      สถานะ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingEquip.status}
                      onChange={(e) => setEditingEquip({ ...editingEquip, status: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <button
                      onClick={handleSaveEquip}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      ✓ บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingEquip(null);
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

export default ManageEquipment;