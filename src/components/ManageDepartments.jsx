import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'ฝ่ายบริหาร', organization: 'บริษัท ABC จำกัด' },
    { id: 2, name: 'ฝ่ายการเงิน', organization: 'บริษัท ABC จำกัด' },
    { id: 3, name: 'ฝ่ายทรัพยากรบุคคล', organization: 'บริษัท ABC จำกัด' },
    { id: 4, name: 'ฝ่ายไอที', organization: 'บริษัท ABC จำกัด' },
    { id: 5, name: 'ฝ่ายการตลาด', organization: 'บริษัท ABC จำกัด' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setEditingDept({...dept});
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveDept = () => {
    if (!editingDept.name || !editingDept.organization) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (isEditing) {
      setDepartments(departments.map(d => d.id === editingDept.id ? editingDept : d));
      alert('✓ แก้ไขข้อมูลเรียบร้อย!');
    } else {
      setDepartments([...departments, editingDept]);
      alert('✓ เพิ่มแผนกเรียบร้อย!');
    }
    
    setShowModal(false);
    setEditingDept(null);
  };

  const handleDeleteDept = (deptId) => {
    if (window.confirm('ต้องการลบแผนกนี้หรือไม่?')) {
      setDepartments(departments.filter(d => d.id !== deptId));
      alert('✓ ลบแผนกเรียบร้อย');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Building2 className="w-8 h-8 text-blue-500" />
                  จัดการแผนก/หน่วยงาน
                </h2>
                <p className="text-sm text-gray-500 mt-1">จำนวนแผนกทั้งหมด: {departments.length} แผนก</p>
              </div>
              <button 
                onClick={handleAddDept}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มแผนก
              </button>
            </div>

            {departments.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">ยังไม่มีข้อมูลแผนก</p>
                <p className="text-gray-400 text-sm mt-2">คลิกปุ่ม "เพิ่มแผนก" เพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            ชื่อแผนก
                          </div>
                        </th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            หน่วยงาน
                          </div>
                        </th>
                        <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                          จัดการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {departments.map((dept, index) => (
                        <tr 
                          key={dept.id} 
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-4 md:px-6 py-4 text-sm md:text-base font-medium text-gray-900">
                            {dept.name}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm md:text-base text-gray-600">
                            {dept.organization}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditDept(dept)}
                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                                title="แก้ไข"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDept(dept.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && editingDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="w-6 h-6 text-blue-500" />
                      แก้ไขแผนก
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-blue-500" />
                      เพิ่มแผนก
                    </>
                  )}
                </h3>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    setEditingDept(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    ชื่อแผนก <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({...editingDept, name: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="เช่น ฝ่ายบริหาร"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    หน่วยงาน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingDept.organization}
                    onChange={(e) => setEditingDept({...editingDept, organization: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="เช่น บริษัท ABC จำกัด"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveDept}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ✓ บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingDept(null);
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

export default ManageDepartments;