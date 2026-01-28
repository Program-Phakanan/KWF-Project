import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';

const AlertModal = ({
    isOpen,
    onClose,
    type = 'info',
    title,
    message,
    confirmLabel = 'ตกลง',
    onConfirm,
    cancelLabel = 'ยกเลิก',
    onCancel,
    showButtons = true,
    children
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bgIcon: 'bg-green-50 ring-green-100 text-green-500',
                    icon: <CheckCircle className="w-10 h-10" strokeWidth={1.5} />,
                    button: 'bg-green-600 hover:bg-green-700 text-white shadow-green-200/50',
                    title: 'สำเร็จ'
                };
            case 'error':
                return {
                    bgIcon: 'bg-red-50 ring-red-100 text-red-500',
                    icon: <AlertCircle className="w-10 h-10" strokeWidth={1.5} />,
                    button: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200/50',
                    title: 'เกิดข้อผิดพลาด'
                };
            case 'warning':
                return {
                    bgIcon: 'bg-amber-50 ring-amber-100 text-amber-500',
                    icon: <AlertTriangle className="w-10 h-10" strokeWidth={1.5} />,
                    button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200/50',
                    title: 'แจ้งเตือน'
                };
            default:
                return {
                    bgIcon: 'bg-blue-50 ring-blue-100 text-blue-500',
                    icon: <Info className="w-10 h-10" strokeWidth={1.5} />,
                    button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/50',
                    title: 'ข้อมูล'
                };
        }
    };

    const styles = getTypeStyles();
    const displayTitle = title || styles.title;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

            {/* Backdrop with heavy blur */}
            <div
                className="absolute inset-0 bg-gray-900/30 backdrop-blur-xl transition-all duration-500"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={`
                relative bg-white w-full max-w-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8
                transform transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1)
                border border-white/40 ring-1 ring-black/5
                ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-4 opacity-0'}
            `}>
                {/* Floating Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200 hover:rotate-90 group"
                >
                    <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex flex-col items-center text-center">
                    {/* Icon Container with subtle layering */}
                    <div className="relative mb-6">
                        <div className={`
                            relative z-10 w-20 h-20 rounded-full flex items-center justify-center 
                            ring-8 ${styles.bgIcon}
                            transform transition-all duration-700 delay-100 
                            ${isOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
                        `}>
                            {styles.icon}
                        </div>
                        {/* Decorative background blob */}
                        <div className={`
                            absolute inset-0 bg-current opacity-20 blur-xl rounded-full scale-150
                            text-${type === 'error' ? 'red' : type === 'warning' ? 'amber' : type === 'success' ? 'green' : 'blue'}-400
                            transition-all duration-1000 ${isOpen ? 'opacity-20 scale-150' : 'opacity-0 scale-50'}
                        `} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">
                        {displayTitle}
                    </h3>

                    <p className="text-gray-500 mb-8 leading-relaxed text-sm font-medium px-2">
                        {message}
                    </p>

                    {children}

                    {showButtons && (
                        <div className="w-full flex gap-3">
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3.5 rounded-2xl text-gray-600 font-semibold text-sm bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                                >
                                    {cancelLabel}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className={`
                                    ${onCancel ? 'flex-1' : 'w-full'} py-3.5 rounded-2xl font-semibold text-sm
                                    shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                                    active:shadow-md active:scale-95
                                    transition-all duration-200 ${styles.button}
                                `}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
