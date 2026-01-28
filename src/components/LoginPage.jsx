import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import AlertModal from './AlertModal';
import { signIn, signUp } from '../utils/auth';

const LoginPage = ({
  setIsLoggedIn,
  setCurrentUser,
  setCurrentPage
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // โดเมนสำหรับแปลง Username เป็น Email (ระบบจำลอง)
  const SYSTEM_DOMAIN = '@kwf.local';

  const toEmail = (username) => {
    if (username.includes('@')) return username;
    return `${username}${SYSTEM_DOMAIN}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // แปลง Username เป็น Email ก่อนส่งให้ Supabase
      const email = toEmail(loginForm.username);

      // ใช้ Supabase Auth สำหรับการเข้าสู่ระบบ
      const { user, session, error: authError } = await signIn(
        email,
        loginForm.password
      );

      if (authError) {
        // ถ้า Supabase Auth ล้มเหลว ลองใช้ hardcoded credentials สำหรับทดสอบ
        if (loginForm.username === 'admin' && loginForm.password === 'admin') {
          console.warn('⚠️ Using fallback authentication (hardcoded)');
          setSuccessMessage('กำลังเข้าสู่หน้าผู้ดูแลระบบ...');
          setShowSuccess(true);
          setTimeout(() => {
            setIsLoggedIn(true);
            setCurrentUser({ name: 'ผู้ดูแลระบบ', role: 'admin', email: 'admin@local' });
            setCurrentPage('admin');
            setIsLoading(false);
          }, 1500);
        } else {
          throw authError;
        }
      } else if (user) {
        // Login สำเร็จด้วย Supabase
        console.log('✅ Logged in with Supabase:', user.email);
        setSuccessMessage('กำลังเข้าสู่หน้าผู้ดูแลระบบ...');
        setShowSuccess(true);
        setTimeout(() => {
          setIsLoggedIn(true);
          setCurrentUser({
            name: user.user_metadata?.name || loginForm.username,
            role: 'admin',
            email: user.email,
            id: user.id
          });
          setCurrentPage('admin');
          setIsLoading(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      // แปล error message ให้เป็นภาษาไทย
      let errorMsg = err.message;
      if (err.message.includes('Invalid login credentials')) errorMsg = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (loginForm.password !== loginForm.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (loginForm.password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setIsLoading(true);

    try {
      // แปลง Username เป็น Email ก่อนสมัคร
      const email = toEmail(loginForm.username);

      const { user, error: signUpError } = await signUp(
        email,
        loginForm.password,
        { name: loginForm.username } // เก็บชื่อ Username ไว้ใน metadata
      );

      if (signUpError) throw signUpError;

      console.log('✅ Signed up successfully:', user);
      setSuccessMessage('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      setShowSuccess(true);

      // หลังจากสมัครเสร็จ ให้สลับไปหน้า Login
      setTimeout(() => {
        setIsLoginMode(true);
        setShowSuccess(false);
        setLoginForm({ username: '', password: '', confirmPassword: '' });
        setError('');
        setIsLoading(false);
      }, 1500);

    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}img/background.jpg)`,
          filter: 'blur(4px)',
          transform: 'scale(1.05)'
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* Modern Alert Modal with Loader (No Buttons) */}
      <AlertModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title={isLoginMode ? "เข้าสู่ระบบสำเร็จ!" : "สมัครสมาชิกสำเร็จ!"}
        message={successMessage}
        showButtons={false}
      >
        <div className="flex justify-center mb-2">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </AlertModal>

      <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md relative z-10 transition-all duration-300">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mx-auto mb-4">
            <img src={`${import.meta.env.BASE_URL}img/kwf.png`} alt="Logo" className="h-16 sm:h-20 w-auto object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {isLoginMode ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกผู้ดูแลระบบ'}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">ระบบจองห้องประชุม (สำหรับผู้ดูแลระบบ)</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={isLoginMode ? handleLogin : handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้ (Username)</label>
            <input
              type="text" // using type text for potential username login if modified, but email is standard
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="กรอกชื่อผู้ใช้ (เช่น admin)"
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                value={loginForm.confirmPassword}
                onChange={(e) => setLoginForm({ ...loginForm, confirmPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2.5 sm:py-3 rounded-lg transition-colors font-semibold text-sm sm:text-base ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : isLoginMode
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-green-500 hover:bg-green-600'
              }`}
          >
            {isLoading ? 'กำลังประมวลผล...' : (isLoginMode ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
              setLoginForm({ username: '', password: '', confirmPassword: '' });
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
          >
            {isLoginMode ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
          </button>
        </div>

        {isLoginMode && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700 text-center">
              <span className="font-semibold">สำหรับทดสอบ:</span> ชื่อผู้ใช้ <code>admin</code> รหัสผ่าน <code>admin</code>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm underline"
          >
            ← กลับหน้าแรก (จองแบบไม่ต้องเข้าสู่ระบบ)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;