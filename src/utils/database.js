import { supabase } from '../lib/supabaseClient';

/**
 * ฟังก์ชันสำหรับดึงข้อมูลจากตาราง
 * @param {string} tableName - ชื่อตาราง
 * @param {object} options - ตัวเลือกเพิ่มเติม (select, filter, order, limit)
 * @returns {Promise<{data: any[], error: any}>}
 */
export async function fetchData(tableName, options = {}) {
    try {
        let query = supabase.from(tableName);

        // Select columns
        if (options.select) {
            query = query.select(options.select);
        } else {
            query = query.select('*');
        }

        // Apply filters
        if (options.filter) {
            Object.entries(options.filter).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        // Apply ordering
        if (options.order) {
            query = query.order(options.order.column, {
                ascending: options.order.ascending !== false
            });
        }

        // Apply limit
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return { data: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับเพิ่มข้อมูลลงในตาราง
 * @param {string} tableName - ชื่อตาราง
 * @param {object|object[]} data - ข้อมูลที่ต้องการเพิ่ม
 * @returns {Promise<{data: any, error: any}>}
 */
export async function insertData(tableName, data) {
    try {
        const { data: insertedData, error } = await supabase
            .from(tableName)
            .insert(data)
            .select();

        if (error) throw error;

        return { data: insertedData, error: null };
    } catch (error) {
        console.error(`Error inserting data into ${tableName}:`, error);
        return { data: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับอัพเดทข้อมูลในตาราง
 * @param {string} tableName - ชื่อตาราง
 * @param {object} updates - ข้อมูลที่ต้องการอัพเดท
 * @param {object} filter - เงื่อนไขในการอัพเดท
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateData(tableName, updates, filter) {
    try {
        let query = supabase.from(tableName).update(updates);

        // Apply filters
        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        const { data, error } = await query.select();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error(`Error updating data in ${tableName}:`, error);
        return { data: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับลบข้อมูลจากตาราง
 * @param {string} tableName - ชื่อตาราง
 * @param {object} filter - เงื่อนไขในการลบ
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteData(tableName, filter) {
    try {
        let query = supabase.from(tableName).delete();

        // Apply filters
        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        const { data, error } = await query;

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error(`Error deleting data from ${tableName}:`, error);
        return { data: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลแบบ Real-time
 * @param {string} tableName - ชื่อตาราง
 * @param {function} callback - ฟังก์ชันที่จะถูกเรียกเมื่อมีการเปลี่ยนแปลงข้อมูล
 * @returns {object} - Subscription object
 */
export function subscribeToTable(tableName, callback) {
    const subscription = supabase
        .channel(`${tableName}_changes`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: tableName },
            (payload) => {
                callback(payload);
            }
        )
        .subscribe();

    return subscription;
}

/**
 * ฟังก์ชันสำหรับยกเลิก subscription
 * @param {object} subscription - Subscription object
 */
export async function unsubscribe(subscription) {
    if (subscription) {
        await supabase.removeChannel(subscription);
    }
}
