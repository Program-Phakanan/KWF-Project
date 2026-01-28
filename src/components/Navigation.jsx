import React, { useState, useRef, useEffect } from 'react';
import { Calendar, LogIn, Menu, X, ChevronDown, LogOut, AlertCircle } from 'lucide-react';
import AlertModal from './AlertModal';
import { signOut } from '../utils/auth';

const Navigation = ({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  currentUser,
  setIsLoggedIn,
  setCurrentUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileManageMenuOpen, setMobileManageMenuOpen] = useState(false);
  const [desktopManageMenuOpen, setDesktopManageMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  // ปิด dropdown เมื่อคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopManageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setMobileManageMenuOpen(false);
    setDesktopManageMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // ใช้ Supabase signOut
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('✅ Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCurrentPage('home');
      setMobileMenuOpen(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Logout Confirmation Modal */}
      <AlertModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        type="warning"
        title="ยืนยันการออกจากระบบ"
        message="คุณต้องการออกจากระบบใช่หรือไม่?"
        confirmLabel="ออกจากระบบ"
        onConfirm={handleLogout}
        cancelLabel="ยกเลิก"
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('home')}>
            <img src={`${import.meta.env.BASE_URL}img/kwf.png`} alt="Logo" className="h-8 sm:h-10 w-auto mr-2 sm:mr-3 object-contain" />
            <span className="text-base sm:text-xl font-bold text-gray-800">ระบบจองห้องประชุม</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={'px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ' + (currentPage === 'home' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
            >
              หน้าแรก
            </button>

            {isLoggedIn && (
              <>
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={'px-3 py-2 rounded-lg transition-colors ' + (currentPage === 'admin' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
                >
                  แดชบอร์ดแอดมิน
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDesktopManageMenuOpen(!desktopManageMenuOpen)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    จัดการข้อมูล
                    <ChevronDown className={`w-4 h-4 transition-transform ${desktopManageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {desktopManageMenuOpen && (
                    <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-2 w-48 z-10 right-0 border border-gray-200">
                      <button onClick={() => handleNavigation('manage-rooms')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">จัดการห้องประชุม</button>
                      <button onClick={() => handleNavigation('manage-bookings')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">จัดการการจอง</button>
                      <button onClick={() => handleNavigation('manage-departments')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">จัดการแผนก</button>
                      <button onClick={() => handleNavigation('manage-buildings')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">จัดการอาคาร</button>
                      <button onClick={() => handleNavigation('manage-equipment')} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">จัดการอุปกรณ์</button>


                    </div>
                  )}
                </div>
              </>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm text-gray-600">สวัสดี, {currentUser ? currentUser.name : 'ผู้ใช้'}</span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                เข้าสู่ระบบ
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2 bg-white">
            <button
              onClick={() => handleNavigation('home')}
              className={'block w-full text-left px-3 py-2 rounded-lg transition-colors ' + (currentPage === 'home' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
            >
              หน้าแรก
            </button>

            {isLoggedIn && (
              <>
                <button
                  onClick={() => handleNavigation('admin')}
                  className={'block w-full text-left px-3 py-2 rounded-lg transition-colors ' + (currentPage === 'admin' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100')}
                >
                  แดชบอร์ดแอดมิน
                </button>

                <div className="space-y-1">
                  <button
                    onClick={() => setMobileManageMenuOpen(!mobileManageMenuOpen)}
                    className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span>จัดการข้อมูล</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileManageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileManageMenuOpen && (
                    <div className="pl-4 space-y-1 bg-white">
                      <button onClick={() => handleNavigation('manage-rooms')} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">📋 จัดการห้องประชุม</button>
                      <button onClick={() => handleNavigation('manage-bookings')} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">📅 จัดการการจอง</button>
                      <button onClick={() => handleNavigation('manage-departments')} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">🏢 จัดการแผนก</button>
                      <button onClick={() => handleNavigation('manage-buildings')} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">🏛️ จัดการอาคาร</button>
                      <button onClick={() => handleNavigation('manage-equipment')} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-lg text-sm">⚙️ จัดการอุปกรณ์</button>


                    </div>
                  )}
                </div>
              </>
            )}

            <div className="border-t border-gray-200 pt-3 mt-3">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    👤 สวัสดี, {currentUser ? currentUser.name : 'ผู้ใช้'}
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="block w-full text-left px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🚪 ออกจากระบบ
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation('login')}
                  className="flex items-center w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;