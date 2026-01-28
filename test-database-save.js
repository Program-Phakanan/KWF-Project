import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// โหลด environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 ตรวจสอบการเชื่อมต่อ Supabase...\n');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'ไม่พบ');
console.log('');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ ไม่พบ environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseOperations() {
    console.log('='.repeat(60));
    console.log('🧪 เริ่มทดสอบการบันทึกข้อมูลลง Database');
    console.log('='.repeat(60));
    console.log('');

    // ทดสอบ 1: ตรวจสอบการเชื่อมต่อ
    console.log('📋 ทดสอบที่ 1: ตรวจสอบการเชื่อมต่อ');
    console.log('-'.repeat(60));
    try {
        const { data, error } = await supabase.from('equipment').select('count');
        if (error) throw error;
        console.log('✅ เชื่อมต่อ Supabase สำเร็จ!');
    } catch (error) {
        console.error('❌ ไม่สามารถเชื่อมต่อ Supabase:', error.message);
        return;
    }
    console.log('');

    // ทดสอบ 2: เพิ่มข้อมูลอุปกรณ์
    console.log('📋 ทดสอบที่ 2: เพิ่มข้อมูลอุปกรณ์ใหม่');
    console.log('-'.repeat(60));
    const testEquipment = {
        name: 'ทดสอบอุปกรณ์ ' + new Date().toLocaleTimeString('th-TH'),
        quantity: 5,
        category: 'เครื่องฉาย',
        status: 'พร้อมใช้งาน'
    };

    console.log('📝 ข้อมูลที่จะบันทึก:', testEquipment);

    try {
        const { data, error } = await supabase
            .from('equipment')
            .insert(testEquipment)
            .select();

        if (error) throw error;

        console.log('✅ บันทึกข้อมูลอุปกรณ์สำเร็จ!');
        console.log('📊 ข้อมูลที่บันทึก:', data);

        // เก็บ ID เพื่อลบทิ้งภายหลัง
        const insertedId = data[0].id;

        // ลบข้อมูลทดสอบ
        console.log('🗑️  กำลังลบข้อมูลทดสอบ...');
        const { error: deleteError } = await supabase
            .from('equipment')
            .delete()
            .eq('id', insertedId);

        if (deleteError) throw deleteError;
        console.log('✅ ลบข้อมูลทดสอบสำเร็จ');
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการบันทึกอุปกรณ์:', error.message);
        console.error('📄 รายละเอียด:', error);
    }
    console.log('');

    // ทดสอบ 3: เพิ่มข้อมูลแผนก
    console.log('📋 ทดสอบที่ 3: เพิ่มข้อมูลแผนกใหม่');
    console.log('-'.repeat(60));
    const testDepartment = {
        name: 'ทดสอบแผนก ' + new Date().toLocaleTimeString('th-TH'),
        organization: 'บริษัททดสอบ จำกัด'
    };

    console.log('📝 ข้อมูลที่จะบันทึก:', testDepartment);

    try {
        const { data, error } = await supabase
            .from('departments')
            .insert(testDepartment)
            .select();

        if (error) throw error;

        console.log('✅ บันทึกข้อมูลแผนกสำเร็จ!');
        console.log('📊 ข้อมูลที่บันทึก:', data);

        // เก็บ ID เพื่อลบทิ้งภายหลัง
        const insertedId = data[0].id;

        // ลบข้อมูลทดสอบ
        console.log('🗑️  กำลังลบข้อมูลทดสอบ...');
        const { error: deleteError } = await supabase
            .from('departments')
            .delete()
            .eq('id', insertedId);

        if (deleteError) throw deleteError;
        console.log('✅ ลบข้อมูลทดสอบสำเร็จ');
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการบันทึกแผนก:', error.message);
        console.error('📄 รายละเอียด:', error);
    }
    console.log('');

    // ทดสอบ 4: อัพเดทข้อมูล
    console.log('📋 ทดสอบที่ 4: อัพเดทข้อมูล');
    console.log('-'.repeat(60));
    try {
        // เพิ่มข้อมูลทดสอบก่อน
        const { data: insertData, error: insertError } = await supabase
            .from('equipment')
            .insert({
                name: 'ทดสอบอัพเดท',
                quantity: 1,
                category: 'อื่นๆ',
                status: 'พร้อมใช้งาน'
            })
            .select();

        if (insertError) throw insertError;

        const testId = insertData[0].id;
        console.log('📝 เพิ่มข้อมูลทดสอบ ID:', testId);

        // อัพเดทข้อมูล
        const { data: updateData, error: updateError } = await supabase
            .from('equipment')
            .update({ quantity: 10, status: 'ซ่อมบำรุง' })
            .eq('id', testId)
            .select();

        if (updateError) throw updateError;

        console.log('✅ อัพเดทข้อมูลสำเร็จ!');
        console.log('📊 ข้อมูลหลังอัพเดท:', updateData);

        // ลบข้อมูลทดสอบ
        await supabase.from('equipment').delete().eq('id', testId);
        console.log('✅ ลบข้อมูลทดสอบสำเร็จ');
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการอัพเดท:', error.message);
    }
    console.log('');

    // ทดสอบ 5: ดึงข้อมูลทั้งหมด
    console.log('📋 ทดสอบที่ 5: ดึงข้อมูลทั้งหมด');
    console.log('-'.repeat(60));
    try {
        const { data: equipmentData, error: equipmentError } = await supabase
            .from('equipment')
            .select('*');

        if (equipmentError) throw equipmentError;

        console.log('✅ ดึงข้อมูลอุปกรณ์สำเร็จ');
        console.log('📊 จำนวนอุปกรณ์ทั้งหมด:', equipmentData.length);

        const { data: departmentData, error: departmentError } = await supabase
            .from('departments')
            .select('*');

        if (departmentError) throw departmentError;

        console.log('✅ ดึงข้อมูลแผนกสำเร็จ');
        console.log('📊 จำนวนแผนกทั้งหมด:', departmentData.length);
    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    }
    console.log('');

    console.log('='.repeat(60));
    console.log('✅ การทดสอบเสร็จสมบูรณ์!');
    console.log('='.repeat(60));
}

testDatabaseOperations();
