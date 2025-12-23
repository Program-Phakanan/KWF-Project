export const initialRooms = [
  { 
    id: 1, 
    name: 'ห้องประชุมใหญ่ A', 
    building: 'อาคาร 1', 
    floor: '3', 
    capacity: 50, 
    equipment: ['โปรเจคเตอร์', 'ไมค์', 'กระดานไวท์บอร์ด'], 
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' 
  },
  { 
    id: 2, 
    name: 'ห้องประชุมกลาง B', 
    building: 'อาคาร 1', 
    floor: '2', 
    capacity: 20, 
    equipment: ['โปรเจคเตอร์', 'กระดานไวท์บอร์ด'], 
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400' 
  },
  { 
    id: 3, 
    name: 'ห้องประชุมเล็ก C', 
    building: 'อาคาร 2', 
    floor: '1', 
    capacity: 10, 
    equipment: ['TV', 'กระดานไวท์บอร์ด'], 
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=400' 
  },
  { 
    id: 4, 
    name: 'ห้องประชุม D', 
    building: 'อาคาร 2', 
    floor: '2', 
    capacity: 30, 
    equipment: ['โปรเจคเตอร์', 'ไมค์', 'เครื่องเสียง'], 
    image: 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?w=400' 
  },
];

export const initialBookings = [
  { 
    id: 1, 
    roomId: 1, 
    date: '2025-11-05', 
    startTime: '09:00', 
    endTime: '11:00', 
    title: 'ประชุมประจำเดือน', 
    department: 'ฝ่ายบริหาร', 
    bookedBy: 'สมชาย ใจดี', 
    phone: '081-234-5678', 
    attendees: 30, 
    status: 'confirmed' 
  },
  { 
    id: 2, 
    roomId: 2, 
    date: '2025-11-05', 
    startTime: '14:00', 
    endTime: '16:00', 
    title: 'อบรมพนักงานใหม่', 
    department: 'ฝ่าย HR', 
    bookedBy: 'สมหญิง รักดี', 
    phone: '082-345-6789', 
    attendees: 15, 
    status: 'confirmed' 
  },
  { 
    id: 3, 
    roomId: 1, 
    date: '2025-11-06', 
    startTime: '10:00', 
    endTime: '12:00', 
    title: 'พบลูกค้า', 
    department: 'ฝ่ายขาย', 
    bookedBy: 'สมศักดิ์ ขายดี', 
    phone: '083-456-7890', 
    attendees: 20, 
    status: 'confirmed' 
  },
];

export const departments = [
  { id: 1, name: 'ฝ่ายบริหาร', organization: 'บริษัท ABC' },
  { id: 2, name: 'ฝ่าย HR', organization: 'บริษัท ABC' },
  { id: 3, name: 'ฝ่ายขาย', organization: 'บริษัท ABC' },
  { id: 4, name: 'ฝ่ายไอที', organization: 'บริษัท ABC' },
];

export const buildings = [
  { id: 1, name: 'อาคาร 1', floors: 5 },
  { id: 2, name: 'อาคาร 2', floors: 3 },
];

export const equipment = [
  { id: 1, name: 'โปรเจคเตอร์', quantity: 5 },
  { id: 2, name: 'ไมค์', quantity: 10 },
  { id: 3, name: 'กระดานไวท์บอร์ด', quantity: 8 },
  { id: 4, name: 'TV', quantity: 3 },
  { id: 5, name: 'เครื่องเสียง', quantity: 4 },
];