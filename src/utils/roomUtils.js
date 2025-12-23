// ตรวจสอบรูปแบบเบอร์โทรศัพท์
export const validatePhoneNumber = (phone) => {
  const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  const phoneDigits = phone.replace(/-/g, '');
  return phonePattern.test(phone) || /^[0-9]{10}$/.test(phoneDigits);
};

// จัดรูปแบบเบอร์โทรศัพท์
export const formatPhoneNumber = (value) => {
  let cleaned = value.replace(/[^0-9-]/g, '');
  if (cleaned.length === 10 && !cleaned.includes('-')) {
    cleaned = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
  }
  return cleaned;
};

// เปรียบเทียบเบอร์โทรศัพท์ (ลบขีดออกก่อนเปรียบเทียบ)
export const comparePhoneNumbers = (phone1, phone2) => {
  const clean1 = phone1.replace(/-/g, '');
  const clean2 = phone2.replace(/-/g, '');
  return clean1 === clean2;
};