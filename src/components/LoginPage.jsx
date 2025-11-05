import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

const LoginPage = ({ 
  setIsLoggedIn, 
  setCurrentUser, 
  setCurrentPage 
}) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsLoggedIn(true);
      setCurrentUser({ name: 'ผู้ดูแลระบบ', role: 'admin' });
      setCurrentPage('admin');
      alert('✓ เข้าสู่ระบบสำเร็จ!');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
          <p className="text-gray-600 text-sm mt-2">ระบบจองห้องประชุม (สำหรับผู้ดูแลระบบ)</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">ข้อมูลเข้าสู่ระบบ:</p>
         <p className="font-semibold mb-1 text-red-500">นี่แค่ตัว Test ยังไม่สามารถอัพโหลดรูปภาพและเพิ่มห้องได้ครับ:</p>
          <p>Username: <span className="font-mono font-bold">admin</span></p>
          <p>Password: <span className="font-mono font-bold">admin123</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-blue-500 hover:text-blue-700 text-sm underline"
          >
            กลับหน้าแรก (จองแบบไม่ต้องเข้าสู่ระบบ)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
