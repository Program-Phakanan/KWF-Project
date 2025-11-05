import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';

const ManageEquipment = () => {
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'โปรเจคเตอร์', quantity: 5, category: 'เครื่องฉาย', status: 'พร้อมใช้งาน' },
    { id: 2, name: 'ไมโครโฟน', quantity: 10, category: 'เครื่องเสียง', status: 'พร้อมใช้งาน' },
    { id: 3, name: 'กระดานไวท์บอร์ด', quantity: 8, category: 'เครื่องเขียน', status: 'พร้อมใช้งาน' },
    { id: 4, name: 'คอมพิวเตอร์', quantity: 3, category: 'อิเล็กทรอนิกส์', status: 'พร้อมใช้งาน' },
    { id: 5, name: 'ลำโพง', quantity: 6, category: 'เครื่องเสียง', status: 'พร้อมใช้งาน' },
    { id: 6, name: 'จอทีวี', quantity: 4, category: 'เครื่องฉาย', status: 'พร้อมใช้งาน' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['เครื่องฉาย', 'เครื่องเสียง', 'เครื่องเขียน', 'อิเล็กทรอนิกส์', 'อื่นๆ'];
  const statuses = ['พร้อมใช้งาน', 'ซ่อมบำรุง', 'ชำรุด'];

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
    setEditingEquip({...equip});
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveEquip = () => {
    if (!editingEquip.name || editingEquip.quantity < 1) {
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วนและจำนวนต้องมากกว่า 0');
      return;
    }

    if (isEditing) {
      setEquipment(equipment.map(e => e.id === editingEquip.id ? editingEquip : e));
      alert('✓ แก้ไขข้อมูลเรียบร้อย!');
    } else {
      setEquipment([...equipment, editingEquip]);
      alert('✓ เพิ่มอุปกรณ์เรียบร้อย!');
    }
    
    setShowModal(false);
    setEditingEquip(null);
  };

  const handleDeleteEquip = (equipId) => {
    if (window.confirm('ต้องการลบอุปกรณ์นี้หรือไม่?')) {
      setEquipment(equipment.filter(e => e.id !== equipId));
      alert('✓ ลบอุปกรณ์เรียบร้อย');
    }
  };

  const filteredEquipment = equipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'พร้อมใช้งาน': return 'bg-green-100 text-green-800';
      case 'ซ่อมบำรุง': return 'bg-yellow-100 text-yellow-800';
      case 'ชำรุด': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalQuantity = equipment.reduce((sum, eq) => sum + eq.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Package className="w-8 h-8 text-green-500" />
                  จัดการอุปกรณ์
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>ทั้งหมด: {equipment.length} รายการ</span>
                  <span>•</span>
                  <span>จำนวนรวม: {totalQuantity} ชิ้น</span>
                </div>
              </div>
              <button 
                onClick={handleAddEquip}
                className="w-full lg:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มอุปกรณ์
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาอุปกรณ์หรือหมวดหมู่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            {/* Equipment Grid */}
            {filteredEquipment.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'ไม่พบอุปกรณ์ที่ค้นหา' : 'ยังไม่มีอุปกรณ์'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'คลิกปุ่ม "เพิ่มอุปกรณ์" เพื่อเริ่มต้น'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredEquipment.map(eq => (
                  <div key={eq.id} className="bg-white border-2 border-gray-200 p-5 rounded-xl hover:shadow-xl hover:border-green-300 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{eq.name}</h3>
                        <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {eq.category}
                        </span>
                      </div>
                      <Package className="w-8 h-8 text-green-500" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">จำนวน:</span>
                        <span className="text-lg font-bold text-gray-800">{eq.quantity} ชิ้น</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">สถานะ:</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(eq.status)}`}>
                          {eq.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditEquip(eq)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        แก้ไข
                      </button>
                      <button 
                        onClick={() => handleDeleteEquip(eq.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
      {showModal && editingEquip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="w-6 h-6 text-green-500" />
                      แก้ไขอุปกรณ์
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-green-500" />
                      เพิ่มอุปกรณ์
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

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    ชื่ออุปกรณ์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEquip.name}
                    onChange={(e) => setEditingEquip({...editingEquip, name: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="เช่น โปรเจคเตอร์"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    หมวดหมู่ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingEquip.category}
                    onChange={(e) => setEditingEquip({...editingEquip, category: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    จำนวน (ชิ้น) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingEquip.quantity}
                    onChange={(e) => setEditingEquip({...editingEquip, quantity: parseInt(e.target.value) || 0})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="10"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    สถานะ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingEquip.status}
                    onChange={(e) => setEditingEquip({...editingEquip, status: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveEquip}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ✓ บันทึก
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingEquip(null);
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

export default ManageEquipment;