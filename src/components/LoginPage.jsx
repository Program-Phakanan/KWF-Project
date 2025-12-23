import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const LoginPage = ({ 
  setIsLoggedIn, 
  setCurrentUser, 
  setCurrentPage 
}) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      setShowSuccess(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setCurrentUser({ name: 'ผู้ดูแลระบบ', role: 'admin' });
        setCurrentPage('admin');
      }, 1500);
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}img/background.jpg)`,
          filter: 'blur(4px)',
          transform: 'scale(1.05)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm mx-4 animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-in zoom-in duration-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">เข้าสู่ระบบสำเร็จ!</h3>
              <p className="text-gray-600 text-sm sm:text-base">กำลังเข้าสู่หน้าผู้ดูแลระบบ...</p>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img src={`${import.meta.env.BASE_URL}img/kwf.png`} alt="Logo" className="h-16 sm:h-20 w-auto object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">ระบบจองห้องประชุม (สำหรับผู้ดูแลระบบ)</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        )}


        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-700 text-center">
            <span className="font-semibold">สำหรับทดสอบ:</span> ชื่อผู้ใช้ admin รหัสผ่าน admin
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm underline"
          >
            กลับหน้าแรก (จองแบบไม่ต้องเข้าสู่ระบบ)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;