import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building, MapPin, Layers, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { insertData, updateData, deleteData } from '../utils/database';

const ManageBuildings = ({
  buildings = [
    { id: 1, name: 'อาคาร A', floors: 5, location: 'ฝั่งตะวันออก', description: 'อาคารสำนักงานหลัก' },
    { id: 2, name: 'อาคาร B', floors: 8, location: 'ฝั่งตะวันตก', description: 'อาคารประชุมและห้องสัมมนา' },
    { id: 3, name: 'อาคาร C', floors: 3, location: 'ฝั่งเหนือ', description: 'อาคารอเนกประสงค์' },
    { id: 4, name: 'อาคาร D', floors: 6, location: 'ฝั่งใต้', description: 'อาคารสำนักงานรอง' }
  ],
  setBuildings = () => { }
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, buildingId: null, buildingName: '' });

  const showAlert = (type, message) => {
    setAlertModal({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, type: '', message: '' });
  };

  const handleAddBuilding = () => {
    const newId = buildings.length > 0
      ? Math.max(...buildings.map(b => b.id)) + 1
      : 1;

    setEditingBuilding({
      id: newId,
      name: '',
      floors: 1,
      location: '',
      description: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditBuilding = (building) => {
    setEditingBuilding({ ...building });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveBuilding = async () => {
    if (!editingBuilding.name || !editingBuilding.location || editingBuilding.floors < 1) {
      showAlert('warning', 'กรุณากรอกข้อมูลให้ครบถ้วนและจำนวนชั้นต้องมากกว่า 0');
      return;
    }

    try {
      const buildingData = {
        name: editingBuilding.name,
        floors: parseInt(editingBuilding.floors),
        location: editingBuilding.location,
        description: editingBuilding.description || null
      };

      if (isEditing) {
        // Update in Supabase
        const { error } = await updateData('buildings', buildingData, { id: editingBuilding.id });
        if (error) throw error;

        setBuildings(buildings.map(b => b.id === editingBuilding.id ? editingBuilding : b));
        showAlert('success', 'แก้ไขข้อมูลเรียบร้อยแล้ว');
      } else {
        // Insert to Supabase
        const { data, error } = await insertData('buildings', buildingData);
        if (error) throw error;

        const newBuilding = {
          ...editingBuilding,
          id: data && data.length > 0 ? data[0].id : editingBuilding.id
        };
        setBuildings([...buildings, newBuilding]);
        showAlert('success', 'เพิ่มอาคารเรียบร้อยแล้ว');
      }

      setShowModal(false);
      setEditingBuilding(null);
    } catch (error) {
      console.error('Save building error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleDeleteClick = (building) => {
    setDeleteConfirm({
      show: true,
      buildingId: building.id,
      buildingName: building.name
    });
  };

  const confirmDelete = async () => {
    try {
      // Delete from Supabase
      const { error } = await deleteData('buildings', { id: deleteConfirm.buildingId });

      if (error) throw error;

      // Update local state
      setBuildings(buildings.filter(b => b.id !== deleteConfirm.buildingId));
      setDeleteConfirm({ show: false, buildingId: null, buildingName: '' });
      showAlert('success', 'ลบอาคารเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Delete building error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
      setDeleteConfirm({ show: false, buildingId: null, buildingName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, buildingId: null, buildingName: '' });
  };

  const totalFloors = buildings.reduce((sum, b) => sum + b.floors, 0);

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
                    ยืนยันการลบ
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    ต้องการลบอาคาร
                  </p>
                  <p className="text-gray-800 font-semibold text-base">
                    "{deleteConfirm.buildingName}"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Building className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                  จัดการอาคาร
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                  <span>อาคารทั้งหมด: {buildings.length} อาคาร</span>
                  <span>•</span>
                  <span>รวม: {totalFloors} ชั้น</span>
                </div>
              </div>
              <button
                onClick={handleAddBuilding}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                เพิ่มอาคาร
              </button>
            </div>

            {/* Buildings Grid */}
            {buildings.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">ยังไม่มีข้อมูลอาคาร</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">คลิกปุ่ม "เพิ่มอาคาร" เพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {buildings.map(building => (
                  <div key={building.id} className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 p-4 sm:p-5 rounded-xl hover:shadow-2xl hover:border-purple-400 transition-all transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{building.name}</h3>
                        {building.description && (
                          <p className="text-xs text-gray-500 mb-2">{building.description}</p>
                        )}
                      </div>
                      <Building className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                        <span className="text-gray-600">จำนวนชั้น:</span>
                        <span className="font-bold text-gray-800">{building.floors} ชั้น</span>
                      </div>
                      {building.location && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                          <span className="text-gray-600">{building.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBuilding(building)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteClick(building)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
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
        {showModal && editingBuilding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        <span>แก้ไขอาคาร</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                        <span>เพิ่มอาคาร</span>
                      </>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingBuilding(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      ชื่ออาคาร <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingBuilding.name}
                      onChange={(e) => setEditingBuilding({ ...editingBuilding, name: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="เช่น อาคาร A"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      จำนวนชั้น <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={editingBuilding.floors}
                      onChange={(e) => setEditingBuilding({ ...editingBuilding, floors: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="5"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      ที่ตั้ง <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingBuilding.location}
                      onChange={(e) => setEditingBuilding({ ...editingBuilding, location: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="เช่น ฝั่งตะวันออก"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      คำอธิบาย
                    </label>
                    <textarea
                      value={editingBuilding.description}
                      onChange={(e) => setEditingBuilding({ ...editingBuilding, description: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="รายละเอียดเพิ่มเติม..."
                      rows="3"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <button
                      onClick={handleSaveBuilding}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      ✓ บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingBuilding(null);
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

export default ManageBuildings;