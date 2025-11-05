import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building, MapPin, Layers } from 'lucide-react';

const ManageBuildings = () => {
  const [buildings, setBuildings] = useState([
    { id: 1, name: 'อาคาร A', floors: 5, location: 'ฝั่งตะวันออก', description: 'อาคารสำนักงานหลัก' },
    { id: 2, name: 'อาคาร B', floors: 8, location: 'ฝั่งตะวันตก', description: 'อาคารประชุมและห้องสัมมนา' },
    { id: 3, name: 'อาคาร C', floors: 3, location: 'ฝั่งเหนือ', description: 'อาคารอเนกประสงค์' },
    { id: 4, name: 'อาคาร D', floors: 6, location: 'ฝั่งใต้', description: 'อาคารสำนักงานรอง' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setEditingBuilding({...building});
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveBuilding = () => {
    if (!editingBuilding.name || !editingBuilding.location || editingBuilding.floors < 1) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วนและจำนวนชั้นต้องมากกว่า 0');
      return;
    }

    if (isEditing) {
      setBuildings(buildings.map(b => b.id === editingBuilding.id ? editingBuilding : b));
      alert('✓ แก้ไขข้อมูลเรียบร้อย!');
    } else {
      setBuildings([...buildings, editingBuilding]);
      alert('✓ เพิ่มอาคารเรียบร้อย!');
    }
    
    setShowModal(false);
    setEditingBuilding(null);
  };

  const handleDeleteBuilding = (buildingId) => {
    if (window.confirm('ต้องการลบอาคารนี้หรือไม่?')) {
      setBuildings(buildings.filter(b => b.id !== buildingId));
      alert('✓ ลบอาคารเรียบร้อย');
    }
  };

  const totalFloors = buildings.reduce((sum, b) => sum + b.floors, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Building className="w-8 h-8 text-purple-500" />
                  จัดการอาคาร
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>อาคารทั้งหมด: {buildings.length} อาคาร</span>
                  <span>•</span>
                  <span>รวม: {totalFloors} ชั้น</span>
                </div>
              </div>
              <button 
                onClick={handleAddBuilding}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มอาคาร
              </button>
            </div>

            {/* Buildings Grid */}
            {buildings.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">ยังไม่มีข้อมูลอาคาร</p>
                <p className="text-gray-400 text-sm mt-2">คลิกปุ่ม "เพิ่มอาคาร" เพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {buildings.map(building => (
                  <div key={building.id} className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 p-5 rounded-xl hover:shadow-2xl hover:border-purple-400 transition-all transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{building.name}</h3>
                        {building.description && (
                          <p className="text-xs text-gray-500 mb-2">{building.description}</p>
                        )}
                      </div>
                      <Building className="w-10 h-10 text-purple-500" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Layers className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-600">จำนวนชั้น:</span>
                        <span className="font-bold text-gray-800">{building.floors} ชั้น</span>
                      </div>
                      {building.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-600">{building.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditBuilding(building)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        แก้ไข
                      </button>
                      <button 
                        onClick={() => handleDeleteBuilding(building.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        ลบ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && editingBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="w-6 h-6 text-purple-500" />
                      แก้ไขอาคาร
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-purple-500" />
                      เพิ่มอาคาร
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

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    ชื่อ อาคาร <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingBuilding.name}
                    onChange={(e) => setEditingBuilding({...editingBuilding, name: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="เช่น อาคาร A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    จำนวนชั้น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingBuilding.floors}
                    onChange={(e) => setEditingBuilding({...editingBuilding, floors: parseInt(e.target.value) || 0})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="5"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    ที่ตั้ง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingBuilding.location}
                    onChange={(e) => setEditingBuilding({...editingBuilding, location: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="เช่น ฝั่งตะวันออก"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={editingBuilding.description}
                    onChange={(e) => setEditingBuilding({...editingBuilding, description: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="รายละเอียดเพิ่มเติม..."
                    rows="3"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveBuilding}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ✓ บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingBuilding(null);
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

export default ManageBuildings;