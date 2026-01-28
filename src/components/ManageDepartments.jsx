import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { insertData, updateData, deleteData } from '../utils/database';

const ManageDepartments = ({
  departments = [
    { id: 1, name: 'ฝ่ายบริหาร', organization: 'บริษัท ABC จำกัด' },
    { id: 2, name: 'ฝ่ายการเงิน', organization: 'บริษัท ABC จำกัด' },
    { id: 3, name: 'ฝ่ายทรัพยากรบุคคล', organization: 'บริษัท ABC จำกัด' },
    { id: 4, name: 'ฝ่ายไอที', organization: 'บริษัท ABC จำกัด' },
    { id: 5, name: 'ฝ่ายการตลาด', organization: 'บริษัท ABC จำกัด' }
  ],
  setDepartments = () => { }
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertModal, setAlertModal] = useState({ show: false, type: '', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, deptId: null, deptName: '' });

  const showAlert = (type, message) => {
    setAlertModal({ show: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal({ show: false, type: '', message: '' });
  };

  const handleAddDept = () => {
    const newId = departments.length > 0
      ? Math.max(...departments.map(d => d.id)) + 1
      : 1;

    setEditingDept({
      id: newId,
      name: '',
      organization: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditDept = (dept) => {
    setEditingDept({ ...dept });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveDept = async () => {
    if (!editingDept.name || !editingDept.organization) {
      showAlert('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const deptData = {
        name: editingDept.name,
        organization: editingDept.organization
      };

      if (isEditing) {
        // Update in Supabase
        const { error } = await updateData('departments', deptData, { id: editingDept.id });
        if (error) throw error;

        setDepartments(departments.map(d => d.id === editingDept.id ? editingDept : d));
        showAlert('success', 'แก้ไขข้อมูลแผนกเรียบร้อยแล้ว');
      } else {
        // Insert to Supabase
        const { data, error } = await insertData('departments', deptData);
        if (error) throw error;

        const newDept = {
          ...editingDept,
          id: data && data.length > 0 ? data[0].id : editingDept.id
        };
        setDepartments([...departments, newDept]);
        showAlert('success', 'เพิ่มแผนกใหม่เรียบร้อยแล้ว');
      }

      setShowModal(false);
      setEditingDept(null);
    } catch (error) {
      console.error('Save department error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  const handleDeleteClick = (dept) => {
    setDeleteConfirm({
      show: true,
      deptId: dept.id,
      deptName: dept.name
    });
  };

  const confirmDelete = async () => {
    try {
      // Delete from Supabase
      const { error } = await deleteData('departments', { id: deleteConfirm.deptId });

      if (error) throw error;

      // Update local state
      setDepartments(departments.filter(d => d.id !== deleteConfirm.deptId));
      setDeleteConfirm({ show: false, deptId: null, deptName: '' });
      showAlert('success', 'ลบแผนกเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Delete department error:', error);
      showAlert('error', 'เกิดข้อผิดพลาด: ' + error.message);
      setDeleteConfirm({ show: false, deptId: null, deptName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, deptId: null, deptName: '' });
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
                    className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm ${alertModal.type === 'success'
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
                    ต้องการลบแผนก
                  </p>
                  <p className="text-gray-800 font-semibold text-base">
                    "{deleteConfirm.deptName}"
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
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
                จัดการแผนก/หน่วยงาน
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">จำนวนแผนกทั้งหมด: {departments.length} แผนก</p>
            </div>
            <button
              onClick={handleAddDept}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              เพิ่มแผนก
            </button>
          </div>

          {/* Department List */}
          {departments.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">ยังไม่มีข้อมูลแผนก</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">คลิกปุ่ม "เพิ่มแผนก" เพื่อเริ่มต้น</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              {/* Table Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 border-b border-gray-200">
                <div className="col-span-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  ชื่อแผนก
                </div>
                <div className="col-span-6 flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  หน่วยงาน
                </div>
                <div className="col-span-2 text-xs sm:text-sm font-semibold text-gray-600 text-right">
                  จัดการ
                </div>
              </div>

              {/* Table Body - Desktop */}
              <div className="hidden md:block divide-y divide-gray-200">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-white transition-colors"
                  >
                    <div className="col-span-4 text-gray-900 font-medium text-sm">
                      {dept.name}
                    </div>
                    <div className="col-span-6 text-gray-600 text-sm">
                      {dept.organization}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditDept(dept)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-all"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dept)}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-all"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-gray-200">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-4 hover:bg-white transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-gray-900 text-sm">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{dept.organization}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditDept(dept)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-all"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(dept)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded transition-all"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && editingDept && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <span>แก้ไขแผนก</span>
                      </>
                    ) : (
                      <>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <span>เพิ่มแผนก</span>
                      </>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingDept(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      ชื่อแผนก <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingDept.name}
                      onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="เช่น ฝ่ายบริหาร"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-gray-700">
                      หน่วยงาน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingDept.organization}
                      onChange={(e) => setEditingDept({ ...editingDept, organization: e.target.value })}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="เช่น บริษัท ABC จำกัด"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={handleSaveDept}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                    >
                      ✓ บันทึก
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEditingDept(null);
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-300 font-semibold transition-all text-sm"
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

export default ManageDepartments;