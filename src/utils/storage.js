import { supabase } from '../lib/supabaseClient';

/**
 * อัพโหลดรูปภาพไปยัง Supabase Storage
 * @param {File} file - ไฟล์รูปภาพที่ต้องการอัพโหลด
 * @param {string} bucket - ชื่อ bucket (เช่น 'room-images')
 * @returns {Promise<{url: string, error: any}>} - URL ของรูปภาพที่อัพโหลด
 */
export async function uploadImage(file, bucket = 'room-images') {
    try {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // อัพโหลดไฟล์
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // ดึง Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { url: publicUrl, error: null };
    } catch (error) {
        console.error('Upload error:', error);
        return { url: null, error };
    }
}

/**
 * ลบรูปภาพจาก Supabase Storage
 * @param {string} url - URL ของรูปภาพที่ต้องการลบ
 * @param {string} bucket - ชื่อ bucket
 * @returns {Promise<{success: boolean, error: any}>}
 */
export async function deleteImage(url, bucket = 'room-images') {
    try {
        if (!url) return { success: true, error: null };

        // แยกชื่อไฟล์จาก URL
        const fileName = url.split('/').pop();

        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) {
            throw error;
        }

        return { success: true, error: null };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error };
    }
}
